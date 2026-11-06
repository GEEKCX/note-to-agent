# Note to Agent

一个 Obsidian 插件：一键把当前正在读的笔记发送到任意 AI Agent 应用——你用的桌面 Agent、编程 CLI 封装，都行。点一下就把笔记（可选附带路径）复制到剪贴板并唤起目标 App，直接粘进 Agent 的输入框。

作者：[geekcx](https://github.com/geekcx) · 许可证：MIT

[English](README.md)

## 它解决什么问题

Obsidian 的文件树是虚拟界面。把笔记从文件树拖到别的 App 时，对方拿到的只是 obsidian://open?vault=...&file=... 这样的链接，**不是真实文件**。

而大多数 Agent 应用只认「真实文件拖拽」（drop 处理只读 `dataTransfer.files`）。链接拖拽不带文件，所以不会有任何反应。最后你只能每次手动复制笔记路径。

社区插件 [Drag Out](https://github.com/xwberry/obsidian-drag-out) 试图用 Electron 的 `webContents.startDrag` 解决，但它只在 Windows 上验证过，macOS 上不可靠。

## 工作原理

不拖拽，直接绕开这个问题：

1. 从仓库读取当前笔记。
2. 把笔记正文（可选附带绝对路径）复制到剪贴板。
3. 唤起目标 App。
4. 在它的输入框按 `⌘V` 粘贴，回车发送。

没有任何网络请求，内容不会离开你的电脑。

## 安装

1. 把本目录整个拷到你的 vault：

   ```
   <vault>/.obsidian/plugins/note-to-agent/
   ```

2. 重启 Obsidian，设置 → 第三方插件 → 打开 **Note to Agent**。

（提交到 Obsidian 社区插件目录后，也可以直接在 Obsidian 里安装。）

## 用法

打开任意笔记，然后：

- 在命令面板执行「**把当前笔记发送到 Agent**」，或
- 点左侧栏的纸飞机图标。

插件会把笔记复制到剪贴板并唤起目标 App，`⌘V` 粘贴后发送。

## 命令

| 命令 | 作用 |
| --- | --- |
| 把当前笔记发送到 Agent | 复制笔记正文（+路径）到剪贴板并唤起目标 App |
| 复制当前笔记的绝对路径 | 只复制笔记的绝对路径，让 Agent 自己读文件 |

## 设置

| 设置 | 说明 |
| --- | --- |
| Target app | 要唤起的 App 名，跟 macOS 上的名称一致。任何输入框能粘贴文本的 Agent 应用都行。 |
| Include note path | 在粘贴内容前加一行笔记路径，方便 Agent 直接读原文件。 |

## 备注

- **隐私**：插件只使用本机剪贴板，笔记内容不会离开你的电脑。
- 如果你更想要「真实文件拖进输入框」，目前可靠的办法是从 Finder 直接拖那个 `.md` 到目标 App 的输入框（drop 白名单包含 `.md`，单文件 ≤10MB）。
