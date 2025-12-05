# @zaybu/focusly-config

A lightweight configuration UI component for managing **keyboard navigation key mappings** in applications using **Focusly** (`@zaybu/focusly`).  
It allows developers—and optionally end-users—to configure Focusly's keymap at **runtime**, and also provides a generated code snippet for **build-time configuration**.

This component is ideal for applications that want to offer customisable accessibility behaviour, power-user shortcuts, or consistent keyboard navigation patterns across grids, lists, cards, forms and other structures.

---

## ✨ Features

- 🔧 Interactive UI for selecting modifiers and keys  
- 🔁 Runtime updates via Focusly service API  
- 🏗️ Build-time code generation using `provideFocuslyKeymap()`  
- 🧩 Fully standalone Angular component  
- ⚡ Uses Angular Signals for optimal reactivity  
- 📦 Works seamlessly with `@zaybu/focusly`  
- 🧑‍💻 Optional title, custom action filtering, and code display toggle  
- 📤 Emits partial keymap updates

---

## 📦 Installation

```bash
npm install @zaybu/focusly-config
```
You will also need Focusly:
```bash
npm install @zaybu/focusly
```
