import { TestBed } from '@angular/core/testing';

import { FeathericonsService } from './feathericons.service';

describe('FeathericonsService', () => {
  let service: FeathericonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeathericonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
