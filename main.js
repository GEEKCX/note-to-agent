/*
 * Agent Send - Obsidian plugin
 * 作者: geekcx  (https://github.com/geekcx)
 *
 * 解决的问题：Obsidian 的文件树是虚拟界面，直接把笔记拖到别的 App，
 * 对方拿到的只是 obsidian://open?vault=...&file=... 链接，不是真实文件。
 * 而 Alma 的输入框只认「真实文件拖拽」（dataTransfer.files），所以拖了没反应。
 *
 * 这个插件绕开拖拽：一键把当前笔记的内容 + 绝对路径复制到剪贴板，
 * 并唤起 Alma，然后到 Alma 输入框 ⌘V 粘贴、回车发送。
 */
const { Plugin, Notice } = require("obsidian");

const ALMA_APP = "Alma";

const SEND_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>';

module.exports = class AgentSendPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "send-active-note-to-alma",
      name: "把当前笔记发送到 Alma",
      editorCallback: (editor, file) => this.sendNote(file),
      callback: () => this.sendNote(this.app.workspace.getActiveFile()),
    });
    this.addCommand({
      id: "copy-active-note-path",
      name: "复制当前笔记的绝对路径",
      editorCallback: (editor, file) => this.copyPath(file),
      callback: () => this.copyPath(this.app.workspace.getActiveFile()),
    });
    this.addRibbonIcon(SEND_ICON, "把当前笔记发送到 Alma", () =>
      this.sendNote(this.app.workspace.getActiveFile())
    );
  }

  absPath(file) {
    try {
      return this.app.vault.adapter.getFullPath(file.path);
    } catch (e) {
      return null;
    }
  }

  async copyPath(file) {
    if (!file) {
      new Notice("没有打开的笔记");
      return;
    }
    const p = this.absPath(file);
    if (!p) {
      new Notice("取不到绝对路径");
      return;
    }
    await this.writeClipboard(p);
    new Notice("已复制路径：" + p);
  }

  async sendNote(file) {
    if (!file) {
      new Notice("没有打开的笔记");
      return;
    }
    const p = this.absPath(file);
    let content = "";
    try {
      content = await this.app.vault.read(file);
    } catch (e) {
      new Notice("读取笔记失败：" + (e && e.message ? e.message : e));
      return;
    }
    const payload = "【笔记路径】" + (p || file.path) + "\n\n" + content;
    const ok = await this.writeClipboard(payload);
    if (!ok) return;
    this.openAlma();
    new Notice("已复制笔记内容，Alma 已唤起。到 Alma 输入框按 \u2318V 粘贴，回车发送。");
  }

  async writeClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      try {
        const { execSync } = require("child_process");
        const tmp = "/tmp/agent-send-clip.txt";
        require("fs").writeFileSync(tmp, text);
        execSync('pbcopy < "' + tmp + '"');
        return true;
      } catch (e2) {
        new Notice("复制失败：" + (e2 && e2.message ? e2.message : e2));
        return false;
      }
    }
  }

  openAlma() {
    try {
      const { exec } = require("child_process");
      exec("open -a " + ALMA_APP, () => {});
    } catch (e) {
      /* ignore */
    }
  }
};
