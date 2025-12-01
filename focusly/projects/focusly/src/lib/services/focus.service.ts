import { computed, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { FocusItem } from '../models/focus-item.model';
import { FOCUSLY_KEYMAP } from '../injection-tokens/keymap.token';
import {
  DEFAULT_FOCUSLY_KEYMAP,
  FocuslyKeyChord,
  FocuslyKeyMap,
  KeyPressAction,
} from '../models/key-press-action.model';
import { createKeyChord } from '../models/key-chord.model';
import { FocuslyServiceApi } from '../models/focus-service-api.model';

@Injectable({ providedIn: 'root' })
export class FocuslyService implements FocuslyServiceApi {
  private endStopSubject = new Subject<FocusItem>();
  readonly endStopHit$ = this.endStopSubject.asObservable();

  private focusRegistry = new Map<number, FocusItem[]>();
  readonly currentFocus = signal<FocusItem | null>(null);

  private focusKeyMap = inject<FocuslyKeyMap>(FOCUSLY_KEYMAP);
  private readonly _keymap = signal<FocuslyKeyMap>({
    ...DEFAULT_FOCUSLY_KEYMAP,
    ...this.focusKeyMap,
  });
  readonly keyMap = this._keymap.asReadonly();

  private readonly keyPressActionHandlers: Record<KeyPressAction, () => void> = {
    up: () => this.up(),
    down: () => this.down(),
    left: () => this.left(),
    right: () => this.right(),
    home: () => this.home(),
    end: () => this.end(),
    pageUp: () => this.pageUp(),
    pageDown: () => this.pageDown(),
  };

  readonly keyHandlers = computed<Record<KeyPressAction, () => void>>(() => {
    const effective = this.keyMap();
    const handlers: Record<string, () => void> = {};

    for (const [action, keyPressConfig] of Object.entries(effective) as [
      KeyPressAction,
      FocuslyKeyChord,
    ][]) {
      if (!keyPressConfig) continue;
      const fn = this.keyPressActionHandlers[action];
      if (!fn) continue;

      const keyPresses = Array.isArray(keyPressConfig) ? keyPressConfig : [keyPressConfig];

      for (const keyPress of keyPresses) {
        if (!keyPress) continue;
        handlers[keyPress] = fn;
      }
    }

    return handlers;
  });

  readonly keyHandlersByChord = computed<Record<string, () => void>>(() => {
    const map = this.keyMap();

    const handlers: Record<string, () => void> = {};

    for (const [action, keyChord] of Object.entries(map) as [KeyPressAction, string][]) {
      if (!keyChord) continue;

      const fn = this.keyPressActionHandlers[action];
      if (!fn) continue;

      handlers[keyChord] = fn;
    }

    return handlers;
  });

  getHandlerForKeyboardEvent(e: KeyboardEvent): (() => void) | undefined {
    const chord = this.chordFromKeyboardEvent(e);
    return this.keyHandlersByChord()[chord];
  }

  private getScopeList(scope: number, create = false): FocusItem[] {
    let list = this.focusRegistry.get(scope);
    if (!list && create) {
      list = [];
      this.focusRegistry.set(scope, list);
    }
    return list ?? [];
  }

  updateKeymap(partial: FocuslyKeyMap) {
    this._keymap.update((current) => ({ ...current, ...partial }));
  }

  onFocus(focus: FocusItem): void {
    const list = this.getScopeList(focus.groupId);
    const found = list.find((r) => r.id === focus.id);
    this.currentFocus.set(found ?? focus);
  }

  setFocus(focus: FocusItem): void {
    this.onFocus(focus);
  }

  up(): void {
    this.moveRow(-1, (row) => row >= 0);
  }
  down(): void {
    this.moveRow(1, (row) => row <= this.currentFocusMaxRow());
  }
  left(): void {
    this.moveColumn(-1, (col) => col >= 0);
  }
  right(): void {
    this.moveColumn(1, (col) => col <= this.currentFocusMaxColumn());
  }

  home(): void {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return;
    this.moveColumn(-currentFocus.column, (col) => col >= 0);
  }

  end(): void {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return;
    const max = this.currentFocusMaxColumn();
    this.moveColumn(max - currentFocus.column, (col) => col <= max);
  }

  pageUp(): void {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return;
    this.moveRow(-currentFocus.row, (row) => row >= 0);
  }

  pageDown(): void {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return;
    const max = this.currentFocusMaxRow();
    this.moveRow(max - currentFocus.row, (row) => row <= max);
  }

  registerItemFocus(focus: FocusItem): void {
    if (focus.groupId === undefined || focus.column === undefined || focus.row === undefined)
      return;

    const list = this.getScopeList(focus.groupId, true);
    const index = list.findIndex((r) => r.id === focus.id);

    if (index >= 0) {
      list[index] = focus;
    } else {
      list.push(focus);
    }
  }

  unRegisterItemFocus(focus: FocusItem): void {
    const list = this.focusRegistry.get(focus.groupId);
    if (!list) return;

    const index = list.findIndex((r) => r.id === focus.id);
    if (index >= 0) list.splice(index, 1);
    if (list.length === 0) this.focusRegistry.delete(focus.groupId);
  }

  isCurrentFocus(focus: FocusItem): boolean {
    const currentFocus = this.currentFocus();
    return !!currentFocus && currentFocus.id === focus.id;
  }

  private findRegisteredFocus(
    column: number,
    row: number,
    groupId?: number,
  ): FocusItem | undefined {
    const effectiveScope = groupId ?? this.currentFocus()?.groupId;
    if (effectiveScope == null) return undefined;

    const list = this.focusRegistry.get(effectiveScope);
    if (!list) return undefined;

    return list.find((r) => r.column === column && r.row === row && r.groupId === effectiveScope);
  }

  private moveRow(offset: number, endCondition: (row: number) => boolean): void {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return;
    this.moveFocus(currentFocus.row, offset, endCondition, (row) =>
      this.findRegisteredFocus(currentFocus!.column, row),
    );
  }

  private moveColumn(offset: number, endCondition: (column: number) => boolean): void {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return;
    this.moveFocus(currentFocus.column, offset, endCondition, (col) =>
      this.findRegisteredFocus(col, currentFocus!.row),
    );
  }

  private moveFocus(
    condition: number,
    offset: number,
    endCondition: (x: number) => boolean,
    findNextFocus: (condition: number) => FocusItem | undefined,
  ): void {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return;

    condition += offset;
    let nextFocus: FocusItem | undefined;

    while (endCondition(condition) && !nextFocus) {
      nextFocus = findNextFocus(condition);
      if (!nextFocus) condition += offset;
    }

    if (nextFocus) {
      this.setFocus(nextFocus);
    } else if (!endCondition(condition)) {
      this.endStopSubject.next(currentFocus);
    }
  }

  private currentFocusMaxRow(): number {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return 0;
    const list = this.focusRegistry.get(currentFocus.groupId) ?? [];
    if (list.length === 0) return 0;
    return list.reduce((max, f) => (f.row > max ? f.row : max), list[0].row);
  }

  private currentFocusMaxColumn(): number {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return 0;
    const list = this.focusRegistry.get(currentFocus.groupId) ?? [];
    if (list.length === 0) return 0;
    return list.reduce((max, f) => (f.column > max ? f.column : max), list[0].column);
  }

  private chordFromKeyboardEvent(e: KeyboardEvent): string {
    return createKeyChord({
      key: e.key,
      alt: e.altKey,
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
    });
  }
}
