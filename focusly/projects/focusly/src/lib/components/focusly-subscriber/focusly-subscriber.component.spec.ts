import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocuslySubscriberComponent } from './focusly-subscriber.component';

describe('FocuslySubscriberComponent', () => {
  let component: FocuslySubscriberComponent;
  let fixture: ComponentFixture<FocuslySubscriberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocuslySubscriberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocuslySubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
