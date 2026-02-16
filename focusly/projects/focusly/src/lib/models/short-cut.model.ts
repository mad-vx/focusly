export type FocuslyShortcutScope = 'element' | 'group' | 'global';

export type FocuslyShortcutHandler = (e: KeyboardEvent) => void;
export type FocuslyShortcutsMap = Record<string, FocuslyShortcutHandler>;
export type FocuslyShortcuts = FocuslyShortcutsMap | FocuslyShortcutDef[];

/**
 * Host-friendly "definition" type (no id, key can be string or string[]).
 * This is what users pass via [focuslyShortcuts]="..."
 */
export interface FocuslyShortcutDef {
  key: string | string[];
  handler: FocuslyShortcutHandler;

  scope?: FocuslyShortcutScope;
  groupId?: number;
  elementId?: string;
  allowInTextInput?: boolean;
  priority?: number;

  description?: string;
  source?: 'host' | 'child';
}

/**
 * Internal store type (requires id, and keys are already normalised string[]).
 */
export interface FocuslyShortcutRegistration {
  id: string;
  keys: string[];
  scope: FocuslyShortcutScope;
  groupId?: number;
  elementId?: string;
  allowInTextInput: boolean;
  priority: number;
  handler: FocuslyShortcutHandler;
  description?: string;
  source?: 'host' | 'child';
}

export type ShortcutStore = {
  byChord: Map<string, FocuslyShortcutRegistration[]>;
  byId: Map<string, FocuslyShortcutRegistration>;
};
