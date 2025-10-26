import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { Subject, Subscription, filter, fromEvent } from 'rxjs';
import { isElementVisible } from '../../helpers/is-element-visible';

@Component({
  selector: 'focusly-listener',
  templateUrl: './focusly-listener.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocuslyListenerComponent implements OnInit, OnDestroy {
  elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);

  @Input({ required: true }) keyDownEvents: string[] = [];

  private keyboardEventsDictionary: Map<string, any> = new Map<string, any>();;
  private keyboardEventSubscription: Subscription | undefined;

  private broadcastKeyDownEventSubject = new Subject<KeyboardEvent>();
  public broadcastKeyDownEvent$ = this.broadcastKeyDownEventSubject.asObservable();

  ngOnInit(): void {
    this.keyDownEvents.forEach(
      (keyboardEvent) => (this.keyboardEventsDictionary.set(keyboardEvent, true))
    );

    this.ngZone.runOutsideAngular(() => {
      this.keyboardEventSubscription = fromEvent<KeyboardEvent>(
        this.elementRef.nativeElement,
        'keydown'
      )
        .pipe(
          filter(
            (keyboardEvent: KeyboardEvent) => this.keyboardEventsDictionary.get(keyboardEvent.key)
          ),
          filter(() => isElementVisible(this.elementRef))
        )
        .subscribe((keyboardEvent) => {
          this.broadcastKeyDownEventSubject.next(keyboardEvent);
        });
    });
  }

  ngOnDestroy(): void {
    this.keyboardEventSubscription?.unsubscribe();
  }
}
