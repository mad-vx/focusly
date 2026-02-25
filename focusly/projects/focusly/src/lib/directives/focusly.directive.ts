import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { FocuslyCellItem } from '../models/focus-item.model';
import { FocuslyFocusDirective } from './focusly-focus.directive';

@Directive({
  selector: '[focusly]',
  standalone: true,
})
export class FocuslyDirective extends FocuslyFocusDirective implements OnInit, OnDestroy {
  @Input({ required: true }) set focuslyColumn(column: number) {
    this._focuslyColumn = column;
    this.syncRegistration();
  }

  @Input({ required: true }) set focuslyRow(row: number) {
    this._focuslyRow = row;
    this.syncRegistration();
  }

  get focuslyColumn(): number | undefined {
    return this._focuslyColumn;
  }

  get focuslyRow(): number | undefined {
    return this._focuslyRow;
  }

  private _focuslyColumn: number | undefined;
  private _focuslyRow: number | undefined;

  protected override buildItem(): FocuslyCellItem | null {
    const base = super.buildItem();
    if (!base) return null;
    const row = this.focuslyRow;
    const column = this.focuslyColumn;
    if (row == null || column == null) return null;
    return { ...base, row, column };
  }
}
