import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class KeyboardService {
  // Holds something like "Alt + ArrowRight" or "Enter"
  readonly lastCombo = signal<string>('');

  // We keep a reference so we can remove the listener on destroy if needed
  private handler = (ev: KeyboardEvent) => {
    const parts: string[] = [];

    if (ev.altKey) parts.push('Alt');
    if (ev.ctrlKey) parts.push('Ctrl');
    if (ev.shiftKey) parts.push('Shift');
    if (ev.metaKey) parts.push('Meta'); // ⌘ on Mac, Win key on Windows

    // Prefer named keys like ArrowRight, Enter, PageDown, etc.
    // For single-char keys like "a", ev.key will just be "a"
    const keyLabel = this.normaliseKey(ev.key);
    if (keyLabel) {
      parts.push(keyLabel);
    }

    this.lastCombo.set(parts.join(' + '));

    // NOTE: we are NOT calling stopPropagation or preventDefault here.
    // Focusly still gets the key and can act on it.
  };

  constructor() {
    // Listen *in capture phase* so we always see it
    window.addEventListener('keydown', this.handler, { capture: true });
  }

  // Map browser key values to nicer labels if you want
  private normaliseKey(key: string): string {
    switch (key) {
      case 'ArrowUp': return '↑';
      case 'ArrowDown': return '↓';
      case 'ArrowLeft': return '←';
      case 'ArrowRight': return '→';
      case ' ': return 'Space';
      default: return key.length === 1 ? key.toUpperCase() : key;
    }
  }
}
