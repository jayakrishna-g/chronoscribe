import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ProductCardActions } from 'src/app/shared/types/menuTypes';
import { ProductFormComponent } from '../product-form/product-form.component';
import { Product } from '../product/product.component';
import { ProductService } from '../products-services/product-service.service';

@UntilDestroy()
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  productCardActions: ProductCardActions[] = [
    { icon: 'edit', onClickFunction: 'editProduct' },
    { icon: 'delete', onClickFunction: 'deleteProduct' },
    { icon: 'star_outline', onClickFunction: 'FavProduct' },
    { icon: 'visibility_off', onClickFunction: 'VisibilityOffProduct' },
  ];

  deleteItem(id: string): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent).afterClosed().pipe(untilDestroyed(this)) as Observable<boolean>;
  }

  constructor(
    private dialog: MatDialog,
    public domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private productService: ProductService,
    private toasterService: ToastrService
  ) {
    this.editProduct.bind(this.dialog);
  }
  ngOnInit(): void {
    this.products.next(this.route.snapshot.data.products);
  }

  editProduct(index: number) {
    this.dialog
      .open(ProductFormComponent, {
        data: this.products.value[index],
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((res: Product) => {
        if (res) {
          this.products.value[index] = res;
        }
      });
  }

  createProduct(event: MouseEvent) {
    event.stopPropagation();
    this.productService.createEmptyProduct().subscribe(
      (res) => {
        this.toasterService.success('Created Empty Product Successfully');
        const curProducts = this.products.value;
        curProducts.push(res as Product);
      },
      (err) => {
        this.toasterService.error(err);
      }
    );
  }

  deleteProduct(index: number) {
    const product = this.products.value[index];
    const id = product._id;
    this.deleteItem(id).subscribe((userInput: boolean) => {
      if (userInput) {
        this.productService.deleteProducts(product).subscribe(
          (res) => {
            var curMenus = this.products.value;

            this.products = new BehaviorSubject<Product[]>(
              curMenus.slice(0, index).concat(curMenus.slice(index + 1, curMenus.length))
            );
            this.toasterService.success('deleted Successfully');
          },
          (err) => {
            this.toasterService.error(err);
          }
        );
      }
    });
  }

  FavProduct(index: number) {}
  VisibilityOffProduct(index: number) {}
}
