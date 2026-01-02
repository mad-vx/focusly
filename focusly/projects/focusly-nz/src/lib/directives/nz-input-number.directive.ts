import { Directive, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { FocuslyDirective } from '@zaybu/focusly';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';

@Directive({
  selector: '[nz-input-number-focusly]',
  standalone: true,
})
export class NzInputNumberFocusDirective extends FocuslyDirective {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly nzInputNumber = inject(NzInputNumberComponent);
  private readonly destroyRef = inject(DestroyRef);

  // When Focusly wants to "focus/select" this component, delegate to NzInputNumber
  override selectCustomElement = () => this.nzInputNumber.focus();

  constructor() {
    super();
    afterNextRender(() => {
      const input = this.findInnerInput();
      if (!input) return;

      const keyDownHandler = (event: KeyboardEvent) => {
        const keyActionHandler = this.focusService.getHandlerForKeyboardEvent(event);
        if (!keyActionHandler) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();

        keyActionHandler();
      };

      input.addEventListener('keydown', keyDownHandler, true);

      this.destroyRef.onDestroy(() => {
        input.removeEventListener('keydown', keyDownHandler, true);
      });
    });
  }

  private findInnerInput(): HTMLInputElement | null {
    return this.hostElement.nativeElement.querySelector('input[role="spinbutton"]');
  }
}
