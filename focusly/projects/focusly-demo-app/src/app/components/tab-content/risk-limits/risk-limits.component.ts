import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FocuslyDirective } from '@zaybu/focusly';

@Component({
  selector: 'app-risk-limits',
  imports: [FormsModule, FocuslyDirective],
  templateUrl: './risk-limits.component.html',
  styleUrl: './risk-limits.component.scss',
})
export class RiskLimitsComponent {
  public model = {
    portfolio: 'Multi-Asset',
    limitProfile: 'Standard',
    maxOrderValueGbp: 250000,
    maxPositionValueGbp: 1000000,
    maxLeverage: 2.5,
    varLimitPercent: 4.0,
    preTradeChecksEnabled: true,
    hardBlocksEnabled: true,
    requireApprovalForOverrides: true,
    overrideReason: '',
  };
}
