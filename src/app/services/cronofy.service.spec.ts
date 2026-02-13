import { TestBed } from '@angular/core/testing';

import { CronofyService } from './cronofy.service';

describe('CronofyService', () => {
  let service: CronofyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CronofyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
