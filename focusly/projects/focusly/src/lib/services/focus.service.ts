import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FocusItem } from '../models/focus-item.model';

@Injectable({ providedIn: 'root' })
export class FocusService {
  private endStopSubject = new Subject<FocusItem>();
  readonly endStopHit$ = this.endStopSubject.asObservable();

  private focusChangedSubject = new Subject<FocusItem>();
  readonly focusChanged$ = this.focusChangedSubject.asObservable();

  private focusRegistry = new Map<number, FocusItem[]>();
  private currentFocus: FocusItem | null = null;

  private getScopeList(scope: number, create = false): FocusItem[] {
    let list = this.focusRegistry.get(scope);
    if (!list && create) {
      list = [];
      this.focusRegistry.set(scope, list);
    }
    return list ?? [];
  }

  onFocus(focus: FocusItem): void {
    const list = this.getScopeList(focus.groupId);
    const found = list.find(r => r.id === focus.id);
    this.currentFocus = found ?? focus;
  }

  setFocus(focus: FocusItem): void {
    this.onFocus(focus);
    if (this.currentFocus) {
      this.focusChangedSubject.next(this.currentFocus);
    }
  }

  up(): void    { this.moveRow(-1, row => row >= 0); }
  down(): void  { this.moveRow( 1, row => row <= this.currentFocusMaxRow()); }
  left(): void  { this.moveColumn(-1, col => col >= 0); }
  right(): void { this.moveColumn( 1, col => col <= this.currentFocusMaxColumn()); }

  home(): void {
    if (!this.currentFocus) return;
    this.moveColumn(-this.currentFocus.column, col => col >= 0);
  }

  end(): void {
    if (!this.currentFocus) return;
    const max = this.currentFocusMaxColumn();
    this.moveColumn(max - this.currentFocus.column, col => col <= max);
  }

  pageUp(): void {
    if (!this.currentFocus) return;
    this.moveRow(-this.currentFocus.row, row => row >= 0);
  }

  pageDown(): void {
    if (!this.currentFocus) return;
    const max = this.currentFocusMaxRow();
    this.moveRow(max - this.currentFocus.row, row => row <= max);
  }

  registerItemFocus(focus: FocusItem): void {
    if (
      focus.groupId === undefined ||
      focus.column === undefined ||
      focus.row === undefined
    ) return;

    const list = this.getScopeList(focus.groupId, true);
    const index = list.findIndex(r => r.id === focus.id);

    if (index >= 0) {
      list[index] = focus;
    } else {
      list.push(focus);
    }
  }

  unRegisterItemFocus(focus: FocusItem): void {
    const list = this.focusRegistry.get(focus.groupId);
    if (!list) return;

    const index = list.findIndex(r => r.id === focus.id);
    if (index >= 0) list.splice(index, 1);
    if (list.length === 0) this.focusRegistry.delete(focus.groupId);
  }

  isCurrentFocus(focus: FocusItem): boolean {
    return !!this.currentFocus && this.currentFocus.id === focus.id;
  }

  private findRegisteredFocus(
    column: number,
    row: number,
    groupId?: number
  ): FocusItem | undefined {
    const effectiveScope = groupId ?? this.currentFocus?.groupId;
    if (effectiveScope == null) return undefined;

    const list = this.focusRegistry.get(effectiveScope);
    if (!list) return undefined;

    return list.find(
      r => r.column === column && r.row === row && r.groupId === effectiveScope
    );
  }

  private moveRow(offset: number, endCondition: (row: number) => boolean): void {
    if (!this.currentFocus) return;
    this.moveFocus(
      this.currentFocus.row,
      offset,
      endCondition,
      (row) => this.findRegisteredFocus(this.currentFocus!.column, row)
    );
  }

  private moveColumn(offset: number, endCondition: (column: number) => boolean): void {
    if (!this.currentFocus) return;
    this.moveFocus(
      this.currentFocus.column,
      offset,
      endCondition,
      (col) => this.findRegisteredFocus(col, this.currentFocus!.row)
    );
  }

  private moveFocus(
    condition: number,
    offset: number,
    endCondition: (x: number) => boolean,
    findNextFocus: (condition: number) => FocusItem | undefined
  ): void {
    if (!this.currentFocus) return;

    condition += offset;
    let nextFocus: FocusItem | undefined;

    while (endCondition(condition) && !nextFocus) {
      nextFocus = findNextFocus(condition);
      if (!nextFocus) condition += offset;
    }

    if (nextFocus) {
      this.setFocus(nextFocus);
    } else if (!endCondition(condition)) {
      this.endStopSubject.next(this.currentFocus);
    }
  }

  private currentFocusMaxRow(): number {
    if (!this.currentFocus) return 0;
    const list = this.focusRegistry.get(this.currentFocus.groupId) ?? [];
    if (list.length === 0) return 0;
    return list.reduce((max, f) => (f.row > max ? f.row : max), list[0].row);
  }

  private currentFocusMaxColumn(): number {
    if (!this.currentFocus) return 0;
    const list = this.focusRegistry.get(this.currentFocus.groupId) ?? [];
    if (list.length === 0) return 0;
    return list.reduce((max, f) => (f.column > max ? f.column : max), list[0].column);
  }
}