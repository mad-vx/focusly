import { createKeyChord } from "./key-chord.model";

export type KeyPressAction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'home'
  | 'end'
  | 'pageUp'
  | 'pageDown';

export type FocuslyKeyChord = string | string[];

export type FocuslyKeyMap = Partial<Record<KeyPressAction, FocuslyKeyChord>>;

export const DEFAULT_FOCUSLY_KEYMAP: FocuslyKeyMap = {
  down: createKeyChord({ alt: true, key: 'ArrowDown' }),
  up: createKeyChord({ alt: true, key: 'ArrowUp' }),
  left: createKeyChord({ alt: true, key: 'ArrowLeft' }),
  right: createKeyChord({ alt: true, key: 'ArrowRight' }),
  home: createKeyChord({ key: 'Home' }),
  end: createKeyChord({ key: 'End' }),
  pageUp: createKeyChord({ key: 'PageUp' }),
  pageDown: createKeyChord({ key: 'PageDown' }),
};
