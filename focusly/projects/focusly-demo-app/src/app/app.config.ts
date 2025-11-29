import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FOCUSLY_KEYMAP } from '@zaybu/focusly';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), 
    provideAnimations(),
    {
      provide: FOCUSLY_KEYMAP,
      useValue: {
        'down': 'ctrl+arrowdown',
        'up': 'ctrl+arrowup',
        'left': 'ctrl+arrowleft',
        'right': 'ctrl+arrowright'
      }
    }
  ],
};
