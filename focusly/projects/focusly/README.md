# 🎯 Focusly – Intelligent Keyboard Navigation for Angular

**Focusly** is a lightweight Angular library that enables **keyboard-driven focus navigation** across complex grids, forms, and multi-panel layouts.

It provides an elegant way to define how users move between interactive controls — such as text boxes, dropdowns, or buttons — using keyboard shortcuts.  
Focusly was designed to make keyboard navigation **predictable, accessible, and fast**, even in complex data entry UIs.

---

## 🚀 Features

- Navigate grids, tables, or forms entirely via keyboard  
- Works with any focusable element (`<input>`, `<select>`, `<button>`, etc.)  
- Supports **multiple independent focus groups** on a single page  
- Simple declarative API using Angular directives  
- Customizable navigation keys and direction logic  
- Built for accessibility and developer simplicity  
- Zero external dependencies

---

## 🧠 Concept

Focusly organizes focusable elements into **groups**, **rows**, and **columns**.

Each focusable element declares:
- A **group** – to separate independent navigation contexts (e.g., two tables)
- A **row** and **column** – to describe its position within that group

Focusly tracks the user’s current focus position and responds to keyboard events to move to the appropriate neighbour.

---

## ⚙️ Installation

```bash
npm install focusly
