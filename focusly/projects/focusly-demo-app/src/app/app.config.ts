import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFocuslyKeymap } from '@zaybu/focusly';
import { createKeyChord } from '@zaybu/focusly/src/keymap';
//import { createKeyChord } from '../../../focusly/src/lib/models/keymap/public-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideFocuslyKeymap({
      down: createKeyChord({ alt: true, key: 'ArrowDown' }),
      up: createKeyChord({ alt: true, key: 'ArrowUp' }),
      left: createKeyChord({ alt: true, key: 'ArrowLeft' }),
      right: createKeyChord({ alt: true, key: 'ArrowRight' }),
    }),
  ],
};
