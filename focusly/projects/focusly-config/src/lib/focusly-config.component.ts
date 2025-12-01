import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FocuslyKeyMap, KeyPressAction, FOCUSLY_SERVICE_API } from '@zaybu/focusly';

@Component({
  selector: 'focusly-config',
  imports: [],
  templateUrl: './focusly-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocuslyConfigComponent {
  private readonly focusService = inject(FOCUSLY_SERVICE_API);
  keyPressActions = input<KeyPressAction[] | null>(null);
  title = input<string | undefined>(undefined);
  keyMapChange = output<FocuslyKeyMap>();
  
  private readonly _formValue = signal<FocuslyKeyMap>({});
  readonly formValue = this._formValue.asReadonly();

  readonly keypressActionsToShow = computed<KeyPressAction[]>(() => {
    const keyPressActions = this.keyPressActions();
    if (keyPressActions && this.keyPressActions.length) {
      return keyPressActions;
    }
    const currentKeymap = this.focusService.keyMap();
    return Object.keys(currentKeymap) as KeyPressAction[];
  });

  constructor() {
    effect(() => {
      const current = this.focusService.keyMap();
      this._formValue.set({ ...current });
    });
  }

  onChordInput(action: KeyPressAction, rawValue: string): void {
    const value = rawValue.trim();

    this._formValue.update(current => ({
      ...current,
      [action]: value || undefined,
    }));

    const partial: FocuslyKeyMap = { [action]: value || undefined };

    this.focusService.updateKeymap(partial);
    this.keyMapChange.emit(partial);
  }
}
