import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFocuslyKeymap, createKeyChord } from '@zaybu/focusly';
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
