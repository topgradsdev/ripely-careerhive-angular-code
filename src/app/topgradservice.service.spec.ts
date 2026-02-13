import { TestBed } from '@angular/core/testing';

import { TopgradserviceService } from './topgradservice.service';

describe('TopgradserviceService', () => {
  let service: TopgradserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopgradserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
