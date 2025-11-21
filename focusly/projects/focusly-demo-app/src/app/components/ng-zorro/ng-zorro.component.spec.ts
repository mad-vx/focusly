import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgZorroComponent } from './ng-zorro.component';

describe('NgZorroComponent', () => {
  let component: NgZorroComponent;
  let fixture: ComponentFixture<NgZorroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgZorroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgZorroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
