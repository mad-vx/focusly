import {
  computed,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FocuslyService } from '../services/focusly.service';
import { FocuslyItem, FocuslyTargetItem, FocusRequest } from '../models/focus-item.model';
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

  private readonly limitHitSubscription: Subscription;
  private focusRequestSub?: Subscription;

  protected lastRegistered: FocuslyItem | null = null;

  private focusRafId: number | null = null;
  private focusAttempt = 0;
  private readonly maxFocusAttempts = 120; // ~2s at 60fps

  private activeRequestId: string | null = null;

  get resolvedGroup(): number | undefined {
    return this.focuslyGroup ?? this.groupHost?.resolveGroup();
  }

  protected get focusItem(): FocuslyTargetItem {
    return {
      groupId: this.resolvedGroup,
      id: this.focuslyElementId,
    } as FocuslyTargetItem;
  }

  protected onElementFocus: () => void = () => {
    const host = this.elementRef.nativeElement as any;
    if (host.select) host.select();
  };

  protected selectCustomElement: (() => void) | undefined;

  readonly isActive = computed(() => this.focusService.isCurrentFocus(this.focuslyElementId));

  @HostBinding('class.focusly-active')
  get activeClass(): boolean {
    return this.isActive();
  }

  constructor() {
    this.limitHitSubscription = this.focusService.endStopHit$.subscribe(() => {
      // unchanged behaviour; optional to keep
      if (this.focusService.isCurrentFocus(this.focuslyElementId)) {
        const host = this.elementRef.nativeElement;
        queueMicrotask(() => {
          (host as any).blur?.();
          (host as any).focus?.();
        });
      }
    });
  }

  ngOnInit(): void {
    this.syncRegistration();

    this.focusRequestSub = this.focusService.focusRequests$.subscribe((req) => {
      // match by id + group
      if (req.id !== this.focuslyElementId) return;

      const group = this.resolvedGroup;
      if (req.groupId != null && group != null && req.groupId !== group) return;
      if (req.groupId != null && group == null) return;

      this.ensureDomFocusForRequest(req);
    });
  }

  ngOnDestroy(): void {
    this.cancelFocusRetry();
    this.activeRequestId = null;

    if (this.lastRegistered) {
      this.focusService.unRegisterItemFocus(this.lastRegistered);
      this.lastRegistered = null;
    }

    this.limitHitSubscription.unsubscribe();
    this.focusRequestSub?.unsubscribe();
  }

  protected buildItem(): FocuslyTargetItem | null {
    const groupId = this.resolvedGroup;
    const id = this.focuslyElementId;
    if (groupId == null || !id) return null;
    return { groupId, id };
  }

  protected syncRegistration(): void {
    const next = this.buildItem();

    if (!next) {
      if (this.lastRegistered) {
        this.focusService.unRegisterItemFocus(this.lastRegistered);
        this.lastRegistered = null;
      }
      return;
    }

    if (
      this.lastRegistered &&
      this.lastRegistered.groupId === next.groupId &&
      this.lastRegistered.id === next.id
    ) {
      return;
    }

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

    const rects = el.getClientRects();
    if (!rects || rects.length === 0) return false;

    let p: HTMLElement | null = el;
    while (p) {
      if (p.getAttribute?.('aria-hidden') === 'true') return false;
      p = p.parentElement;
    }

    return true;
  }

  private didDomFocusLand(host: HTMLElement): boolean {
    const active = document.activeElement as HTMLElement | null;
    return !!active && (active === host || host.contains(active));
  }

  private applyDomFocusOnce(host: HTMLElement, req: FocusRequest): void {
    const anyHost = host as any;

    if (this.selectCustomElement) {
      this.selectCustomElement();
    } else {
      anyHost.focus?.({ preventScroll: req.preventScroll ?? true });
      if (anyHost.select) anyHost.select();
    }

    this.onElementFocus();
  }

  private ensureDomFocusForRequest(req: FocusRequest): void {
    this.activeRequestId = req.requestId;
    this.cancelFocusRetry();

    const host = this.elementRef.nativeElement;
    const maxAttempts =
      req.timeoutMs != null ? Math.max(1, Math.ceil(req.timeoutMs / 16)) : this.maxFocusAttempts;

    const attempt = () => {
      // superseded by a newer request
      if (this.activeRequestId !== req.requestId) return;

      this.focusAttempt++;

      if (!this.isActuallyFocusableNow(host)) {
        if (this.focusAttempt >= maxAttempts) {
          this.focusService.ackFocus({
            requestId: req.requestId,
            id: req.id,
            groupId: req.groupId,
            success: false,
            reason: 'not-visible',
          });
          this.activeRequestId = null;
          this.cancelFocusRetry();
          return;
        }
        this.focusRafId = requestAnimationFrame(attempt);
        return;
      }

      this.applyDomFocusOnce(host, req);

      if (!this.didDomFocusLand(host)) {
        if (this.focusAttempt >= maxAttempts) {
          this.focusService.ackFocus({
            requestId: req.requestId,
            id: req.id,
            groupId: req.groupId,
            success: false,
            reason: 'not-focusable',
          });
          this.activeRequestId = null;
          this.cancelFocusRetry();
          return;
        }
        this.focusRafId = requestAnimationFrame(attempt);
        return;
      }

      // success
      this.focusService.ackFocus({
        requestId: req.requestId,
        id: req.id,
        groupId: req.groupId,
        success: true,
      });
      this.activeRequestId = null;
      this.cancelFocusRetry();
    };

    queueMicrotask(() => attempt());
  }

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

  protected onFocusIn(event: FocusEvent): void {}
  protected onFocusOut(event: FocusEvent): void {}
  protected onMouseDown(event: MouseEvent): void {}
  protected onKeydown(event: KeyboardEvent): void {}
  protected onEnterKey(event: KeyboardEvent): void {}
}
