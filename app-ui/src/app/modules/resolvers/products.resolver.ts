import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Product } from '../products/product/product.component';
import { ProductService } from '../products/products-services/product-service.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsResolver  {
  constructor(private productsService: ProductService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product[]> {
    return this.productsService.getProducts();
  }
}
