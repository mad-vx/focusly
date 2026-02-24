import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabInstructionsComponent } from './tab-instructions.component';

describe('TabInstructionsComponent', () => {
  let component: TabInstructionsComponent;
  let fixture: ComponentFixture<TabInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabInstructionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
