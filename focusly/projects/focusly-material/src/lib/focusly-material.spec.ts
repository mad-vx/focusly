import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocuslyMaterial } from './focusly-material';

describe('FocuslyMaterial', () => {
  let component: FocuslyMaterial;
  let fixture: ComponentFixture<FocuslyMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocuslyMaterial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocuslyMaterial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
