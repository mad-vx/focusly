import { Component, inject, signal } from '@angular/core';
import { 
  FocuslyTargetDirective, 
  FocuslyDirective, 
  FocuslyGroupHostDirective, 
  FocuslyShortcutHostDirective, 
  FocuslyShortcutDirective, 
  FocuslyShortcuts, 
  FOCUSLY_SERVICE_API  }
from '@zaybu/focusly';
import { NzInputNumberFocusDirective, NzSelectFocusDirective } from '@zaybu/focusly-nz';
import { BaseComponent } from '../base/base.component';
import { FormsModule } from '@angular/forms';
import { BaseDemoGrid } from '../abstract/base-demo-grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { BaseFullComponent } from '../base-full/base-full.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { TradingTicketComponent } from '../tab-content/trading-ticket/trading-ticket.component';
import { CustomerComponent } from '../tab-content/customer/customer.component';
import { MarketAnalysisComponent } from '../tab-content/market-analysis/market-analysis.component';
import { RiskLimitsComponent } from '../tab-content/risk-limits/risk-limits.component';
import { AuditComplianceComponent } from '../tab-content/audit-compliance/audit-compliance.component';

@Component({
  selector: 'app-ng-zorro',
  imports: [
    NzSelectModule,
    NzSelectFocusDirective,
    NzInputNumberFocusDirective,
    FormsModule,
    BaseComponent,
    BaseFullComponent,
    NzInputNumberModule,
    NzInputNumberFocusDirective,
    NzSliderModule,
    NzDatePickerModule,
    NzRadioModule,
    NzButtonModule,
    NzTabsModule,
    FocuslyDirective,
    FocuslyTargetDirective,
    FocuslyGroupHostDirective,
    FocuslyShortcutDirective,
    FocuslyShortcutHostDirective,
    TradingTicketComponent,
    CustomerComponent,
    MarketAnalysisComponent,
    RiskLimitsComponent,
    AuditComplianceComponent
  ],
  templateUrl: './ng-zorro.component.html',
  standalone: true,
})
export class NgZorroComponent extends BaseDemoGrid {
  override title: string = 'NgZorro - Focusly Demo';
  private focuslyService = inject(FOCUSLY_SERVICE_API);

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
  
  selectedIndex = signal(0);
  constructor() {
    super();
  }

  selectIndex(index: number) {
    console.log(index);
    this.selectedIndex.set(index);
  }
}
