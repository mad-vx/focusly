import { InjectionToken, inject, Signal } from '@angular/core';
import { FocuslyKeyMap } from './keymap/models/key-press-action.model';
import { FocuslyService } from '../services/focus.service';

export interface FocuslyServiceApi {
  readonly keyMap: Signal<FocuslyKeyMap>;
  updateKeymap(partial: FocuslyKeyMap): void;
  setFocusByElementId(id: string, groupId?: number): boolean;
}

export const FOCUSLY_SERVICE_API = new InjectionToken<FocuslyServiceApi>('FOCUSLY_SERVICE_API', {
  providedIn: 'root',
  factory: () => inject(FocuslyService),
});
