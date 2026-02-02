import { Component, output } from '@angular/core';
import { FocuslySubscriberComponent } from '../focusly-subscriber/focusly-subscriber.component';

/**
 * @deprecated
 * This component is deprecated and will be removed in a future version.
 *
 * Use {@link FocuslyShortcutDirective} instead:
 *
 * ```html
 * <button
 *   focuslyShortcut
 *   [focuslyKey]="'enter'"
 *   (focuslyAction)="onEnterKey()"
 * >
 * ```
 */
@Component({
  selector: 'focusly-enter-key-subscriber',
  templateUrl: './focusly-enter-key-subscriber.component.html',
  imports: [FocuslySubscriberComponent],
  standalone: true,
})
export class FocuslyEnterKeySubscriberComponent {
  readonly keyboardEvent = output();

  onKeyboardEvent(): void {
    this.keyboardEvent.emit();
  }
}
