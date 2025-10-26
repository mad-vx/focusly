import {
  AfterViewInit,
  Component,
  Injector,
  inject,
  DestroyRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FocuslyListenerComponent } from '../focusly-listener/focusly-listener.component';

@Component({
  selector: 'focusly-subscriber',
  template: ``,
  standalone: true
})
export class FocuslySubscriberComponent implements AfterViewInit {
  protected injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) throttleKey!: string;
  @Input({ required: true }) throttleTime!: number;

  @Output() keyboardEvent = new EventEmitter<KeyboardEvent>();

  private eventListener: FocuslyListenerComponent | null | undefined;

  ngAfterViewInit(): void {
    try {
      this.eventListener = this.injector.get<FocuslyListenerComponent>(FocuslyListenerComponent);

      this.eventListener.broadcastKeyDownEvent$
        .pipe(throttleTime(this.throttleTime), takeUntilDestroyed(this.destroyRef))
        .subscribe((keyEvent) => {
          keyEvent.stopPropagation();
          this.keyboardEvent.emit(keyEvent);
        });
    } catch (error) {
      throw new Error('Unable to find keyboardListener. Check there is one in the parent DOM');
    }
  }
}
