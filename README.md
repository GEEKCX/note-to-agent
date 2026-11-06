# Agent Send（Obsidian 插件）

作者：[geekcx](https://github.com/geekcx)

## 它解决什么问题

Obsidian 的文件树是虚拟界面。把笔记从文件树拖到别的 App 时，对方拿到的只是

```
obsidian://open?vault=Vault&file=Note.md
```

这样的链接，**不是真实文件**。而 Alma 的输入框只认「真实文件拖拽」
（drop 处理只读 `dataTransfer.files`），所以从 Obsidian 拖笔记进 Alma 一直没有反应。

（社区里有个 [Drag Out](https://github.com/xwberry/obsidian-drag-out) 插件试图用
Electron `webContents.startDrag` 解决，但只在 Windows 上验证过，macOS 不可用。）

## 用法

1. 把本目录整个拷到你的 vault：
   ```
   <vault>/.obsidian/plugins/agent-send/
   ```
2. 重启 Obsidian，设置 → 第三方插件 → 打开 **Agent Send**。
3. 打开任意笔记，用命令面板搜「把当前笔记发送到 Alma」，或点左侧栏的纸飞机图标。
4. 插件会把「笔记绝对路径 + 正文」复制到剪贴板，并唤起 Alma。
5. 在 Alma 输入框按 `⌘V` 粘贴，回车发送。

## 命令

| 命令 | 作用 |
| --- | --- |
| 把当前笔记发送到 Alma | 复制「路径 + 正文」到剪贴板，并唤起 Alma |
| 复制当前笔记的绝对路径 | 只复制绝对路径（给 Agent 让它自己读文件） |

## 备注

- 只复制内容、不上传：全程走本机剪贴板，笔记内容不会离开这台电脑。
- 如果你更想要「真实文件拖进输入框」，目前可靠的办法是从 Finder 直接拖那个 `.md`
  到 Alma 输入框（Alma 的白名单里包含 `.md`，单文件 ≤10MB）。
