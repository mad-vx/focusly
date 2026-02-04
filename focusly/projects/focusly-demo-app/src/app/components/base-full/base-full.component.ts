import { Component, Input, signal, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  FocuslyDirective,
  FocuslyEnterKeySubscriberComponent,
  FocuslyListenerComponent,
} from '@zaybu/focusly';
import { TradeCellContext, TradeRow } from '../../model/trade-row.model';
import { tradeData } from '../../model/trade-data.model';

@Component({
  selector: 'app-base-full-component',
  imports: [
    NgTemplateOutlet,
    FocuslyDirective
  ],
  templateUrl: './base-full.component.html',
  styleUrl: './base-full.component.scss',
  standalone: true,
})
export class BaseFullComponent {
  @Input() buyOrSellTemplate?: TemplateRef<TradeCellContext>;
  @Input() quantityTemplate?: TemplateRef<TradeCellContext>;
  @Input() tradeDateTemplate?: TemplateRef<TradeCellContext>;
  @Input() urgencyTemplate?: TemplateRef<TradeCellContext>;
  @Input() ratingTemplate?: TemplateRef<TradeCellContext>;
  @Input() actionTemplate?: TemplateRef<TradeCellContext>;

  tradeRows = tradeData;
}
