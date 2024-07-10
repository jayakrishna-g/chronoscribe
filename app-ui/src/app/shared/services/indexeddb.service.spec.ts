import { TestBed } from '@angular/core/testing';

import { IndexeddbService } from './indexeddb.service';

describe('IndexeddbService', () => {
  let service: IndexeddbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexeddbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
