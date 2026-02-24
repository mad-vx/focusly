import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[focuslyGroupHost]',
  exportAs: 'focuslyGroupHost',
  standalone: true,
})
export class FocuslyGroupHostDirective {
  private _groupId?: number;

  @Input({ required: true })
  set focuslyGroupHost(value: number) {
    this._groupId = value;
  }

  get focuslyGroupHost(): number | undefined {
    return this._groupId;
  }

  resolveGroup(): number | undefined {
    return this._groupId;
  }
}
