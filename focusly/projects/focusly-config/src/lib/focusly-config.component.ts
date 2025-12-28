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
import {
  FocuslyKeyMap,
  FocuslyKeyChord,
  KeyPressAction,
  FOCUSLY_SERVICE_API,
} from '@zaybu/focusly';

type ModifierOption = 'none' | 'ctrl' | 'alt' | 'shift';
interface ModifierOptionItem {
  value: ModifierOption;
  label: string;
}

interface KeyOptionItem {
  value: string;
  label: string;
}

type ChordSlots = [string, string];
type EditableKeyMap = Partial<Record<KeyPressAction, ChordSlots>>;

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

  private readonly _keyMapValue = signal<EditableKeyMap>({});
  readonly keyMapValue = this._keyMapValue.asReadonly();

  readonly keyPressActionsToDisplay = computed<KeyPressAction[]>(() => {
    const list = this.keyPressActions();
    if (list?.length) return list;

    const current = this.focusService.keyMap();
    return Object.keys(current) as KeyPressAction[];
  });

  constructor() {
    effect(() => {
      const current = this.focusService.keyMap();
      const next: EditableKeyMap = {};

      for (const action of Object.keys(current) as KeyPressAction[]) {
        next[action] = this.toTwoSlots(current[action]);
      }

      // Also ensure actions passed in that aren't in current keymap get initialised
      const actions = this.keyPressActionsToDisplay();
      for (const action of actions) {
        next[action] ??= ['', ''];
      }

      this._keyMapValue.set(next);
    });
  }

  private getSlots(action: KeyPressAction): ChordSlots {
    return this._keyMapValue()[action] ?? ['', ''];
  }

  private getChord(action: KeyPressAction, slotIndex: 0 | 1): string {
    return this.getSlots(action)[slotIndex] ?? '';
  }

  getModifierForAction(action: KeyPressAction, slotIndex: 0 | 1): ModifierOption {
    const chord = this.getChord(action, slotIndex);
    if (!chord) return 'none';

    const parts = chord.split('+');
    if (parts.length === 1) return 'none';

    const candidate = parts[0] as ModifierOption;
    return this.modifierOptions.some((m) => m.value === candidate) ? candidate : 'none';
  }

  getKeyForAction(action: KeyPressAction, slotIndex: 0 | 1): string {
    const chord = this.getChord(action, slotIndex);
    if (!chord) return '';

    const parts = chord.split('+');
    return parts[parts.length - 1] ?? '';
  }

  onModifierChange(action: KeyPressAction, slotIndex: 0 | 1, modifierRaw: string): void {
    const modifier = (modifierRaw as ModifierOption) ?? 'none';
    const currentKey = this.getKeyForAction(action, slotIndex);
    const chord = this.composeChord(modifier, currentKey);
    this.setChord(action, slotIndex, chord);
  }

  onKeyChange(action: KeyPressAction, slotIndex: 0 | 1, keyValue: string): void {
    const modifier = this.getModifierForAction(action, slotIndex);
    const chord = this.composeChord(modifier, keyValue);
    this.setChord(action, slotIndex, chord);
  }
  
  hasSecondChord(action: KeyPressAction): boolean {
    return this.getKeyForAction(action, 1) !== '' || this.getModifierForAction(action, 1) !== 'none';
  }

  private setChord(action: KeyPressAction, slotIndex: 0 | 1, rawValue: string): void {
    const value = rawValue.trim();

    this._keyMapValue.update((m) => {
      const existing = m[action] ?? ['', ''];
      const next: ChordSlots = [...existing] as ChordSlots;
      next[slotIndex] = value;
      return { ...m, [action]: next };
    });

    this.pushActionUpdate(action);
  }

  private pushActionUpdate(action: KeyPressAction): void {
    const [c1, c2] = this.getSlots(action);

    const outgoing = this.toFocuslyChord([c1, c2]);
    const partial: FocuslyKeyMap = { [action]: outgoing };

    this.focusService.updateKeymap(partial);
    this.keyMapChange.emit(partial);
  }

  private toTwoSlots(value: FocuslyKeyChord | undefined): ChordSlots {
    if (!value) return ['', ''];
    if (Array.isArray(value)) return [value[0] ?? '', value[1] ?? ''];
    return [value, ''];
  }

  private toFocuslyChord(slots: ChordSlots): FocuslyKeyChord | undefined {
    const cleaned = slots.map((c) => c.trim()).filter(Boolean);

    if (cleaned.length === 0) return undefined;
    if (cleaned.length === 1) return cleaned[0];
    return cleaned.slice(0, 2);
  }

  private composeChord(modifier: ModifierOption, key: string): string {
    const trimmedKey = (key ?? '').trim().toLowerCase();
    if (!trimmedKey) return ''; // “Select key…” => no chord
    if (modifier === 'none') return trimmedKey;
    return `${modifier}+${trimmedKey}`;
  }

  readonly keyMapCode = computed(() => {
    const map = this.keyMapValue();
    const actions = Object.keys(map) as KeyPressAction[];

    const lines: string[] = [];
    lines.push('provideFocuslyKeymap({');

    for (const action of actions) {
      const slots = map[action] ?? ['', ''];
      const outgoing = this.toFocuslyChord(slots);

      if (!outgoing) continue;

      const chords = Array.isArray(outgoing) ? outgoing : [outgoing];
      const exprs = chords
        .map((c) => this.chordToCreateKeyChordExpression(c))
        .filter((x): x is string => !!x);

      if (!exprs.length) continue;

      if (exprs.length === 1) {
        lines.push(`  ${action}: ${exprs[0]},`);
      } else {
        lines.push(`  ${action}: [${exprs.join(', ')}],`);
      }
    }

    lines.push('});');
    return lines.join('\n');
  });

  private chordToCreateKeyChordExpression(chord: string): string | null {
    const parts = chord.split('+').filter(Boolean);

    let modifier: ModifierOption = 'none';
    let keySegment: string;

    if (parts.length === 1) {
      keySegment = parts[0];
    } else {
      modifier = parts[0] as ModifierOption;
      keySegment = parts[parts.length - 1];
    }

    keySegment = (keySegment ?? '').trim();

    if (!keySegment) return null;

    const configPieces: string[] = [];
    if (modifier !== 'none') configPieces.push(`${modifier}: true`);
    configPieces.push(`key: '${keySegment}'`);

    return `createKeyChord({ ${configPieces.join(', ')} })`;
  }
}
