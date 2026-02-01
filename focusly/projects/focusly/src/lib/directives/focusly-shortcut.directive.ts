import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FocuslyService } from '../services/focus.service';
import { FocuslyGroupHostDirective } from './focusly-group-host.directive';
import { FocuslyShortcutRegistration, FocuslyShortcutScope } from '../models/short-cut.model';

@Directive({
  selector: '[focuslyShortcut]',
  standalone: true,
})
export class FocuslyShortcutDirective implements OnInit, OnDestroy {
  private readonly focusService = inject(FocuslyService);
  private readonly groupHost = inject(FocuslyGroupHostDirective, { optional: true });

  private readonly id = crypto.randomUUID();

  @Input({ required: true }) focuslyKey!: string | string[];
  @Input() focuslyShortcutScope: FocuslyShortcutScope = 'group';

  // Optional overrides
  @Input() focuslyGroup?: number;
  @Input() focuslyAllowInTextInput = true;
  @Input() focuslyPriority = 0;

  /**
   * If you later want element-scope, you can take a focusly element id here.
   * For now you can leave it out or keep it optional.
   */
  @Input() focuslyElementId?: string;

  @Output() focuslyAction = new EventEmitter<KeyboardEvent>();

  ngOnInit(): void {
    this.register();
  }

  ngOnDestroy(): void {
    this.focusService.unregisterShortcut(this.id);
  }

  private register(): void {
    const keys = (Array.isArray(this.focuslyKey) ? this.focuslyKey : [this.focuslyKey])
      .map(k => (k ?? '').trim())
      .filter(Boolean);

    if (keys.length === 0) return;

    const scope = this.focuslyShortcutScope;
    const groupId =
      scope === 'group' ? (this.focuslyGroup ?? this.groupHost?.resolveGroup()) : undefined;

    const reg: FocuslyShortcutRegistration = {
      id: this.id,
      keys,
      scope,
      groupId,
      elementId: scope === 'element' ? this.focuslyElementId : undefined,
      allowInTextInput: this.focuslyAllowInTextInput,
      priority: this.focuslyPriority,
      invoke: (e) => this.focuslyAction.emit(e),
    };

    this.focusService.registerShortcut(reg);
  }
}
