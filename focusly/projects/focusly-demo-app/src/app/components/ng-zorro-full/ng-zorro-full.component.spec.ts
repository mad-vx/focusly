import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgZorroFullComponent } from './ng-zorro-full.component';

describe('NgZorroFullComponent', () => {
  let component: NgZorroFullComponent;
  let fixture: ComponentFixture<NgZorroFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgZorroFullComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgZorroFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
