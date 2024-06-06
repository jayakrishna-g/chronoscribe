import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Layout } from 'src/app/shared/components/layout/layout.component';
import { Product } from '../product/product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  constructor(private route: ActivatedRoute, public domSanitizer: DomSanitizer) {
    this.products = this.route.snapshot.data.products;
  }

  ngOnInit(): void {}

  filter(product: Product, filterString: string): boolean {
    return product.name.includes(filterString);
  }

  onDelete(product: Product) {}
}
