import { TestBed } from '@angular/core/testing';

import { RoomsResolver } from './rooms.resolver';

describe('RoomsResolver', () => {
  let resolver: RoomsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RoomsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
