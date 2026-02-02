export type FocuslyShortcutScope = 'element' | 'group' | 'global';

export interface FocuslyShortcutRegistration {
  id: string;               
  keys: string[];           
  scope: FocuslyShortcutScope;
  groupId?: number;         // used for group scope
  elementId?: string;       // used for element scope
  allowInTextInput: boolean;
  priority: number;         // higher wins
  invoke: (e: KeyboardEvent) => void;
}

export type ShortcutStore = {
    // chord -> list (kept sorted by priority desc)
    byChord: Map<string, FocuslyShortcutRegistration[]>;
    // id -> registration (for fast delete)
    byId: Map<string, FocuslyShortcutRegistration>;
};