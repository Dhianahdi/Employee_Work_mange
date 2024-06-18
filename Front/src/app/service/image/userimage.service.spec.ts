import { TestBed } from '@angular/core/testing';

import { UserimageService } from './userimage.service';

describe('UserimageService', () => {
  let service: UserimageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserimageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
