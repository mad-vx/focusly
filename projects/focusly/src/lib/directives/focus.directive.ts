import {
  computed,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
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
  private uniqueId = uuidv4();

  protected get focus(): FocusItem {
    return <FocusItem>{
      column: this.focuslyColumn,
      row: this.focuslyRow,
      groupId: this.focuslyGroup,
      id: this.uniqueId
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

  @HostBinding('class.focusly-active')
  get activeClass() {
    return this.isActive();
  }

  constructor(
    protected elementRef: ElementRef,
    protected focusService: FocusService
  ) {

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

  @HostListener('keydown.tab', ['$event'])
  @HostListener('keydown.alt.arrowdown', ['$event'])
  public onKeyPressArrowDown(event: KeyboardEvent): void {
    this.processKeyPress(event, () => this.focusService.down());
  }

  @HostListener('keydown.shift.tab', ['$event'])
  @HostListener('keydown.alt.arrowup', ['$event'])
  public onKeyPressArrowUp(event: KeyboardEvent): void {
    this.processKeyPress(event, () => this.focusService.up());
  }

  @HostListener('keydown.alt.arrowleft', ['$event'])
  public onKeyPressArrowLeft(event: KeyboardEvent): void {
    this.processKeyPress(event, () => this.focusService.left());
  }

  @HostListener('keydown.alt.arrowright', ['$event'])
  public onKeyPressArrowRight(event: KeyboardEvent): void {
    this.processKeyPress(event, () => this.focusService.right());
  }

  @HostListener('keydown.home', ['$event'])
  public onKeyPressHome(event: KeyboardEvent): void {
    this.processKeyPress(event, () => this.focusService.home());
  }

  @HostListener('keydown.end', ['$event'])
  public onKeyPressEnd(event: KeyboardEvent): void {
    this.processKeyPress(event, () => this.focusService.end());
  }

  @HostListener('keydown.pageup', ['$event'])
  public onKeyPressPageUp(event: KeyboardEvent): void {
    this.processKeyPress(event, () => this.focusService.pageUp());
  }

  @HostListener('keydown.pagedown', ['$event'])
  public onKeyPressPageDown(event: KeyboardEvent): void {
    this.processKeyPress(event, () => this.focusService.pageDown());
  }

  private processKeyPress(event: KeyboardEvent, focusServiceMethod: () => void) {
    event.stopPropagation();
    event.preventDefault();
    focusServiceMethod();
  }
}
