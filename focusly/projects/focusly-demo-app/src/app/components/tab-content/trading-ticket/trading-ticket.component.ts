import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FocuslyDirective } from '@zaybu/focusly';

@Component({
  selector: 'app-trading-ticket',
  imports: [FormsModule, FocuslyDirective],
  templateUrl: './trading-ticket.component.html',
  styleUrl: './trading-ticket.component.scss',
})
export class TradingTicketComponent {
  public model = {
    symbol: 'AAPL',
    venue: 'NASDAQ',
    side: 'Buy',
    quantity: 100,
    orderType: 'Limit',
    limitPrice: 187.25,
    timeInForce: 'DAY',
    account: 'TRDR-UK-001',
    notes: 'Watching liquidity around open.',
    iceberg: false,
    postOnly: true,
    requireRiskCheck: true,
  };

  alert(message: string) {
    window.alert(message);
  }
}
