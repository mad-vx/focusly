import { DEFAULT_FOCUSLY_KEYMAP, FocuslyKeyMap, createKeyChord } from '@zaybu/focusly';
export interface TestKeyMap {
  name: string;
  map: FocuslyKeyMap;
}

export const testKeyMaps: TestKeyMap[] = [
  {
    name: 'Default Keymap',
    map: DEFAULT_FOCUSLY_KEYMAP,
  },
  {
    name: 'Ctrl + Arrow Keys',
    map: {
      down: createKeyChord({ ctrl: true, key: 'ArrowDown' }),
      up: createKeyChord({ ctrl: true, key: 'ArrowUp' }),
      left: createKeyChord({ ctrl: true, key: 'ArrowLeft' }),
      right: createKeyChord({ ctrl: true, key: 'ArrowRight' }),
      home: createKeyChord({ key: 'Home' }),
      end: createKeyChord({ key: 'End' }),
      pageUp: createKeyChord({ key: 'PageUp' }),
      pageDown: createKeyChord({ key: 'PageDown' }),
    },
  },
  {
    name: 'Shift + Arrows',
    map: {
      down: createKeyChord({ shift: true, key: 'ArrowDown' }),
      up: createKeyChord({ shift: true, key: 'ArrowUp' }),
      left: createKeyChord({ shift: true, key: 'ArrowLeft' }),
      right: createKeyChord({ shift: true, key: 'ArrowRight' }),
      home: createKeyChord({ key: 'Home' }),
      end: createKeyChord({ key: 'End' }),
      pageUp: createKeyChord({ key: 'PageUp' }),
      pageDown: createKeyChord({ key: 'PageDown' }),
    },
  },
  {
    name: 'Numpad + Simple Keys',
    map: {
      down: createKeyChord({ key: '2' }),
      up: createKeyChord({ key: '8' }),
      left: createKeyChord({ key: '4' }),
      right: createKeyChord({ key: '6' }),
      home: createKeyChord({ key: 'h' }),
      end: createKeyChord({ key: 'e' }),
      pageUp: createKeyChord({ key: 'u' }),
      pageDown: createKeyChord({ key: 'd' }),
    },
  },
];
