# 🎯 Focusly – Intuitive, Elegant Keyboard Navigation & Shortcuts for Angular (v16+)

**Focusly** is a lightweight Angular library that brings **powerful, unified keyboard interaction** to web applications.

It provides:

- 🧭 **Predictable, structured keyboard navigation**
- ⌨️ **Scoped keyboard shortcuts**
- ⚙️ A single, consistent, optimised keyboard management paradigm

Move between interactive elements or custom components, using familiar keys like **↑ ↓ ← →**, **Home**, **End**, and **Page Up / Page Down**.

Trigger contextual actions using keyboard shortcuts - scoped globally, per group, or per element — all managed by the same engine.

Each *Focusly Group* acts as an independent interaction zone, so multiple tables, forms, or panels on the same page behave logically and predictably.

Focusly was designed for keyboard-driven, performance sensitive Angular applications where **predictability, accessibility, and speed** matter.

---

## ✨ Features

- 🚀 Navigate grids, tables, or forms entirely via keyboard
- ⌨️ Define **keyboard shortcuts** (global, group-scoped, or element-scoped)
- 🎯 **Scoped focus groups** so each panel or table behaves independently
- 🧠 Unified navigation + shortcut engine — one system, one paradigm
- 🔎 Built-in conflict detection for key assignments
- 🪄 Elegant and simple declarative API using Angular directives
- 🧩 Works with any focusable element (`<input>`, `<select>`, `<button>`, etc.)
- 🧠 Easily extendable to custom components (Angular Material, NGZorro)
- ♿ Built with accessibility and deterministic focus handling in mind
- ⚡ Built with Angular **signals** for instant reactivity
- ⚡ Works with `provideZonelessChangeDetection()` for optimal performance
- 🔄 Fully reactive and framework-native
- 🪶 Small, simple, and zero-dependency
- ⌨️ Multiple key assignments per action — support alternative shortcuts

---

## 🧠 Concept

Focusly introduces a **unified keyboard interaction model**.

Instead of managing navigation logic in one place and shortcuts in another, Focusly handles both using a single, optimised system.

### Navigation

Each navigable element declares:

- A **group** – to separate independent navigation contexts
- A **row** and **column** – to describe its position within that group

Focusly tracks the current focus position and responds to keyboard events to move to the appropriate neighbour.

### Focus Targets (Programmatic Focus)

Not every focusable element needs to participate in grid navigation.

You can register a **focus target** without specifying row/column coordinates.

This allows:

- Programmatic focus on page load
- Focusing the first control in a tab
- Managing modal/dialog initial focus

All focus targets are managed by the same Focusly service.

### Keyboard Shortcuts

Focusly also provides a fully scoped shortcut system:

- 🌍 Global shortcuts
- 🧭 Group-scoped shortcuts
- 🎯 Element-scoped shortcuts

Shortcuts and navigation are processed through the same keyboard pipeline, ensuring:

- Consistent behaviour
- Deterministic resolution
- Conflict awareness
- Optimal performance

---

## 🔐 Smart Handling Inside Text Inputs

Focusly can operate inside text inputs and editable controls.

By default, shortcuts are allowed inside text inputs — making Focusly suitable for highly keyboard-driven applications such as trading systems or spreadsheet-style UIs.

To help prevent accidental conflicts:

- ⚠️ Focusly warns when plain character keys (e.g. `A`, `S`, `1`) are used as shortcuts inside text inputs
- ⚠️ Warnings are emitted for navigation/editing keys without modifier keys
- 🔧 You can disable shortcuts inside text inputs per shortcut registration

This gives teams full flexibility while protecting against common keyboard UX pitfalls.

---

## 🔄 Multiple Key Assignments

Each navigation action (up, down, left, right, etc.) may be bound to one or more key chords.

This allows you to:

- Support alternative shortcuts (e.g. Alt + Arrow or Ctrl + WASD)
- Preserve muscle memory from legacy systems
- Offer platform-specific keybindings
- Improve accessibility with redundant input paths

All bindings resolve through the same unified key handler.

---

## 📦 Installation

```bash
npm install @zaybu/focusly
```

## 📝 Example Usage
```html
  <select
      focusly
      [focuslyGroup]="1"
      [focuslyRow]="2"
      [focuslyColumn]="3"
      >
      <option>Buy</option>
      <option>Sell</option>
  </select>
```

## ⚡ Keyboard Navigation in Action

Experience **Focusly** in motion — navigate complex Angular tables and forms using only your keyboard.  
Use **Alt + Arrow Keys** to move focus, and **Enter** to trigger contextual actions.

<p align="center">
  <img src="https://raw.githubusercontent.com/mad-vx/focusly/main/focusly/projects/focusly-demo-app/docs/focusly-demo.gif" alt="Focusly demo" width="80%"/>
</p>


## 🧩 Extensible by Design — Custom Component Integration

Unlike many keyboard-navigation libraries that hard-code focus behaviour in a central service, Focusly is built to be truly extensible.
Each custom UI component can declare its own Focusly-aware directive, cleanly encapsulating how focus is set, managed, and released.

This means you can integrate complex third-party components (like Angular Material, PrimeNG, or NgZorro) without modifying Focusly’s core logic.

Focusly is built on a single, powerful base directive that provides all core keyboard-navigation behaviour—movement logic, focus tracking, directional traversal, and accessible focus management. Support for UI libraries such as NG-ZORRO, Angular Material, or any other component framework is achieved through lightweight extension directives that simply override a few optional hooks.

Unlike other keyboard-navigation solutions that tightly couple navigation logic to specific components—or require you to write large amounts of boilerplate—Focusly keeps the API clean and the implementation surface tiny. 
The benefits are substantial:

- Consistent behaviour across all toolkits and components
- No duplication of navigation logic
- Simple, maintainable extensions for toolkit-specific behaviour
- Small footprint, big flexibility—you can support new UI libraries in minutes

This design allows Focusly to be both highly opinionated in the places that matter (accessibility, deterministic movement, and predictable focus handling), and highly extensible wherever component libraries differ.

🎯 Ng-Zorro Focusly Project
https://www.npmjs.com/package/@zaybu/focusly-nz

🎯 Angular Material Focusly Project
https://www.npmjs.com/package/@zaybu/focusly-material

## 🚀 Quick Links

Try Focusly, explore the code, or join the discussion:

🌐 GitHub Pages
https://mad-vx.github.io/focusly/

🚀 Live Demo (StackBlitz)
https://stackblitz.com/edit/focusly-demo

📦 npm Package
https://www.npmjs.com/package/@zaybu/focusly

💻 GitHub Repository
https://github.com/mad-vx/focusly

📖 Docs
https://mad-vx.github.io/focusly/focusly-docs/

💡 Comments, Suggestions & Questions (GitHub Discussions)
https://github.com/mad-vx/focusly/discussions

## Angular Compatibility

@zaybu/focusly requires **Angular v16+**
Supports Angular 16+. CI builds are verified against Angular 18–21.

This is due to the use of Angular Signals and other modern framework APIs

## 💼 Commercial Support & Consultancy

If you would like help integrating **Focusly** into your Angular application — including:

- Keyboard navigation architecture
- Accessibility improvements (WCAG)
- Custom keybinding strategies
- Grid, dashboard, or complex UI navigation
- Integration with NgZorro, Material UI, or custom design systems

…professional consultancy and implementation support is available.

📩 Contact: mn8s@hotmail.com
