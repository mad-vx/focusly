import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
} from '@angular/core';
import { FocuslyService } from '../services/focusly.service';
import { FocuslyGroupHostDirective } from './focusly-group-host.directive';
import {
  FocuslyShortcutDef,
  FocuslyShortcutRegistration,
  FocuslyShortcuts,
} from '../models/short-cut.model';
import { FocuslyShortcutDirective } from './focusly-shortcut.directive';
import { fromEvent, Subscription } from 'rxjs';
import { normaliseKeyChordString } from '../models/keymap/models/key-chord.model';

@Directive({
  selector: '[focuslyShortcutHost]',
  standalone: true,
})
export class FocuslyShortcutHostDirective
  implements OnInit, OnDestroy, AfterContentInit, OnChanges
{
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly focuslyService = inject(FocuslyService);
  private readonly groupHost = inject(FocuslyGroupHostDirective, { optional: true });

  @Input() focuslyShortcuts: FocuslyShortcuts | null = null;
  @Input() focuslyIncludeChildShortcuts = true;
  @Input() focuslyGroup?: number;
  @Input() focuslyElementId?: string;

  @ContentChildren(FocuslyShortcutDirective, { descendants: true })
  private readonly childShortcuts?: QueryList<FocuslyShortcutDirective>;

  private keySub?: Subscription;
  private childSub?: Subscription;

  private readonly hostId = crypto.randomUUID();
  private registeredIds: string[] = [];

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.keySub = fromEvent<KeyboardEvent>(this.el.nativeElement, 'keydown', {
        capture: true,
      }).subscribe((e) => {
        const handled = this.focuslyService.tryHandleShortcutEvent(e, {
          groupId: this.resolveGroupId(),
          elementId: this.focuslyElementId,
        });

        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });
  }

  ngAfterContentInit(): void {
    // Initial register + track changes
    this.rebuildRegistrations();

    if (this.childShortcuts) {
      this.childSub = this.childShortcuts.changes.subscribe(() => this.rebuildRegistrations());
    }
  }

  ngOnDestroy(): void {
    this.keySub?.unsubscribe();
    this.childSub?.unsubscribe();
    this.unregisterAll();
  }

  ngOnChanges(): void {
    // if inputs change (shortcuts/group/elementId), rebuild
    this.rebuildRegistrations();
  }

  private resolveGroupId(): number | undefined {
    return this.focuslyGroup ?? this.groupHost?.resolveGroup();
  }

  private rebuildRegistrations(): void {
    this.unregisterAll();

    const groupId = this.resolveGroupId();
    const elementId = this.focuslyElementId;

    const regs: FocuslyShortcutRegistration[] = [];

    // 1) host shortcuts input
    const input = this.focuslyShortcuts;
    regs.push(...this.toRegistrationsFromHostInput(input, { groupId, elementId }));

    // 2) child declarations
    if (this.focuslyIncludeChildShortcuts && this.childShortcuts) {
      for (const child of this.childShortcuts.toArray()) {
        const decl = child.getRegistration({ groupId, elementId });
        if (!decl) continue;

        regs.push({
          id: `${this.hostId}:child:${crypto.randomUUID()}`,
          ...decl,
        });
      }
    }

    // register all
    for (const reg of regs) {
      this.focuslyService.registerShortcut(reg);
      this.registeredIds.push(reg.id);
    }
  }

  private unregisterAll(): void {
    for (const id of this.registeredIds) {
      this.focuslyService.unregisterShortcut(id);
    }
    this.registeredIds = [];
  }

  private toRegistrationsFromHostInput(
    input: FocuslyShortcuts | null,
    defaults: { groupId?: number; elementId?: string },
  ): FocuslyShortcutRegistration[] {
    if (!input) return [];

    const toKeys = (k: string | string[]) =>
      Array.from(
        new Set((Array.isArray(k) ? k : [k]).map(normaliseKeyChordString).filter(Boolean)),
      );

    const make = (def: FocuslyShortcutDef): FocuslyShortcutRegistration[] => {
      const keys = toKeys(def.key);
      if (!keys.length) return [];

      const scope = def.scope ?? 'group';
      const groupId = scope === 'group' ? (def.groupId ?? defaults.groupId) : undefined;
      const elementId = scope === 'element' ? (def.elementId ?? defaults.elementId) : undefined;

      if (scope === 'group' && groupId == null) return [];
      if (scope === 'element' && !elementId) return [];

      return [
        {
          id: `${this.hostId}:host:${crypto.randomUUID()}`,
          keys,
          scope,
          groupId,
          elementId,
          preventInTextActions: !!def.preventInTextActions,
          priority: def.priority ?? 0,
          description: def.description,
          source: 'host',
          handler: def.handler,
        },
      ];
    };

    if (Array.isArray(input)) {
      return input.flatMap(make);
    }

    // map form
    return Object.entries(input).flatMap(([key, handler]) => make({ key, handler }));
  }
}
