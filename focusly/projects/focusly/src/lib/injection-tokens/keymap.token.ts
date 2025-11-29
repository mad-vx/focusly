import { InjectionToken } from '@angular/core';
import { DEFAULT_FOCUSLY_KEYMAP, FocuslyKeyMap } from '../models/key-press-action.model';

export const FOCUSLY_KEYMAP = new InjectionToken<FocuslyKeyMap>('FOCUSLY_KEYMAP', {
  providedIn: 'root',
  factory: () => DEFAULT_FOCUSLY_KEYMAP,
});
