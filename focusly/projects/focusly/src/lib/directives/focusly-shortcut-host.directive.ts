import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { FocuslyService } from '../services/focus.service';
import { FocuslyGroupHostDirective } from './focusly-group-host.directive';

@Directive({
  selector: '[focuslyShortcutHost]',
  standalone: true,
})
export class FocuslyShortcutHostDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly focuslyService = inject(FocuslyService);
  private readonly groupHost = inject(FocuslyGroupHostDirective, { optional: true });

  private sub?: Subscription;

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.sub = fromEvent<KeyboardEvent>(this.el.nativeElement, 'keydown', { capture: true }).subscribe((e) => {
        const handled = this.focuslyService.tryHandleShortcutEvent(e, {
          groupId: this.groupHost?.resolveGroup(),
        });

        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
