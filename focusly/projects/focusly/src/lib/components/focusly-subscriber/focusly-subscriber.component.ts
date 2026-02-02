import {
  AfterViewInit,
  Component,
  Injector,
  input,
  output,
  inject,
  DestroyRef,
} from '@angular/core';
import { throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FocuslyListenerComponent } from '../focusly-listener/focusly-listener.component';

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
  selector: 'focusly-subscriber',
  template: ``,
  standalone: true,
})
export class FocuslySubscriberComponent implements AfterViewInit {
  protected injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  readonly keyboardEvent = output<KeyboardEvent>();
  readonly throttleKey = input.required<string>();
  readonly throttleTime = input.required<number>();

  private eventListener: FocuslyListenerComponent | null | undefined;

  ngAfterViewInit(): void {
    try {
      this.eventListener = this.injector.get<FocuslyListenerComponent>(FocuslyListenerComponent);

      this.eventListener.broadcastKeyDownEvent$
        .pipe(throttleTime(this.throttleTime()), takeUntilDestroyed(this.destroyRef))
        .subscribe((keyEvent) => {
          keyEvent.stopPropagation();
          this.keyboardEvent.emit(keyEvent);
        });
    } catch (error) {
      throw new Error('Unable to find keyboardListener. Check there is one in the parent DOM');
    }
  }
}
