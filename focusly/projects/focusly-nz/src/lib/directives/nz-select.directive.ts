import { Directive, inject } from '@angular/core';
import { FocuslyDirective } from '@zaybu/focusly';
import { NzSelectComponent } from 'ng-zorro-antd/select';

@Directive({
  selector: '[nz-select-focusly]',
  standalone: true
})
export class NzSelectFocusDirective extends FocuslyDirective {
  protected nzSelect = inject(NzSelectComponent);

  // Track mouse usage so we know whether to close the dropdown on blur
  private mouseClick = false;

  constructor() {
    super();

    this.selectCustomElement = () => {
      this.nzSelect.focus();
    };

    // For NzSelect we don't want to call native select() on the host
    this.onElementFocus = () => {
      // Intentionally empty
    };
  }

  protected override onFocusOut(event: FocusEvent): void {
    if (!this.mouseClick) {
      this.nzSelect.nzOpen = false;
    } else {
      this.mouseClick = false;
    }
  }

  protected override onMouseDown(event: MouseEvent): void {
    this.mouseClick = true;
  }

  protected override onEnterKey(event: KeyboardEvent): void {
    // Allow enter to select within the dropdown without bubbling to parent
    event.stopPropagation();
    this.mouseClick = false;
  }
}
