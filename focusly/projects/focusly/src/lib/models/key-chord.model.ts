export type ModifierKey = 'alt' | 'ctrl' | 'shift';

export interface KeyChordConfig {
  key: string; 
  alt?: boolean;
  ctrl?: boolean;
  shift?: boolean;
}

/**
 * Canonicalise a key chord:
 * - modifiers in order: alt, shift, ctrl
 * - key lowercased
 * - joined by '+', e.g. "ctrl+arrowup"
 */
export function createKeyChord(config: KeyChordConfig): string {
  const parts: string[] = [];

  if (config.alt) parts.push('alt');
  if (config.shift) parts.push('shift');
  if (config.ctrl) parts.push('ctrl');

  parts.push(config.key.toLowerCase());

  return parts.join('+');
}
