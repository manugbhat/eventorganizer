import { TestBed } from '@angular/core/testing';

import { CommonService } from './common-service.service';

describe('CommonServiceeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonService = TestBed.get(CommonService);
    expect(service).toBeTruthy();
  });
});
