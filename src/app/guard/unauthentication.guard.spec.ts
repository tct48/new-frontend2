import { TestBed } from '@angular/core/testing';

import { UnauthenticationGuard } from './unauthentication.guard';

describe('UnauthenticationGuard', () => {
  let guard: UnauthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UnauthenticationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
