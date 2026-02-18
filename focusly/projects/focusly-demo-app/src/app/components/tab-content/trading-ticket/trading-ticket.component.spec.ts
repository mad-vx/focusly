import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingTicketComponent } from './trading-ticket.component';

describe('TradingTicketComponent', () => {
  let component: TradingTicketComponent;
  let fixture: ComponentFixture<TradingTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
