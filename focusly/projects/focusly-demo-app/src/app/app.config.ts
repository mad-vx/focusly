import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFocuslyKeymap } from '@zaybu/focusly';
import { FOCUSLY_KEYMAP } from '@zaybu/focusly';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), 
    provideAnimations(),
    provideFocuslyKeymap(
    {
        'down': 'ctrl+arrowdown',
        'up': 'ctrl+arrowup',
        'left': 'ctrl+arrowleft',
        'right': 'ctrl+arrowright'
    })
  ],
};
