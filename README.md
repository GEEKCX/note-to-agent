# Note to Agent（Obsidian 插件）

作者：[geekcx](https://github.com/geekcx) · 许可证：MIT

> 已提交到 Obsidian 社区插件目录：在 Obsidian 里 设置 → 第三方插件 → 搜索 **Note to Agent** 即可安装。

## 它解决什么问题

Obsidian 的文件树是虚拟界面。把笔记从文件树拖到别的 App 时，对方拿到的只是

```
obsidian://open?vault=Vault&file=Note.md
```

这样的链接，**不是真实文件**。而各家 Agent 的输入框基本只认「真实文件拖拽」
（drop 处理只读 `dataTransfer.files`），所以从 Obsidian 拖笔记进 Agent 一直没有反应。

（社区里有个 [Drag Out](https://github.com/xwberry/obsidian-drag-out) 插件试图用
Electron `webContents.startDrag` 解决，但只在 Windows 上验证过，macOS 不可用。）

## 用法

1. 把本目录整个拷到你的 vault：
   ```
   <vault>/.obsidian/plugins/note-to-agent/
   ```
2. 重启 Obsidian，设置 → 第三方插件 → 打开 **Note to Agent**。
3. 打开任意笔记，用命令面板搜「把当前笔记发送到 Agent」，或点左侧栏的纸飞机图标。
4. 插件会把笔记正文（可选附带绝对路径）复制到剪贴板，并唤起目标 App。
5. 在目标 App 的输入框按 `⌘V` 粘贴，回车发送。

## 目标 App

默认唤起 **Alma**。在插件设置里可以改成任意 App 名（对应 macOS 上的 App 名称），
实测 **Codex**、**Claude** 同样可用——只要那个 App 的输入框能粘贴文本就行。

## 命令

| 命令 | 作用 |
| --- | --- |
| 把当前笔记发送到 Agent | 复制「正文（+路径）」到剪贴板，并唤起目标 App |
| 复制当前笔记的绝对路径 | 只复制绝对路径（给 Agent 让它自己读文件） |

## 设置

| 设置 | 说明 |
| --- | --- |
| 目标 App | 唤起的应用名，默认 Alma，可填 Codex / Claude / 任意 |
| 附带笔记绝对路径 | 粘贴内容前先加一行「【笔记路径】…」 |

## 备注

- **隐私**：全程只走本机剪贴板，笔记内容不会离开这台电脑，插件没有任何网络请求。
- 如果你更想要「真实文件拖进输入框」，目前可靠的办法是从 Finder 直接拖那个 `.md`
  到目标 App 的输入框（Alma 的白名单里包含 `.md`，单文件 ≤10MB）。
