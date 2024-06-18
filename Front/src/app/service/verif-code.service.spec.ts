import { TestBed } from '@angular/core/testing';

import { VerifCodeService } from './verif-code.service';

describe('VerifCodeService', () => {
  let service: VerifCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
