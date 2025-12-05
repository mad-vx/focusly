import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFocuslyKeymap } from '@zaybu/focusly';
import { createKeyChord } from '../../../focusly/src/lib/models/key-chord.model';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimations(),
    provideFocuslyKeymap({
      down: createKeyChord({ alt: true, key: 'ArrowDown' }),
      up: createKeyChord({ alt: true, key: 'ArrowUp' }),
      left: createKeyChord({ alt: true, key: 'ArrowLeft' }),
      right: createKeyChord({ alt: true, key: 'ArrowRight' }),
    }),
  ],
};
