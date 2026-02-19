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
import { FocuslyService } from '../services/focus.service';
import { FocuslyItem, FocuslyTargetItem } from '../models/focus-item.model';
import { FocuslyGroupHostDirective } from './focusly-group-host.directive';

@Directive({
  selector: '[focusly-target]',
  standalone: true,
})
export class FocuslyTargetDirective implements OnInit, OnDestroy {
  protected readonly groupHost = inject(FocuslyGroupHostDirective, { optional: true });

  @Input({ required: false }) set focuslyGroup(group: number) {
    this._focuslyGroup = group;
    this.syncRegistration();
  }

  @Input({ required: false }) set focuslyElementId(id: string) {
    this._focuslyElementId = id;
    this.syncRegistration();
  }

  get focuslyElementId(): string {
    return this._focuslyElementId?.trim() || this.uniqueId;
  }

  get focuslyGroup(): number | undefined {
    return this._focuslyGroup;
  }

  protected readonly uniqueId = crypto.randomUUID();
  protected _focuslyGroup: number | undefined;
  protected _focuslyElementId: string | undefined;

  protected readonly elementRef = inject(ElementRef<HTMLElement>);
  protected readonly focusService = inject(FocuslyService);
  private readonly injector = inject(Injector);

  private readonly limitHitSubscription: Subscription;
  protected lastRegistered: FocuslyItem | null = null;

    private focusRafId: number | null = null;
    private focusAttempt = 0;
    private readonly maxFocusAttempts = 120; // ~2s at 60fps

  get resolvedGroup(): number | undefined {
    return this.focuslyGroup ?? this.groupHost?.resolveGroup();
  }

  protected get focusItem(): FocuslyTargetItem {
    return <FocuslyTargetItem> {
      groupId: this.resolvedGroup,
      id: this.focuslyElementId,
    };
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

  readonly isActive = computed(() => this.focusService.isCurrentFocus(this.focuslyElementId));

  @HostBinding('class.focusly-active')
  get activeClass(): boolean {
    return this.isActive();
  }

  constructor() {
    this.limitHitSubscription = this.focusService.endStopHit$.subscribe((focus: FocuslyItem) => {
      if (this.focusService.isCurrentFocus(this.focuslyElementId)) {
        const host = this.elementRef.nativeElement;
        // Defer blur/focus to after the current CD cycle
        queueMicrotask(() => {
          (host as any).blur?.();
          (host as any).focus?.();
        });
      }
    });

    effect(
        () => {
            if (!this.isActive()) {
            // if we lose active state, stop retrying
            this.cancelFocusRetry();
            return;
            }

            this.ensureDomFocus();
        },
        { injector: this.injector },
    );
  }

  ngOnInit(): void {
    this.syncRegistration();
  }

  ngOnDestroy(): void {
    if (this.lastRegistered) {
      this.focusService.unRegisterItemFocus(this.lastRegistered);
      this.lastRegistered = null;
    }

    this.limitHitSubscription.unsubscribe();
  }

  protected buildItem(): FocuslyTargetItem | null {
    const groupId = this.resolvedGroup;
    const id = this.focuslyElementId;
    if (groupId == null || !id) return null;
    return { groupId, id };
  }

  protected syncRegistration(): void {
    const next = this.buildItem();

    // Not ready yet
    if (!next) {
        if (this.lastRegistered) {
        this.focusService.unRegisterItemFocus(this.lastRegistered);
        this.lastRegistered = null;
        }
        return;
    }

    // If unchanged, no-op
    if (
        this.lastRegistered &&
        this.lastRegistered.groupId === next.groupId &&
        this.lastRegistered.id === next.id
    ) {
        return;
    }

    // If group changed, unregister old one first
    if (this.lastRegistered && this.lastRegistered.groupId !== next.groupId) {
        this.focusService.unRegisterItemFocus(this.lastRegistered);
    }

    this.focusService.registerItemFocus(next);
    this.lastRegistered = next;
  }

private cancelFocusRetry(): void {
    if (this.focusRafId != null) {
        cancelAnimationFrame(this.focusRafId);
        this.focusRafId = null;
    }
    this.focusAttempt = 0;
}

private isActuallyFocusableNow(el: HTMLElement): boolean {
  if (!el.isConnected) return false;

  const anyEl = el as any;
  if (anyEl.disabled) return false;

  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') return false;

  // Many tab systems keep elements in DOM but with 0 rects while hidden/animating.
  const rects = el.getClientRects();
  if (!rects || rects.length === 0) return false;

  // Optional: respect aria-hidden up the tree (Material may set this)
  let p: HTMLElement | null = el;
  while (p) {
    if (p.getAttribute?.('aria-hidden') === 'true') return false;
    p = p.parentElement;
  }

  return true;
}

private didDomFocusLand(host: HTMLElement): boolean {
  const active = document.activeElement as HTMLElement | null;
  if (!active) return false;
  return active === host || host.contains(active);
}

private applyDomFocusOnce(host: HTMLElement): void {
  const anyHost = host as any;

  if (this.selectCustomElement) {
    this.selectCustomElement();
  } else {
    anyHost.focus?.();
    if (anyHost.select) anyHost.select();
  }

  // keep your hook
  this.onElementFocus();
}

private ensureDomFocus(): void {
  // Cancel any previous loop and start fresh
  this.cancelFocusRetry();

  const host = this.elementRef.nativeElement;

  const attempt = () => {
    // Stop if we’re no longer the active Focusly item
    if (!this.isActive()) {
      this.cancelFocusRetry();
      return;
    }

    this.focusAttempt++;

    // Wait until the host is actually focusable/visible
    if (!this.isActuallyFocusableNow(host)) {
      if (this.focusAttempt >= this.maxFocusAttempts) {
        this.cancelFocusRetry();
        return;
      }
      this.focusRafId = requestAnimationFrame(attempt);
      return;
    }

    // Try to focus
    this.applyDomFocusOnce(host);

    // Confirm it stuck; if not, retry
    if (!this.didDomFocusLand(host)) {
      if (this.focusAttempt >= this.maxFocusAttempts) {
        this.cancelFocusRetry();
        return;
      }
      this.focusRafId = requestAnimationFrame(attempt);
      return;
    }

    // Success
    this.cancelFocusRetry();
  };

  // Start after current CD cycle
  queueMicrotask(() => {
    if (!this.isActive()) return;
    attempt();
  });
}

  // These are the ONLY @HostListener decorators; derived directives just
  // override the protected hooks below.

  @HostListener('focus', ['$event'])
  @HostListener('focusin', ['$event'])
  protected handleFocusIn(event: FocusEvent): void {
    this.focusService.onFocus(this.focusItem);
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
    const handler = this.focusService.getHandlerForKeyboardEvent(e);
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
