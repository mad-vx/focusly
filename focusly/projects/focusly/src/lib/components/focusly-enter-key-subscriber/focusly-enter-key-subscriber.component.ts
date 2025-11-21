import { Component, output } from '@angular/core';
import { FocuslySubscriberComponent } from '../focusly-subscriber/focusly-subscriber.component';

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
