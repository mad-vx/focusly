import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class KeyboardService {
  readonly lastCombo = signal<string>('');

  // We keep a reference so we can remove the listener on destroy if needed
  private handler = (ev: KeyboardEvent) => {
    const parts: string[] = [];

    if (ev.altKey) parts.push('Alt');
    if (ev.ctrlKey) parts.push('Ctrl');
    if (ev.shiftKey) parts.push('Shift');
    if (ev.metaKey) parts.push('Meta'); // ⌘ on Mac, Win key on Windows

    const keyLabel = this.normaliseKey(ev.key);
    if (keyLabel) {
      parts.push(keyLabel);
    }

    this.lastCombo.set(parts.join(' + '));
  };

  constructor() {
    window.addEventListener('keydown', this.handler, { capture: true });
  }

  private normaliseKey(key: string): string {
    switch (key) {
      case 'ArrowUp':
        return '↑';
      case 'ArrowDown':
        return '↓';
      case 'ArrowLeft':
        return '←';
      case 'ArrowRight':
        return '→';
      case ' ':
        return 'Space';
      default:
        return key.length === 1 ? key.toUpperCase() : key;
    }
  }
}
