import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FocuslyShortcutRegistration, FocuslyShortcutScope } from '../models/short-cut.model';
import { normaliseKeyChordString } from '../models/keymap/models/key-chord.model';

@Directive({
  selector: '[focuslyShortcut]',
  standalone: true,
})
export class FocuslyShortcutDirective {
  @Input({ required: true }) focuslyKey!: string | string[];
  @Input() focuslyShortcutScope: FocuslyShortcutScope = 'group';
  @Input() focuslyGroup?: number;
  @Input() focuslyPreventInTextActions = false;
  @Input() focuslyPriority = 0;
  @Input() focuslyElementId?: string;
  @Input() focuslyDescription?: string;

  @Output() focuslyAction = new EventEmitter<KeyboardEvent>();

  /** Host calls this when it needs current declaration */
  getRegistration(defaults: {
    groupId?: number;
    elementId?: string;
  }): Omit<FocuslyShortcutRegistration, 'id'> | null {
    const raw = this.focuslyKey;
    const keysRaw = Array.isArray(raw) ? raw : [raw];

    const keys = Array.from(new Set(keysRaw.map(normaliseKeyChordString).filter(Boolean)));
    if (!keys.length) return null;

    const scope = this.focuslyShortcutScope ?? 'group';
    const groupId = scope === 'group' ? (this.focuslyGroup ?? defaults.groupId) : undefined;
    const elementId =
      scope === 'element' ? (this.focuslyElementId ?? defaults.elementId) : undefined;

    if (scope === 'group' && groupId == null) return null;
    if (scope === 'element' && !elementId) return null;

    return {
      keys,
      scope,
      groupId,
      elementId,
      preventInTextActions: !!this.focuslyPreventInTextActions,
      priority: this.focuslyPriority ?? 0,
      handler: (e) => this.focuslyAction.emit(e),
    };
  }
}
