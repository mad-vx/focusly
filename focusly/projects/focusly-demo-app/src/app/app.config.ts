import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFocuslyKeymap } from '@zaybu/focusly';
import { createKeyChord } from '../../../focusly/src/lib/models/key-chord.model';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimations(),
    provideFocuslyKeymap({
      down: createKeyChord({ ctrl: true, key: 'ArrowDown' }),
      up: createKeyChord({ ctrl: true, key: 'ArrowUp' }),
      left: createKeyChord({ ctrl: true, key: 'ArrowLeft' }),
      right: createKeyChord({ ctrl: true, key: 'ArrowRight' }),
    }),
  ],
};
