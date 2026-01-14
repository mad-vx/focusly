# @zaybu/focusly-material

**Angular Material extension package for the Focusly keyboard navigation framework.**  
This package adds lightweight, Angular Material specific integration to the core `@zaybu/focusly` library

For full documentation on Focusly’s architecture, navigation model, design philosophy, signals-based internals, and advanced features, please see the main Focusly README:  
👉 **https://www.npmjs.com/package/@zaybu/focusly**

---

## 📦 Installation

Install Focusly core + this Angular Material extension:

```bash
npm install @zaybu/focusly @zaybu/focusly-material
```

## 📝 Example Usage

```html
<mat-select
    mat-select-focusly
    [focuslyGroup]="1"
    [focuslyRow]="1"
    [focuslyColumn]="1"
>
    <mat-option value="Buy">Buy</mat-option>
    <mat-option value="Sell">Sell</mat-option>
</mat-select>
```
