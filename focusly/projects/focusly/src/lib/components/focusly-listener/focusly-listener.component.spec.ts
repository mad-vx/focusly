import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocuslyListenerComponent } from './focusly-listener.component';

describe('FocuslyListenerComponent', () => {
  let component: FocuslyListenerComponent;
  let fixture: ComponentFixture<FocuslyListenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocuslyListenerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FocuslyListenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
