import {
  computed,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  Injector,
  OnDestroy,
  OnInit,
  effect,
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

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  protected readonly focusService = inject(FocusService);
  private readonly injector = inject(Injector);

  private readonly uniqueId = crypto.randomUUID();
  private readonly limitHitSubscription: Subscription;

  /**
   * Public-facing FocusItem snapshot for this host element.
   * Always built from current inputs.
   */
  protected get focus(): FocusItem {
    return {
      column: this.focuslyColumn,
      row: this.focuslyRow,
      groupId: this.focuslyGroup,
      id: this.uniqueId
    } as FocusItem;
  }

  /**
   * Hook for when this element receives focus *programmatically* via effect.
   * Override in derived directives if needed.
   */
  protected onElementFocus: () => void = () => {
    const host = this.elementRef.nativeElement as any;
    if (host.select) {
      host.select();
    }
  };

  /**
   * Hook for programmatic focus of non-native controls (e.g. NzSelect).
   * If set, this will be used instead of native focus/select.
   */
  protected selectCustomElement: (() => void) | undefined;

  /**
   * Pure computed: "Am I currently the active focus item?"
   * NOTE: NO SIDE EFFECTS HERE.
   */
  readonly isActive = computed(() =>
    this.focusService.isCurrentFocus(this.focus)
  );

  /**
   * Keyboard navigation mapping.
   */
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
  get activeClass(): boolean {
    return this.isActive();
  }

  constructor() {
    // Handle "end of grid" / limit hit behaviour
    this.limitHitSubscription = this.focusService.endStopHit$.subscribe(
      (focus: FocusItem) => {
        if (this.focusService.isCurrentFocus(this.focus)) {
          const host = this.elementRef.nativeElement;
          // Defer blur/focus to after the current CD cycle
          queueMicrotask(() => {
            (host as any).blur?.();
            (host as any).focus?.();
          });
        }
      }
    );

    // Effect to handle focus side-effect when this item becomes active
    effect(
      () => {
        if (!this.isActive()) {
          return;
        }

        // Run after current change detection to avoid ExpressionChanged errors
        queueMicrotask(() => {
          // Re-check in case focus changed again before this microtask ran
          if (!this.isActive()) {
            return;
          }

          const host = this.elementRef.nativeElement as any;

          if (this.selectCustomElement) {
            this.selectCustomElement();
          } else {
            host.focus?.();
            if (host.select) {
              host.select();
            }
          }
          this.onElementFocus();
        });
      },
      { injector: this.injector }
    );
  }

  ngOnInit(): void {
    this.focusService.registerItemFocus(this.focus);
  }

  ngOnDestroy(): void {
    this.focusService.unRegisterItemFocus(this.focus);
    this.limitHitSubscription.unsubscribe();
  }

  // These are the ONLY @HostListener decorators; derived directives just
  // override the protected hooks below.

  @HostListener('focus', ['$event'])
  @HostListener('focusin', ['$event'])
  protected handleFocusIn(event: FocusEvent): void {
    this.focusService.onFocus(this.focus);
    this.onFocusIn(event);
  }

  @HostListener('focusout', ['$event'])
  protected handleFocusOut(event: FocusEvent): void {
    this.onFocusOut(event);
  }

  @HostListener('mousedown', ['$event'])
  protected handleMouseDown(event: MouseEvent): void {
    this.onMouseDown(event);
  }

  @HostListener('keydown', ['$event'])
  protected handleKeydown(e: KeyboardEvent): void {
    const key = [
      e.altKey ? 'alt' : '',
      e.shiftKey ? 'shift' : '',
      e.key.toLowerCase()
    ]
      .filter(Boolean)
      .join('+');

    const handler = this.keyHandlers[key];

    if (handler) {
      e.preventDefault();
      e.stopPropagation();
      handler();
    }
    this.onKeydown(e);
  }

  @HostListener('keydown.enter', ['$event'])
  protected handleEnterKey(e: Event): void {
    this.onEnterKey(e as KeyboardEvent);
  }

  // ----- Overridable hooks for derived directives ---------------------------
  // Default implementations do nothing. NzSelectFocusDirective (etc.) can
  // override any of these to implement control-specific behaviour without
  // needing its own @HostListener decorators.

  protected onFocusIn(event: FocusEvent): void {
    // Default: no-op
  }

  protected onFocusOut(event: FocusEvent): void {
    // Default: no-op
  }

  protected onMouseDown(event: MouseEvent): void {
    // Default: no-op
  }

  protected onKeydown(event: KeyboardEvent): void {
    // Default: no-op
  }

  protected onEnterKey(event: KeyboardEvent): void {
    // Default: no-op
  }
}
