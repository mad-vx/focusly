import { ElementRef } from '@angular/core';
/**
 * @deprecated
 * This function is deprecated and will be removed in a future version.
 */
export function isElementVisible(element: ElementRef): boolean {
  const rect = element.nativeElement.getBoundingClientRect();
  const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}
