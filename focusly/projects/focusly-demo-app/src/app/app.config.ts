import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
  ],
};
