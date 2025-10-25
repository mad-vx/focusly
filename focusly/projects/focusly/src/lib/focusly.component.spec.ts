import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocuslyComponent } from './focusly.component';

describe('FocuslyComponent', () => {
  let component: FocuslyComponent;
  let fixture: ComponentFixture<FocuslyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FocuslyComponent]
    });
    fixture = TestBed.createComponent(FocuslyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
