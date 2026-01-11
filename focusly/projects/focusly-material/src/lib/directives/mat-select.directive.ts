import { Directive, inject } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { FocuslyDirective } from '@zaybu/focusly';

@Directive({
  selector: '[mat-select-focusly]',
  standalone: true,
})
export class MatSelectFocusDirective extends FocuslyDirective {
  protected matSelect = inject(MatSelect);

  // Track mouse usage so we know whether to close the dropdown on blur
  private mouseClick = false;

  constructor() {
    super();

    // this.selectCustomElement = () => {
    //   this.matSelect.focus();
    // };

    // this.onElementFocus = () => {
    //   // Intentionally empty
    // };
  }

  protected override onFocusOut(event: FocusEvent): void {
    if (!this.mouseClick) {
      this.matSelect.close();
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
