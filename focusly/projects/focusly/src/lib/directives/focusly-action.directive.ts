import {
  Directive,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FocuslyService } from '../services/focus.service';

@Directive({
  selector: '[focusly-action]',
  standalone: true,
})
export class FocuslyActionDirective implements OnInit, OnDestroy {
    protected readonly focusService = inject(FocuslyService);

    constructor() {

    }

    ngOnInit(): void {
  
    }

    ngOnDestroy(): void {
 
    }
}
