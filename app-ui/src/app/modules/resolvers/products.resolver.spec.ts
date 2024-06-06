import { TestBed } from '@angular/core/testing';

import { ProductsResolver } from './products.resolver';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ProductsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
