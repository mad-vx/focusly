import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditComplianceComponent } from './audit-compliance.component';

describe('AuditComplianceComponent', () => {
  let component: AuditComplianceComponent;
  let fixture: ComponentFixture<AuditComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditComplianceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
