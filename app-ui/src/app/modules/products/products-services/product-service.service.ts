import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ResponseTypes } from 'src/app/shared/types/httpResponses';
import { Product } from '../product/product.component';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {}

  initialiseProducts(products: Product[]): void {
    this.products.next(products);
  }

  createEmptyProduct(): Observable<ResponseTypes.Genric | Product> {
    return this.http.post('/api/products', { empty: true }) as Observable<ResponseTypes.Genric | Product>;
  }

  getProducts() {
    return this.http.get('/api/products/all') as Observable<Product[]>;
  }

  fetchProduct(id: string): Observable<Product> {
    const product = this.products.value.find((product: Product) => product._id === id);
    if (product) {
      return of(product);
    }
    return this.http.get(`/api/products/${id}`) as Observable<Product>;
  }

  updateProduct(product: Product) {
    return this.http.put(`/api/products/${product._id}`, product);
  }

  deleteProducts(product: Product) {
    return this.http.delete(`/api/products/${product._id}`);
  }
}
