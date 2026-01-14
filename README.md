# 🎯 Focusly – Intuitive, Elegant Keyboard Navigation for Angular (v16+)

**Focusly** is a lightweight Angular library that brings **intuitive, keyboard-driven navigation** to web applications.

It lets users move effortlessly between interactive elements—inputs, dropdowns, buttons, or any focusable control—using familiar keys like **↑ ↓ ← →**, **Home**, **End**, and **Page Up / Page Down**.

Each *Focusly Group* acts as an independent navigation zone, so multiple grids or forms on the same page can be navigated separately and respond logically to user intent.

It provides an elegant way to define how users move between interactive controls — such as text boxes, dropdowns, or buttons — using keyboard shortcuts.  
Focusly was designed to make keyboard navigation **predictable, accessible, and fast**, even in complex data entry UIs.

---

## ✨ Features

- 🚀 Navigate grids, tables, or forms entirely via keyboard 
- 🎯 **Scoped focus groups** so each panel or table behaves independently on a single page
- 🪄 Elegant and simple declarative API using Angular directives  
- 🧩 Works with any focusable element (`<input>`, `<select>`, `<button>`, etc.)  
- 🧠 Easily extendable to custom components 
- ♿ Built for accessibility and developer simplicity
- ⚡ Built with Angular **signals** for instant reactivity — no manual change detection
- ⚡ Works with provideZonelessChangeDetection() - ensures optimal performance in zone-less Angular apps
- 🔄 Fully reactive and framework-native (no DOM listeners or external deps)
- 🪶 Small, simple, and zero-dependency
- ⌨️ Multiple key assignments per action — support alternative keyboard shortcuts for the same navigation intent

---

## 🧠 Concept

Each focusable element declares:
- A **group** – to separate independent navigation contexts (e.g., two tables)
- A **row** and **column** – to describe its position within that group

Focusly tracks the user’s current focus position and responds to keyboard events to move to the appropriate neighbour.

### Multiple Key Assignments

Focusly allows multiple keyboard shortcuts to trigger the same navigation action.

This makes it easy to:

- Support alternative shortcuts (e.g. Alt + Arrow or Ctrl + WASD)
- Preserve muscle memory when migrating from existing systems
- Offer platform-specific or user-preferred keybindings
- Improve accessibility by providing redundant input paths

Each navigation action (up, down, left, right, etc.) may be bound to one or more key chords, all of which behave identically at runtime.

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

🚀 Live Demo (StackBlitz)
https://stackblitz.com/edit/focusly-demo

📦 npm Package
https://www.npmjs.com/package/@zaybu/focusly

💻 GitHub Repository
https://github.com/mad-vx/focusly

🌐 GitHub Pages
https://mad-vx.github.io/focusly/

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
