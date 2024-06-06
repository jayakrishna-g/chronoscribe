import { Component, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ProductCardActions } from 'src/app/shared/types/menuTypes';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../product/product.component';

@UntilDestroy()
@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss'],
})
export class ProductsGridComponent implements OnInit {
  @Input()
  products: Product[] | null = [];

  @Input()
  productCardActions: ProductCardActions[] = [];

  @Input()
  componentInstance: any;

  constructor(public domSanitizer: DomSanitizer, private dialog: MatDialog) {}
  ngOnInit(): void {}

  onClick(actionFunction: string, pIndex: number) {
    this.componentInstance[actionFunction](pIndex);
  }
}
