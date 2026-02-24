import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskLimitsComponent } from './risk-limits.component';

describe('RiskLimitsComponent', () => {
  let component: RiskLimitsComponent;
  let fixture: ComponentFixture<RiskLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskLimitsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RiskLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
