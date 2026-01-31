import { Component, Input, signal, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  FocuslyDirective,
  FocuslyEnterKeySubscriberComponent,
  FocuslyListenerComponent,
} from '@zaybu/focusly';
import { TradeCellContext, TradeRow } from '../../model/trade-row.model';
import { KeyDisplayComponent } from '../key-display.component';
import { FocuslyGroupHostDirective } from '@zaybu/focusly';

@Component({
  selector: 'app-base-component',
  imports: [
    NgTemplateOutlet,
    FocuslyDirective,
    FocuslyEnterKeySubscriberComponent,
    FocuslyListenerComponent,
    FocuslyGroupHostDirective,
  ],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss',
  standalone: true,
})
export class BaseComponent {
  @Input() buyOrSellTemplate?: TemplateRef<TradeCellContext>;
  @Input() quantityTemplate?: TemplateRef<TradeCellContext>;

  tradeRows: TradeRow[] = [
    {
      symbol: 'AAPL',
      ccy: 'USD',
      qty: 120,
      side: 'Buy',
      riskOk: true,
      notes: 'Strong Q4 earnings',
      rowIndex: 0,
    },
    {
      symbol: 'TSLA',
      ccy: 'USD',
      qty: 80,
      side: 'Sell',
      riskOk: false,
      notes: 'Volatile week',
      rowIndex: 1,
    },
    { symbol: 'AMZN', ccy: 'USD', qty: 60, side: 'Buy', riskOk: true, notes: '', rowIndex: 2 },
    {
      symbol: 'MSFT',
      ccy: 'USD',
      qty: 45,
      side: 'Sell',
      riskOk: true,
      notes: 'Tech rotation',
      rowIndex: 3,
    },
    {
      symbol: 'NVDA',
      ccy: 'USD',
      qty: 30,
      side: 'Buy',
      riskOk: false,
      notes: 'Chip shortage',
      rowIndex: 4,
    },
    { symbol: 'GOOG', ccy: 'USD', qty: 75, side: 'Buy', riskOk: true, notes: '', rowIndex: 5 },
    {
      symbol: 'META',
      ccy: 'USD',
      qty: 90,
      side: 'Sell',
      riskOk: true,
      notes: 'High valuation',
      rowIndex: 6,
    },
    {
      symbol: 'BABA',
      ccy: 'HKD',
      qty: 100,
      side: 'Buy',
      riskOk: false,
      notes: 'China reopening',
      rowIndex: 7,
    },
    {
      symbol: 'NFLX',
      ccy: 'USD',
      qty: 40,
      side: 'Buy',
      riskOk: true,
      notes: 'Subscriber growth',
      rowIndex: 8,
    },
    {
      symbol: 'DIS',
      ccy: 'USD',
      qty: 70,
      side: 'Sell',
      riskOk: false,
      notes: 'Earnings miss',
      rowIndex: 9,
    },
  ];

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

  columns = [0, 1, 2, 3, 4, 5, 6];
  rows = [0, 1, 2, 3, 4, 5, 6];

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
