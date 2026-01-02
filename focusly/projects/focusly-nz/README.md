# @zaybu/focusly-nz

**NG-ZORRO extension package for the Focusly keyboard navigation framework.**  
This package adds lightweight, NG-ZORRO-specific integration to the core `@zaybu/focusly` library, enabling components such as `<nz-select>` & `nz-input-number` to participate seamlessly in Focusly’s navigation model.

For full documentation on Focusly’s architecture, navigation model, design philosophy, signals-based internals, and advanced features, please see the main Focusly README:  
👉 **https://www.npmjs.com/package/@zaybu/focusly**

---

## 📦 Installation

Install Focusly core + this NG-ZORRO extension:

```bash
npm install @zaybu/focusly @zaybu/focusly-nz
```

## 📝 Example Usage

```html
<nz-select
  nz-select-focusly
  [focuslyGroup]="1"
  [focuslyRow]="1"
  [focuslyColumn]="1"
  [(ngModel)]="value"
>
  <nz-option nzLabel="Buy" nzValue="Buy"></nz-option>
  <nz-option nzLabel="Sell" nzValue="Sell"></nz-option>
</nz-select>

<nz-input-number
  nz-input-number-focusly
  [focuslyGroup]="1"
  [focuslyRow]="1"
  [focuslyColumn]="2"
  [(ngModel)]="value"
/>
```
