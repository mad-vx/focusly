export type KeyPressAction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'home'
  | 'end'
  | 'pageUp'
  | 'pageDown';

export type FocuslyKeyMap = Partial<Record<KeyPressAction, string>>;

export const DEFAULT_FOCUSLY_KEYMAP: FocuslyKeyMap = {
  'down': 'alt+arrowdown',
  'up': 'alt+arrowup',
  'left': 'alt+arrowleft',
  'right': 'alt+arrowright',
  'home': 'home',
  'end': 'end',
  'pageUp': 'pageup',
  'pageDown': 'pagedown'
};