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

type GroupStore = {
  byId: Map<string, FocusItem>;
  byCell: Map<string, FocusItem>; // key = `${row}:${col}`
  maxRow: number;
  maxCol: number;
};

@Injectable({ providedIn: 'root' })
export class FocuslyService implements FocuslyServiceApi {
  private endStopSubject = new Subject<FocusItem>();
  readonly endStopHit$ = this.endStopSubject.asObservable();

  private focusRegistry = new Map<number, GroupStore>();
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

  readonly keyHandlers = computed<Record<string, () => void>>(() => {
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

  getHandlerForKeyboardEvent(e: KeyboardEvent): (() => void) | undefined {
    const chord = this.chordFromKeyboardEvent(e);
    return this.keyHandlers()[chord];
  }

  updateKeymap(partial: FocuslyKeyMap) {
    this._keymap.update((current) => ({ ...current, ...partial }));
  }

  private cellKey(row: number, col: number): string {
    return `${row}:${col}`;
  }

  private getOrCreateStore(groupId: number): GroupStore {
    let store = this.focusRegistry.get(groupId);
    if (!store) {
      store = { byId: new Map(), byCell: new Map(), maxRow: 0, maxCol: 0 };
      this.focusRegistry.set(groupId, store);
    }
    return store;
  }

  private getStore(groupId: number | undefined): GroupStore | undefined {
    if (groupId == null) return undefined;
    return this.focusRegistry.get(groupId);
  }

  private recomputeMaxima(store: GroupStore): void {
    // Only called when we *might* have removed the current max row/col
    let maxRow = 0;
    let maxCol = 0;

    for (const item of store.byId.values()) {
      if (item.row != null && item.row > maxRow) maxRow = item.row;
      if (item.column != null && item.column > maxCol) maxCol = item.column;
    }

    store.maxRow = maxRow;
    store.maxCol = maxCol;
  }

  // ---------------- Public API ----------------

  onFocus(focus: FocusItem): void {
    const store = this.getStore(focus.groupId);
    if (!store) {
      this.currentFocus.set(focus);
      return;
    }

    const found = store.byId.get(focus.id);
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

    const store = this.getOrCreateStore(focus.groupId);

    // If this id already exists, remove its old cell mapping (row/col might have changed)
    const existing = store.byId.get(focus.id);
    if (existing) {
      store.byCell.delete(this.cellKey(existing.row!, existing.column!));
    }

    store.byId.set(focus.id, focus);
    store.byCell.set(this.cellKey(focus.row, focus.column), focus);

    if (focus.row > store.maxRow) store.maxRow = focus.row;
    if (focus.column > store.maxCol) store.maxCol = focus.column;
  }

  unRegisterItemFocus(focus: FocusItem): void {
    const store = this.getStore(focus.groupId);
    if (!store) return;

    const existing = store.byId.get(focus.id);
    if (!existing) return;

    store.byId.delete(focus.id);
    store.byCell.delete(this.cellKey(existing.row!, existing.column!));

    if (store.byId.size === 0) {
      this.focusRegistry.delete(focus.groupId!);
      return;
    }

    // If we removed a max boundary recompute
    if (existing.row === store.maxRow || existing.column === store.maxCol) {
      this.recomputeMaxima(store);
    }
  }

  isCurrentFocus(id: string): boolean {
    const currentFocus = this.currentFocus();
    return !!currentFocus && currentFocus.id === id;
  }

  private findRegisteredFocus(
    column: number,
    row: number,
    groupId?: number,
  ): FocusItem | undefined {
    const effectiveGroup = groupId ?? this.currentFocus()?.groupId;
    if (effectiveGroup == null) return undefined;

    const store = this.focusRegistry.get(effectiveGroup);
    if (!store) return undefined;

    return store.byCell.get(this.cellKey(row, column));
  }

  private moveRow(offset: number, endCondition: (row: number) => boolean): void {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return;

    this.moveFocus(currentFocus.row, offset, endCondition, (row) =>
      this.findRegisteredFocus(currentFocus.column, row, currentFocus.groupId),
    );
  }

  private moveColumn(offset: number, endCondition: (column: number) => boolean): void {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return;

    this.moveFocus(currentFocus.column, offset, endCondition, (col) =>
      this.findRegisteredFocus(col, currentFocus.row, currentFocus.groupId),
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
    return this.focusRegistry.get(currentFocus.groupId)?.maxRow ?? 0;
  }

  private currentFocusMaxColumn(): number {
    const currentFocus = this.currentFocus();
    if (!currentFocus) return 0;
    return this.focusRegistry.get(currentFocus.groupId)?.maxCol ?? 0;
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
