import { FocuslyKeyMap } from '@zaybu/focusly';

declare global {
  interface Window {
    focuslyTestApi?: {
      updateKeymap: (keymap: FocuslyKeyMap) => void;
    };
  }
}

export {};
