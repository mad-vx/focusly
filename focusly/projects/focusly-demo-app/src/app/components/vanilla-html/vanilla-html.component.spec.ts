import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanillaHtmlComponent } from './vanilla-html.component';

describe('VanillaHtmlComponent', () => {
  let component: VanillaHtmlComponent;
  let fixture: ComponentFixture<VanillaHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VanillaHtmlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VanillaHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
