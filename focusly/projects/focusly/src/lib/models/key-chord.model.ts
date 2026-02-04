import { FocuslyKeyChord } from './key-press-action.model';

export type ModifierKey = 'alt' | 'ctrl' | 'shift';

export interface KeyChordConfig {
  key: string;
  alt?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  meta?: boolean;
}

/**
 * Canonicalise a key chord:
 * - modifiers in order: alt, shift, ctrl
 * - key lowercased
 * - joined by '+', e.g. "ctrl+arrowup"
 */
function canonicaliseKeyChord(config: KeyChordConfig): string {
  const parts: string[] = [];

  if (config.alt) parts.push('alt');
  if (config.shift) parts.push('shift');
  if (config.ctrl) parts.push('ctrl');
  if (config.meta) parts.push('meta');

  parts.push(config.key.toLowerCase());

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
