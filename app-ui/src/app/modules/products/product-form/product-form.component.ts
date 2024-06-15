import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../product/product.component';
import { ProductService } from '../products-services/product-service.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  productForm!: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private formBuilder: UntypedFormBuilder,
    public domSanitizer: DomSanitizer,
    private productService: ProductService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.createProductForm();
    console.info(this.data);
  }

  createProductForm() {
    this.productForm = this.formBuilder.group({
      name: [this.data.name || '', Validators.required],
      description: [this.data.description || '', Validators.required],
      basePrice: [this.data.basePrice, Validators.required],
      _id: this.data._id,
      user: this.data.user,
    });
  }

  // onFileSelected(event: any) {
  //   const fileList: FileList = event.target.files;
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.productForm.get('icon')?.setValue(reader.result);
  //     console.log(this.productForm.value);
  //   };
  //   if (fileList && fileList[0]) {
  //     reader.readAsDataURL(fileList[0]);
  //   }
  // }

  update() {
    if (this.productForm.valid) {
      this.productService.updateProduct(this.productForm.value).subscribe(
        () => {
          this.dialogRef.close(this.productForm.value);
          this.toaster.success('Updated Product Successfully');
        },
        () => {
          this.toaster.error('Failed to Update Product');
        }
      );
    }
  }
}
