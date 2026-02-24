# @zaybu/focusly-config

## 2.0.0

### Major Changes

- 530b6ef: FocuslyShortcutDirective created. This directive leverages the existing Focusly framework to allow definition and c0onfiguration of shotcut keys and associated actions on any UI element. This has replaced the 'subscriber' and 'listener' components previously used to achieve the same purpose. This has significant benefits including a tidier less noisy dom, intuitive configuration and better performance and package footprint.

### Minor Changes

- 29d8994: New FocuslyShortcutHost directive. This allows scoping of shotcut keys to a parent element. It allows UI elements that do not implement the focusly directive to participate in the shotcut key hierarchy. This is a significant step towards establishing a unified apporach to keyboard navigation and shotcuts all under one framework that can work together seemlessly.
- 4269a6c: FocuslyGroupHost - New directive to allow declaration of a parent scope grouping for Focusly elements. Focusly elements can still override thier parent grouping by declaring their own group. FocuslyGroupHost can be applied to any parent element and all Focusly child elements will default to tha group.
- fcd08df: Focusly service performance optimisation. Fix potential issue where Group ids get changed dynamically leaving orphaned store entries

### Patch Changes

- Updated dependencies [530b6ef]
- Updated dependencies [29d8994]
- Updated dependencies [4269a6c]
- Updated dependencies [fcd08df]
  - @zaybu/focusly@2.0.0

## 1.2.0

### Minor Changes

- 3172da8: Upgrade to Angular v21
- 8141faf: Angular Material project - @zaybu/focusly-material

### Patch Changes

- Updated dependencies [3172da8]
- Updated dependencies [8141faf]
  - @zaybu/focusly@1.2.0

## 1.1.2

### Patch Changes

- Updated dependencies [81fb103]
  - @zaybu/focusly@1.1.2

## 1.1.1

### Patch Changes

- Updated dependencies
  - @zaybu/focusly@1.1.1

## 1.1.0

### Minor Changes

- add389b: Multiple key assignments support. Each action can have 1 or more key assigments to that action.

## 1.0.0

### Patch Changes

- Updated dependencies [5d3266e]
  - @zaybu/focusly@1.0.0
