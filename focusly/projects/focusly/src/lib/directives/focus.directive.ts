import {
  computed,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FocusService } from '../services/focus.service';
import { FocusItem } from '../models/focus-item.model';

@Directive({
  selector: '[focusly]',
  standalone: true
})
export class FocuslyDirective implements OnInit, OnDestroy {
  @Input({ required: true }) set focuslyColumn(column: number) {
    this._focuslyColumn = column;
    this.focusService.registerItemFocus(this.focus);
  }

  @Input({ required: true }) set focuslyRow(row: number) {
    this._focuslyRow = row;
    this.focusService.registerItemFocus(this.focus);
  }

  @Input({ required: true }) set focuslyGroup(scope: number) {
    this._focuslyScope = scope;
    this.focusService.registerItemFocus(this.focus);
  }

  get focuslyColumn(): number | undefined {
    return this._focuslyColumn;
  }

  get focuslyRow(): number | undefined {
    return this._focuslyRow;
  }

  get focuslyGroup(): number | undefined {
    return this._focuslyScope;
  }

  private _focuslyColumn: number | undefined;
  private _focuslyRow: number | undefined;
  private _focuslyScope: number | undefined;

  private limitHitSubscription: Subscription;
  private uniqueId = () => crypto.randomUUID();

  protected get focus(): FocusItem {
    return <FocusItem>{
      column: this.focuslyColumn,
      row: this.focuslyRow,
      groupId: this.focuslyGroup,
      id: this.uniqueId()
    };
  }

  // Override this method to implement custom onFocus actions
  onElementFocus = (): void => {
    if (this.elementRef.nativeElement.select) {
      this.elementRef.nativeElement.select();
    }
  };

  // Override this method to implement custom focus() actions
  selectCustomElement: (() => void) | undefined;

  readonly isActive = computed(() => {
    if (this.focusService.isCurrentFocus(this.focus)) {
      this.elementRef.nativeElement.focus();
      if (this.elementRef.nativeElement.select) {
        this.elementRef.nativeElement.select();
      } else {
        if (this.selectCustomElement) {
          this.selectCustomElement();
        }
      }  
    }
  });

  readonly keyHandlers: Record<string, () => void> = {
    'alt+arrowdown': () => this.focusService.down(),
    'alt+arrowup':   () => this.focusService.up(),
    'alt+arrowleft': () => this.focusService.left(),
    'alt+arrowright':() => this.focusService.right(),
    'home':          () => this.focusService.home(),
    'end':           () => this.focusService.end(),
    'pageup':        () => this.focusService.pageUp(),
    'pagedown':      () => this.focusService.pageDown(),
    'tab':           () => this.focusService.down(),
    'shift+tab':     () => this.focusService.up(),
  };

  @HostBinding('class.focusly-active')
  get activeClass() {
    return this.isActive();
  }

  protected elementRef = inject(ElementRef);
  protected focusService = inject(FocusService);

  constructor() {

    this.limitHitSubscription = this.focusService.endStopHit$.subscribe((focus: FocusItem) => {
      if (this.focusService.isCurrentFocus(this.focus)) {
        this.elementRef.nativeElement.blur();
        this.elementRef.nativeElement.focus();
      }
    });
  }

  ngOnInit(): void {
    this.focusService.registerItemFocus(this.focus);
  }

  ngOnDestroy(): void {
    this.focusService.unRegisterItemFocus(this.focus);
    this.limitHitSubscription.unsubscribe();
  }

  @HostListener('focus', ['$event'])
  public onFocus(event: any): void {
    this.focusService.onFocus(this.focus);
    if (this.onElementFocus) {
      this.onElementFocus();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    const key = [
      e.altKey ? 'alt' : '',
      e.shiftKey ? 'shift' : '',
      e.key.toLowerCase()
    ].filter(Boolean).join('+');

    const handler = this.keyHandlers[key] ?? null;
    if (!handler) return;

    e.preventDefault();
    e.stopPropagation();
    handler();
  }
}
