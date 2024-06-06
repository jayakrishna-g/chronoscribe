import { TestBed } from '@angular/core/testing';

import { MenusResolver } from './menus.resolver';

describe('MenusResolver', () => {
  let resolver: MenusResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MenusResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
