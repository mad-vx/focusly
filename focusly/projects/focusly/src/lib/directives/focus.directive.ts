import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
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
export class FocusDirective implements OnInit, OnDestroy {
  @Input({ required: true }) set focusColumn(column: number) {
    this._focusColumn = column;
    this.focusService.registerItemFocus(this.focus);
  }

  @Input({ required: true }) set focusRow(row: number) {
    this._focusRow = row;
    this.focusService.registerItemFocus(this.focus);
  }

  @Input({ required: true }) set focusScope(scope: number) {
    this._focusScope = scope;
    this.focusService.registerItemFocus(this.focus);
  }

  get focusColumn(): number | undefined {
    return this._focusColumn;
  }

  get focusRow(): number | undefined {
    return this._focusRow;
  }

  get focusScope(): number | undefined {
    return this._focusScope;
  }

  private _focusColumn: number | undefined;
  private _focusRow: number | undefined;
  private _focusScope: number | undefined;

  private focusChangedSubscription: Subscription;
  private limitHitSubscription: Subscription;
  private uniqueId = uuidv4();

  protected get focus(): FocusItem {
    return <FocusItem>{
      column: this.focusColumn,
      row: this.focusRow,
      groupId: this.focusScope,
      id: this.uniqueId
    };
  }

  // Override this method to implement custom onFocus actions
  onElementFocus = (): void => {
    this.elementRef.nativeElement.select();
  };

  // Override this method to implement custom focus() actions
  selectCustomElement: (() => void) | undefined;

  constructor(
    protected elementRef: ElementRef,
    protected focusService: FocusService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    this.focusChangedSubscription = this.focusService.focusChanged$.subscribe(
      (focus: FocusItem) => {
        if (this.focusService.isCurrentFocus(this.focus)) {
          this.elementRef.nativeElement.focus();
          if (this.elementRef.nativeElement.select) {
            this.elementRef.nativeElement.select();
            this.changeDetectorRef.detectChanges();
          } else {
            if (this.selectCustomElement) {
              this.selectCustomElement();
              this.changeDetectorRef.detectChanges();
            }
          }
        }
      }
    );

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
    this.focusChangedSubscription.unsubscribe();
    this.limitHitSubscription.unsubscribe();
  }

  @HostListener('focus', ['$event'])
  public onFocus(event: any): void {
    this.focusService.onFocus(this.focus);
    if (this.onElementFocus) {
      this.onElementFocus();
      this.changeDetectorRef.detectChanges();
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
