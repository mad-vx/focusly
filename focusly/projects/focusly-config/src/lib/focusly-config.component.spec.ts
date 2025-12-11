import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocuslyConfigComponent } from './focusly-config.component';

describe('FocuslyConfig', () => {
  let component: FocuslyConfigComponent;
  let fixture: ComponentFixture<FocuslyConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocuslyConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FocuslyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
