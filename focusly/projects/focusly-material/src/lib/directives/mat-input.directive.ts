import { Directive } from '@angular/core';
import { FocuslyDirective } from '@zaybu/focusly';

@Directive({
  selector: '[mat-input-focusly]',
  standalone: true,
})
export class MaterialInputNumberFocusDirective extends FocuslyDirective {}
