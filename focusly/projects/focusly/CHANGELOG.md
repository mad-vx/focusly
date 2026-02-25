# @zaybu/focusly

## 2.0.1

### Patch Changes

- Renamed focusly-target directive to focusly-focus

## 2.0.0

### Major Changes

- 530b6ef: FocuslyShortcutDirective created. This directive leverages the existing Focusly framework to allow definition and c0onfiguration of shotcut keys and associated actions on any UI element. This has replaced the 'subscriber' and 'listener' components previously used to achieve the same purpose. This has significant benefits including a tidier less noisy dom, intuitive configuration and better performance and package footprint.

### Minor Changes

- 29d8994: New FocuslyShortcutHost directive. This allows scoping of shotcut keys to a parent element. It allows UI elements that do not implement the focusly directive to participate in the shotcut key hierarchy. This is a significant step towards establishing a unified apporach to keyboard navigation and shotcuts all under one framework that can work together seemlessly.
- 4269a6c: FocuslyGroupHost - New directive to allow declaration of a parent scope grouping for Focusly elements. Focusly elements can still override thier parent grouping by declaring their own group. FocuslyGroupHost can be applied to any parent element and all Focusly child elements will default to tha group.
- fcd08df: Focusly service performance optimisation. Fix potential issue where Group ids get changed dynamically leaving orphaned store entries

## 1.2.0

### Minor Changes

- 3172da8: Upgrade to Angular v21
- 8141faf: Angular Material project - @zaybu/focusly-material

## 1.1.2

### Patch Changes

- 81fb103: Support for NzInputNumber component from NG-ZORRO. New directive added to the @zaybu/focusly-nz library

## 1.1.1

### Patch Changes

- Readme file include

## 1.1.0

### Minor Changes

- add389b: Multiple key assignments support. Each action can have 1 or more key assigments to that action.

## 1.0.0

### Major Changes

- 5d3266e: Introduce configurable keyboard mappings and new Focusly service APIs.

  ## ✨ What’s new
  - Added **build-time configurable key mappings** via:
    - `FOCUSLY_KEYMAP` injection token
    - `provideFocuslyKeymap(map: FocuslyKeyMap)` helper
  - Added **runtime configurable key mappings**:
    - `FocuslyService` now exposes a `keyMap` signal and `updateKeymap(partial: FocuslyKeyMap)` API
    - Allows applications (and helper libraries such as `@zaybu/focusly-config`) to update keybindings at runtime
  - Introduced a canonical **key chord model**:
    - `createKeyChord(config: KeyChordConfig)` to normalise key chords like `"ctrl+arrowup"`
    - Consistent ordering of modifiers and lowercased key values
  - Added a public service abstraction:
    - `FocuslyServiceApi` interface
    - `FOCUSLY_SERVICE_API` injection token to access the Focusly service via an explicit API surface

  ## 🧨 Breaking changes
  - The internal focus service has been refactored and renamed to `FocuslyService`, with additional responsibilities for keymap management.
  - Consumers that were directly relying on the previous `FocusService` type name or private implementation details should update to:
    - Inject `FocuslyService` directly **or**
    - Prefer the new `FOCUSLY_SERVICE_API` token where an abstract API is required.

  ## 🔁 Migration notes
  - To configure key mappings at **build time**, register a keymap when bootstrapping your Angular application:

    ```ts
    import { bootstrapApplication } from '@angular/platform-browser';
    import { AppComponent } from './app/app.component';
    import { provideFocuslyKeymap, createKeyChord } from '@zaybu/focusly';

    bootstrapApplication(AppComponent, {
      providers: [
        provideFocuslyKeymap({
          down: createKeyChord({ ctrl: true, key: 'ArrowDown' }),
          up: createKeyChord({ ctrl: true, key: 'ArrowUp' }),
          left: createKeyChord({ ctrl: true, key: 'ArrowLeft' }),
          right: createKeyChord({ ctrl: true, key: 'ArrowRight' }),
          home: createKeyChord({ key: 'Home' }),
          end: createKeyChord({ key: 'End' }),
          pageUp: createKeyChord({ key: 'PageUp' }),
          pageDown: createKeyChord({ key: 'PageDown' }),
        }),
      ],
    });
    ```

  Introduce comprehensive Playwright test suite for automated keyboard navigation validation.

  ## 🧪 New automated tests

  A new Playwright-based end-to-end test suite has been added, providing full coverage for both **Vanilla HTML** and **NG-ZORRO** component toolkits.

  ### Test coverage includes:
  - **Navigation behaviour** across all directional and page-based key actions.
  - Validation of **runtime-configurable key mappings**, ensuring updates via `updateKeymap()` behave correctly.
  - Validation of **build-time key mappings** provided using `provideFocuslyKeymap()`.
  - Testing against **four distinct keymap configurations** to guarantee consistent behaviour across multiple layouts.
  - Toolkit-independent focus navigation behaviour, confirming that Focusly works identically in:
    - Raw HTML environments
    - Applications that use NG-ZORRO components

  ## 🎯 Purpose

  These tests ensure the reliability and correctness of Focusly’s keyboard navigation engine under a variety of UI structures, component toolkits, and keymap configurations.
  They also provide a strong foundation for future enhancements and regression prevention.

  ## 🚀 Impact

  This is a non-breaking enhancement that significantly improves test coverage and confidence in the Focusly library.

  ***

  ## '@zaybu/focusly-config': major

  Introduce the new `@zaybu/focusly-config` library, providing a standalone UI component for configuring Focusly keyboard mappings at runtime.

  ## ✨ Features
  - Adds a fully standalone Angular component `<focusly-config>` for interactively editing Focusly key mappings.
  - Allows developers (and optionally end-users) to update keyboard navigation shortcuts **at runtime** without needing to call Focusly APIs directly.
  - Integrates with the new Focusly keymap system via `FOCUSLY_SERVICE_API`, automatically updating mappings using the exposed `updateKeymap()` method.
  - Supports modifier selection (`ctrl`, `alt`, `shift`) and a wide range of keys including arrows, paging keys, alphanumerics, and special keys.
  - Automatically generates **build-time configuration code** using `provideFocuslyKeymap()`, allowing developers to copy/paste a static mapping into `bootstrapApplication()`.
  - Accepts optional inputs for title, custom key-action lists, and toggle for displaying build-time configuration code.
  - Emits `keyMapChange` events for consumers who want to persist or react to updates.

  ## 🧩 Purpose

  This library provides a ready-to-use configuration UI for applications using Focusly, removing the need for developers to manually interact with the keymapping API or build their own controls.

  It is especially useful for:
  - Settings/configuration pages
  - Developer tooling
  - Accessibility and power-user customisation
  - Runtime experimentation of key navigation behaviour

  ## 🚀 Initial release

  This is the first published version of the library.

  ***

  ## '@zaybu/focusly-nz': major

  Version aligned with the 1.0.0 major release of the Focusly ecosystem.

  No functional changes were made to this package, but its version has been incremented to remain consistent with the related libraries (`@zaybu/focusly` and `@zaybu/focusly-config`), ensuring compatibility and clarity for consumers.

## 0.0.7

### Patch Changes

- GitHub pages documentation and README documentation updates

## 0.0.6

### Patch Changes

- Trying again to bunmp
- f5328d1: Prettier used and changesets introduced
