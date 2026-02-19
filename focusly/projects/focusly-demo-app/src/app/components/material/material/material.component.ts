import { Component, inject, signal } from '@angular/core';
import { BaseDemoGrid } from '../../abstract/base-demo-grid';
import { FOCUSLY_SERVICE_API, FocuslyDirective, FocuslyGroupHostDirective, FocuslyShortcutHostDirective, FocuslyShortcuts } from '@zaybu/focusly';
import { BaseComponent } from '../../base/base.component';
import { FormsModule } from '@angular/forms';
import { MatTabsModule} from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectFocusDirective } from '@zaybu/focusly-material';
import { TradingTicketComponent } from '../../tab-content/trading-ticket/trading-ticket.component';
import { CustomerComponent } from '../../tab-content/customer/customer.component';
import { MarketAnalysisComponent } from '../../tab-content/market-analysis/market-analysis.component';
import { RiskLimitsComponent } from '../../tab-content/risk-limits/risk-limits.component';
import { AuditComplianceComponent } from '../../tab-content/audit-compliance/audit-compliance.component';
import { TabInstructionsComponent } from '../../tab-content/tab-instructions/tab-instructions.component';

@Component({
  selector: 'app-material',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FocuslyDirective,
    BaseComponent,
    MatSelectFocusDirective,
    MatTabsModule,
    TradingTicketComponent,
    CustomerComponent,
    MarketAnalysisComponent,
    RiskLimitsComponent,
    AuditComplianceComponent,
    FocuslyGroupHostDirective,
    FocuslyShortcutHostDirective, 
    TabInstructionsComponent
  ],
  templateUrl: './material.component.html',
  styleUrl: './material.component.scss',
})
export class MaterialComponent extends BaseDemoGrid {
  override title: string = 'Material UI - Focusly Demo';

  private focuslyService = inject(FOCUSLY_SERVICE_API);
  selectedIndex = signal(0);

  focuslyShortcuts: FocuslyShortcuts = {
      'alt+1': () => {
        this.selectIndex(0);
        this.focuslyService.setFocusByElementId('tradingFirstField');
      },
      'alt+2': () => {
       this.selectIndex(1);
       this.focuslyService.setFocusByElementId('customerFirstField');
    },
      'alt+3': () => {
       this.selectIndex(2);
       this.focuslyService.setFocusByElementId('marketFirstField');
    },
      'alt+4': () => {
       this.selectIndex(3);
       this.focuslyService.setFocusByElementId('riskFirstField');
    },
      'alt+5': () => {
       this.selectIndex(4);
       this.focuslyService.setFocusByElementId('auditFirstField');
    }
  };

  selectIndex(index: number) {
    this.selectedIndex.set(index);
  }

  selectFirstField() {
    this.selectIndex(0); 
    this.focuslyService.setFocusByElementId('tradingFirstField');
  }
}
