import { Component, Input, signal, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FocuslyGroupHostDirective, FocuslyShortcutHostDirective, FocuslyDirective, FocuslyShortcutDirective } from '@zaybu/focusly';
import { TradeCellContext, TradeRow } from '../../model/trade-row.model';
import { tradeData } from '../../model/trade-data.model';
import { KeyDisplayComponent } from '../key-display.component';

@Component({
  selector: 'app-base-component',
  imports: [
    NgTemplateOutlet,
    FocuslyDirective,
    FocuslyGroupHostDirective,
    FocuslyShortcutHostDirective,
    FocuslyShortcutDirective
],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss',
  standalone: true,
})
export class BaseComponent {
  @Input() buyOrSellTemplate?: TemplateRef<TradeCellContext>;
  @Input() quantityTemplate?: TemplateRef<TradeCellContext>;

  tradeRows = tradeData;

  customer = {
    name: 'Jane Porter',
    status: 'Active',
    vip: true,
    email: 'jane.porter@example.com',
    phone: '07123000999',
    website: 'https://github.com/mad-vx',
    address1: '44 Bishopsgate',
    address2: 'Level 12',
    address3: '',
    city: 'London',
    postcode: 'EC9X 7OZ',
    country: 'UK',
  };

  activeSaveButton = signal<1 | 2 | null>(null);
  lastActionMessage: string | null = null;
  showToast = false;
  private toastTimeoutHandle: any;
  private buttonFlashHandle: any;

  onEnterKey(): void {
    this.triggerFeedback(1, 'Saving Trading Information');
  }

  onEnterKey2(): void {
    this.triggerFeedback(2, 'Save Customer Details');
  }

  onKeyPress($event: any) {}

  private triggerFeedback(which: 1 | 2, msg: string): void {
    this.activeSaveButton.set(which);

    if (this.buttonFlashHandle) {
      clearTimeout(this.buttonFlashHandle);
    }
    this.buttonFlashHandle = setTimeout(() => {
      this.activeSaveButton.set(null);
    }, 1000);

    this.lastActionMessage = msg;
    this.showToast = true;

    if (this.toastTimeoutHandle) {
      clearTimeout(this.toastTimeoutHandle);
    }
    this.toastTimeoutHandle = setTimeout(() => {
      this.showToast = false;
    }, 1500);
  }
}
