import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FocuslyDirective } from "@zaybu/focusly";

@Component({
  selector: 'app-audit-compliance',
  imports: [FormsModule, FocuslyDirective, FocuslyDirective],
  templateUrl: './audit-compliance.component.html',
  styleUrl: './audit-compliance.component.scss',
})
export class AuditComplianceComponent {
  public model = {
    dateFrom: '2026-02-01',
    dateTo: '2026-02-17',
    user: 'trader.j.smith',
    action: 'Any',
    correlationId: '',
    result: 'Any',
    attestation: 'Reviewed orders and overrides for the selected period.\nNo anomalies detected.',
    includePii: false,
    includeSystemEvents: true,
    redactExport: true,
  };
}
