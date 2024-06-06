import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductService } from '../products-services/product-service.service';
export interface Customisation {
  price: number;
  quantity: string;
}
export class Product {
  constructor(
    public name: string,
    public description: string = '',
    public icon: string = '',
    public basePrice: number = 0,
    public customisation: Customisation[] = [],
    public user: string = '',
    public _id: string = ''
  ) {}

  private updateInServer(options: any) {
    try {
      fetch('/api/', options);
    } catch (err) {
      this.updateInServer(options);
    }
  }
  update() {
    const options = {
      method: 'POST',
      body: JSON.stringify(this),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    this.updateInServer(options);
  }
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product!: Product;

  constructor(private route: ActivatedRoute, public domSanitizer: DomSanitizer, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.product = this.route.snapshot.data.product;
  }

  productDetailsEdit(): void {
    console.log(this.product);
    this.dialog
      .open(ProductFormComponent, {
        data: this.product,
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((res: Product) => {
        if (res) {
          this.product = res;
        }
      });
  }
}
