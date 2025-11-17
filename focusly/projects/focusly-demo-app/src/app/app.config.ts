import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideNoopAnimations()
  ]
};
