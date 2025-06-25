# 📊 Sortable Tables

A plugin for Obsidian that adds the ability to interactively sort Markdown tables in preview mode. Supports sorting by multiple columns with priority display and reverting to the original row order.

---

## ✨ Features

- Sorting by numbers and strings
- Support for multiple sorting (`Shift+click`)
- Cycle mode: 🔼 → 🔽 → ⏹️ (return to original)
- Display sorting priority (`🔽①`, `🔼②`, etc.)
- Revert to original order without reloading the note

---

## 🔧 Installation

1. Clone the repository or download the contents as `.zip`
2. Copy the plugin folder to the Obsidian directory:

```
.obsidian/plugins/obsidian-sortable-tables/
```

3. Activate the plugin via Settings → Plugins → Custom plugins

---

## 🛠️ Build from source

Requires Node.js ≥ 16.

```bash
npm install
node build.js
```

---

## 💡 Usage

1. Switch to preview mode.

2. Click on the table header to sort:

* 🔼 — ascending
* 🔽 — descending
* " " — return to original order
3. Use `Shift+click` to add additional sorting (second, third priority, etc.)

---

## 🔐 Compatibility

* Works in preview mode (Obsidian reading mode)
* Does not affect the file content (only visual changes)

---
This plugin is licensed under the MIT license. See the [LICENSE](./LICENSE) file.
