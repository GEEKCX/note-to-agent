/*
 * Note to Agent - Obsidian plugin
 * 作者: geekcx  (https://github.com/geekcx)
 *
 * 解决的问题：Obsidian 的文件树是虚拟界面。把笔记从文件树拖到别的 App 时，
 * 对方拿到的只是 obsidian://open?vault=...&file=... 链接，不是真实文件。
 * 而各家 Agent 的输入框基本只认「真实文件拖拽」（dataTransfer.files），
 * 所以从 Obsidian 拖笔记进 Agent 一直没反应。
 *
 * 这个插件绕开拖拽：一键把当前笔记的内容 + 绝对路径复制到剪贴板，
 * 再唤起目标 App，然后到输入框 ⌘V 粘贴、回车发送。
 * 目标 App 可在设置里改，默认 Alma，实测 Codex / Claude 同样可用。
 */
const { Plugin, Notice, Setting } = require("obsidian");

const DEFAULT_TARGET = "Alma";
const DEFAULTS = { targetApp: DEFAULT_TARGET, includePath: true };

const SEND_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>';

module.exports = class NoteToAgentPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: "send-active-note-to-agent",
      name: "把当前笔记发送到 Agent",
      editorCallback: (editor, file) => this.sendNote(file),
      callback: () => this.sendNote(this.app.workspace.getActiveFile()),
    });
    this.addCommand({
      id: "copy-active-note-path",
      name: "复制当前笔记的绝对路径",
      editorCallback: (editor, file) => this.copyPath(file),
      callback: () => this.copyPath(this.app.workspace.getActiveFile()),
    });
    this.addSettingTab(new TargetSettingTab(this.app, this));
    this.addRibbonIcon(SEND_ICON, "把当前笔记发送到 Agent", () =>
      this.sendNote(this.app.workspace.getActiveFile())
    );
  }

  async loadSettings() {
    const d = await this.loadData();
    this.settings = Object.assign({}, DEFAULTS, d && typeof d === "object" ? d : {});
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }

  absPath(file) {
    try {
      return this.app.vault.adapter.getFullPath(file.path);
    } catch (e) {
      return null;
    }
  }

  async copyPath(file) {
    if (!file) { new Notice("没有打开的笔记"); return; }
    const p = this.absPath(file);
    if (!p) { new Notice("取不到绝对路径"); return; }
    await this.writeClipboard(p);
    new Notice("已复制路径：" + p);
  }

  async sendNote(file) {
    if (!file) { new Notice("没有打开的笔记"); return; }
    const p = this.absPath(file);
    let content = "";
    try {
      content = await this.app.vault.read(file);
    } catch (e) {
      new Notice("读取笔记失败：" + (e && e.message ? e.message : e));
      return;
    }
    let payload = content;
    if (this.settings.includePath && p) {
      payload = "【笔记路径】" + p + "\n\n" + content;
    }
    const ok = await this.writeClipboard(payload);
    if (!ok) return;
    const target = (this.settings.targetApp || DEFAULT_TARGET).trim() || DEFAULT_TARGET;
    this.openApp(target);
    new Notice("已复制笔记内容，正在唤起 " + target + "。到它的输入框按 \u2318V 粘贴，回车发送。");
  }

  async writeClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      try {
        const { execSync } = require("child_process");
        const tmp = "/tmp/note-to-agent-clip.txt";
        require("fs").writeFileSync(tmp, text);
        execSync('pbcopy < "' + tmp + '"');
        return true;
      } catch (e2) {
        new Notice("复制失败：" + (e2 && e2.message ? e2.message : e2));
        return false;
      }
    }
  }

  openApp(name) {
    try {
      const { exec } = require("child_process");
      exec("open -a " + JSON.stringify(name), () => {});
    } catch (e) { /* ignore */ }
  }
};

class TargetSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new Setting(containerEl)
      .setName("目标 App")
      .setDesc("点击发送后要唤起的应用名，对应 macOS 上的 App 名称。可填 Alma / Codex / Claude，或任意支持粘贴的 App。")
      .addText((t) => t.setValue(this.plugin.settings.targetApp).onChange(async (v) => {
        this.plugin.settings.targetApp = v;
        await this.plugin.saveSettings();
      }));
    new Setting(containerEl)
      .setName("附带笔记绝对路径")
      .setDesc("粘贴内容前先加一行「【笔记路径】…」，方便 Agent 直接读原文件。")
      .addToggle((t) => t.setValue(this.plugin.settings.includePath).onChange(async (v) => {
        this.plugin.settings.includePath = v;
        await this.plugin.saveSettings();
      }));
  }
}
