import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FocuslyKeyMap, KeyPressAction, FOCUSLY_SERVICE_API } from '@zaybu/focusly';

type ModifierOption = 'none' | 'ctrl' | 'alt' | 'shift';
interface ModifierOptionItem {
  value: ModifierOption;
  label: string;
}

interface KeyOptionItem {
  value: string;
  label: string;
}
@Component({
  selector: 'focusly-config',
  imports: [],
  templateUrl: './focusly-config.component.html',
  styleUrls: ['./focusly-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FocuslyConfigComponent {
  private readonly focusService = inject(FOCUSLY_SERVICE_API);
  keyPressActions = input<KeyPressAction[] | null>(null);
  showKeyMapCode = input(false);
  title = input<string | undefined>(undefined);
  keyMapChange = output<FocuslyKeyMap>();

  readonly modifierOptions: ModifierOptionItem[] = [
    { value: 'none', label: 'None' },
    { value: 'ctrl', label: 'Ctrl' },
    { value: 'alt', label: 'Alt' },
    { value: 'shift', label: 'Shift' },
  ];

  readonly keyOptions: KeyOptionItem[] = [
    { value: 'arrowup', label: 'Arrow Up' },
    { value: 'arrowdown', label: 'Arrow Down' },
    { value: 'arrowleft', label: 'Arrow Left' },
    { value: 'arrowright', label: 'Arrow Right' },
    { value: 'pageup', label: 'Page Up' },
    { value: 'pagedown', label: 'Page Down' },
    { value: 'home', label: 'Home' },
    { value: 'end', label: 'End' },
    { value: 'enter', label: 'Enter' },
    { value: ' ', label: 'Space' },
    ...'abcdefghijklmnopqrstuvwxyz1234567890'
      .split('')
      .map((char) => ({ value: char, label: char })),
  ];

  private readonly _keyMapValue = signal<FocuslyKeyMap>({});
  readonly keyMapValue = this._keyMapValue.asReadonly();

  readonly keyPressActionsToDisplay = computed<KeyPressAction[]>(() => {
    const keyPressActions = this.keyPressActions();
    if (keyPressActions && keyPressActions.length) {
      return keyPressActions;
    }
    const currentKeymap = this.focusService.keyMap();
    return Object.keys(currentKeymap) as KeyPressAction[];
  });

  readonly keyMapCode = computed(() => {
    const map = this.keyMapValue();

    const actions = Object.keys(map) as KeyPressAction[];

    const lines: string[] = [];
    lines.push('provideFocuslyKeymap({');

    for (const action of actions) {
      const rawChord = map[action];
      const chord = this.normalizeChord(rawChord);
      if (!chord) {
        continue;
      }

      const parts = chord.split('+');
      let modifier: ModifierOption = 'none';
      let keySegment: string;

      if (parts.length === 1) {
        keySegment = parts[0];
      } else {
        modifier = parts[0] as ModifierOption;
        keySegment = parts[parts.length - 1];
      }

      const configPieces: string[] = [];
      if (modifier !== 'none') {
        configPieces.push(`${modifier}: true`);
      }
      configPieces.push(`key: '${keySegment}'`);

      const configString = configPieces.join(', ');

      lines.push(`  ${action}: createKeyChord({ ${configString} }),`);
    }

    lines.push('});');

    return lines.join('\n');
  });

  constructor() {
    effect(() => {
      const current = this.focusService.keyMap();
      this._keyMapValue.set({ ...current });
    });
  }

  private normalizeChord(chord: string | string[] | undefined): string {
    if (!chord) return '';
    return Array.isArray(chord) ? chord[0] : chord; // take first chord
  }

  getModifierForAction(action: KeyPressAction): ModifierOption {
    const chord = this.normalizeChord(this.keyMapValue()[action]);
    if (!chord) return 'none';

    const parts = chord.split('+');
    if (parts.length === 1) return 'none';

    const candidate = parts[0] as ModifierOption;
    const valid = this.modifierOptions.some((m) => m.value === candidate);
    return valid ? candidate : 'none';
  }

  getKeyForAction(action: KeyPressAction): string {
    const chord = this.normalizeChord(this.keyMapValue()[action]);
    if (!chord) return '';

    const parts = chord.split('+');
    return parts[parts.length - 1] ?? '';
  }

  private composeChord(modifier: ModifierOption, key: string): string {
    const trimmedKey = key.trim().toLowerCase();
    if (!trimmedKey) return '';
    if (modifier === 'none') {
      return trimmedKey;
    }
    return `${modifier}+${trimmedKey}`;
  }

  onModifierChange(action: KeyPressAction, modifierRaw: string): void {
    const modifier = (modifierRaw as ModifierOption) ?? 'none';
    const currentKey = this.getKeyForAction(action);
    const chord = this.composeChord(modifier, currentKey);
    this.onChordInput(action, chord);
  }

  onKeyChange(action: KeyPressAction, keyValue: string): void {
    const modifier = this.getModifierForAction(action);
    const chord = this.composeChord(modifier, keyValue);
    this.onChordInput(action, chord);
  }

  onChordInput(action: KeyPressAction, rawValue: string): void {
    const value = rawValue.trim();

    this._keyMapValue.update((current) => ({
      ...current,
      [action]: value || undefined,
    }));

    const partial: FocuslyKeyMap = { [action]: value || undefined };

    this.focusService.updateKeymap(partial);
    this.keyMapChange.emit(partial);
  }
}
