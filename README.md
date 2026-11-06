# Note to Agent

An Obsidian plugin that sends the note you are reading to any AI agent app — your desktop agent, a coding CLI wrapper, whatever you use. One click copies the note (and optionally its path) to the clipboard and launches the target app, so you can paste it straight into the agent input box.

Author: [geekcx](https://github.com/geekcx) · License: MIT

[简体中文](README.zh.md)

## The problem

Obsidian's file tree is a virtual UI. When you drag a note out of it, other apps receive an obsidian://open?vault=...&file=... link — **not the actual file**.

Most agent apps only accept real file drops (their drop handlers read `dataTransfer.files`). A link-drag carries no file, so nothing happens. You end up copying the note path manually every time.

The community plugin [Drag Out](https://github.com/xwberry/obsidian-drag-out) tries to fix this with Electron's `webContents.startDrag`, but it is only verified on Windows and does not work reliably on macOS.

## How it works

Instead of dragging, this plugin bypasses the problem entirely:

1. Reads the current note from the vault.
2. Copies the note body (optionally prefixed with its absolute path) to the clipboard.
3. Launches the target app.
4. You press `Cmd+V` in that app's input box and hit Enter.

No network requests. Nothing leaves your machine.

## Install

1. Copy this folder into your vault:

   ```
   <vault>/.obsidian/plugins/note-to-agent/
   ```

2. Restart Obsidian, open **Settings → Community plugins**, and enable **Note to Agent**.

(Once it is listed in the Obsidian Community directory you can also install it straight from Obsidian.)

## Usage

Open any note, then either:

- run the command **把当前笔记发送到 Agent** from the command palette, or
- click the paper-plane icon in the left ribbon.

The plugin copies the note to the clipboard and wakes the target app. Paste with `Cmd+V` and send.

## Commands

| Command | Action |
| --- | --- |
| 把当前笔记发送到 Agent | Copy the note body (+ path) to the clipboard and launch the target app |
| 复制当前笔记的绝对路径 | Copy only the note's absolute path, so the agent can read the file itself |

## Settings

| Setting | Description |
| --- | --- |
| Target app | Name of the app to launch, matching its name on macOS. Works with any agent app whose input box accepts pasted text. |
| Include note path | Prefix the pasted content with a note-path line so the agent can read the original file. |

## Notes

- **Privacy**: the plugin only uses the local clipboard. Note content never leaves your machine.
- If you would rather have a real file drop, the reliable option today is to drag the `.md` straight from Finder into the target app's input box (the drop allow-list includes `.md`, max 10 MB per file).
