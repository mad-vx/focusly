import { TestBed } from '@angular/core/testing';
import { FocuslyService } from './focus.service';

describe('FocusService', () => {
  let service: FocuslyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FocuslyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
