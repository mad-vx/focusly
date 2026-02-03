import {
  Directive,
  DestroyRef,
  EventEmitter,
  Output,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { FocuslyService } from '../services/focus.service';
import { FocuslyGroupHostDirective } from './focusly-group-host.directive';
import { FocuslyShortcutRegistration, FocuslyShortcutScope } from '../models/short-cut.model';

@Directive({
  selector: '[focuslyShortcut]',
  standalone: true,
})
export class FocuslyShortcutDirective {
  private readonly focusService = inject(FocuslyService);
  private readonly groupHost = inject(FocuslyGroupHostDirective, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  private readonly id = crypto.randomUUID();

  readonly focuslyKey = input.required<string | string[]>();
  readonly focuslyShortcutScope = input<FocuslyShortcutScope>('group');
  readonly focuslyGroup = input<number | undefined>(undefined);
  readonly focuslyAllowInTextInput = input<boolean>(false);
  readonly focuslyPriority = input<number>(0);
  readonly focuslyElementId = input<string | undefined>(undefined);

  @Output() focuslyAction = new EventEmitter<KeyboardEvent>();

  private warnedMissingGroup = false;
  private warnedMissingElementId = false;

  // Normalize keys once per input change
  private readonly keys = computed(() => {
    const raw = this.focuslyKey();
    const list = (Array.isArray(raw) ? raw : [raw])
      .map(k => (k ?? '').trim())
      .filter(Boolean);

    // Optional: de-dupe
    return Array.from(new Set(list));
  });

  private readonly registration = computed<FocuslyShortcutRegistration | null>(() => {
    const keys = this.keys();
    if (keys.length === 0) return null;

    const scope = this.focuslyShortcutScope();

    const groupId =
      scope === 'group'
        ? (this.focuslyGroup() ?? this.groupHost?.resolveGroup())
        : undefined;

    const elementId =
      scope === 'element'
        ? this.focuslyElementId()
        : undefined;

    if (scope === 'group' && groupId == null) {
      if (!this.warnedMissingGroup) {
        console.warn('[FocuslyShortcut] scope="group" but no groupId resolved. Add [focuslyGroupHost] on a parent.');
        this.warnedMissingGroup = true;
      }
      return null;
    }
    if (scope === 'element' && !elementId) {
      if (!this.warnedMissingElementId) {
        console.warn('[FocuslyShortcut] scope="element" but no elementId resolved. Add [focuslyElementId] to element.');
        this.warnedMissingElementId = true;
      }
      return null;
    } 

    return {
      id: this.id,
      keys,
      scope,
      groupId,
      elementId,
      allowInTextInput: this.focuslyAllowInTextInput(),
      priority: this.focuslyPriority(),
      invoke: (e) => this.focuslyAction.emit(e),
    };
  });

  constructor() {
    let lastRegistered = false;

    effect(
      () => {
        const reg = this.registration();

        // Always remove previous registration before applying the new one.
        // This covers any input change, including scope changes.
        if (lastRegistered) {
          this.focusService.unregisterShortcut(this.id);
          lastRegistered = false;
        }

        if (!reg) return;

        this.focusService.registerShortcut(reg);
        lastRegistered = true;
      }
    );

    this.destroyRef.onDestroy(() => {
      this.focusService.unregisterShortcut(this.id);
    });
  }
}
