import { FocuslyKeyChord } from './key-press-action.model';

const MOD_ALIASES: Record<string, keyof KeyChordConfig> = {
  alt: 'alt',
  option: 'alt',

  ctrl: 'ctrl',
  control: 'ctrl',
  ctl: 'ctrl',

  shift: 'shift',

  meta: 'meta',
  cmd: 'meta',
  command: 'meta',
};

export type ModifierKey = 'alt' | 'ctrl' | 'shift' | 'meta';

export interface KeyChordConfig {
  key: string;
  alt?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  meta?: boolean;
}

/**
 * Canonicalise a key chord:
 * - modifiers in order: alt, shift, ctrl, meta
 * - key lowercased
 * - joined by '+', e.g. "ctrl+arrowup"
 */
export function canonicaliseKeyChord(config: KeyChordConfig): string {
  const parts: string[] = [];

  if (config.alt) parts.push('alt');
  if (config.shift) parts.push('shift');
  if (config.ctrl) parts.push('ctrl');
  if (config.meta) parts.push('meta');

  parts.push((config.key ?? '').toLowerCase());

  return parts.join('+');
}

export function createKeyChord(config: KeyChordConfig): string;
export function createKeyChord(...configs: KeyChordConfig[]): FocuslyKeyChord;
export function createKeyChord(...configs: KeyChordConfig[]): FocuslyKeyChord {
  if (configs.length === 0) {
    throw new Error('createKeyChord requires at least one KeyChordConfig');
  }

  const chords = configs.map(canonicaliseKeyChord);

  const deduped = Array.from(new Set(chords));

  return deduped.length === 1 ? deduped[0] : deduped;
}

export function parseKeyChord(raw: string): KeyChordConfig | null {
  const cleaned = (raw ?? '').trim().toLowerCase().replace(/\s+/g, '');
  if (!cleaned) return null;

  const parts = cleaned.split('+').filter(Boolean);
  if (!parts.length) return null;

  const cfg: KeyChordConfig = { key: '' };

  for (const p of parts) {
    const mod = MOD_ALIASES[p];
    if (mod) {
      (cfg as any)[mod] = true;
    } else {
      // last non-modifier wins
      cfg.key = p;
    }
  }

  if (!cfg.key) return null;
  return cfg;
}

export function normaliseKeyChordString(raw: string): string {
  const cfg = parseKeyChord(raw);
  return cfg ? canonicaliseKeyChord(cfg) : '';
}

export function chordFromKeyboardEvent(e: KeyboardEvent): string {
  // IMPORTANT: use e.key directly; do not infer shift from uppercase letters.
  // Shift should be represented by e.shiftKey.
  const cfg: KeyChordConfig = {
    key: e.key,
    alt: e.altKey,
    ctrl: e.ctrlKey,
    shift: e.shiftKey,
    meta: e.metaKey,
  };

  return canonicaliseKeyChord(cfg);
}
