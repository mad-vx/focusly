import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FocuslyDirective } from '@zaybu/focusly';

@Component({
  selector: 'app-market-analysis',
  imports: [FormsModule, FocuslyDirective],
  templateUrl: './market-analysis.component.html',
  styleUrl: './market-analysis.component.scss',
})
export class MarketAnalysisComponent {
  public model = {
    watchSymbol: 'MSFT',
    timeframe: '1M',
    signal: 'Breakout',
    confidence: 72,
    support: 392.5,
    resistance: 418.0,
    thesis:
      'Consolidation for ~3 weeks. Watching for volume confirmation above resistance.\nPotential add on pullback to prior high.',
    alertOnPriceTouch: true,
    alertOnNews: false,
    pinToDashboard: true,
  };
}
