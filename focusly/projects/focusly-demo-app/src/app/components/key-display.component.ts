import { Component, computed, inject } from '@angular/core';
import { KeyDisplayService } from '../services/key-display-service';

@Component({
  selector: 'key-display',
  standalone: true,
  template: `
    <div class="key-hud" [class.key-hud--visible]="visible()">
      {{ combo() }}
    </div>
  `,
  styles: [
    `
      .key-hud {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.75);
        color: #fff;
        font-family: system-ui, sans-serif;
        font-size: 0.9rem;
        line-height: 1.4;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        min-width: 6rem;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        opacity: 0;
        pointer-events: none;
        transition: opacity 120ms ease-out;
      }

      .key-hud--visible {
        opacity: 1;
        font-size: xxx-large;
      }
    `,
  ],
})
export class KeyDisplayComponent {
  private keyCapture = inject(KeyDisplayService);

  readonly combo = this.keyCapture.lastCombo;
  readonly visible = computed(() => this.combo().trim().length > 0);
}
