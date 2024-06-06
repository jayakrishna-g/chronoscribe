import { Product } from 'src/app/modules/products/product/product.component';

export interface Category {
  cname: string;
  products: Product[];
  _id?: string;
}
export interface Menu {
  name: string;
  categories: Category[];
  _id: string;
}

export interface ProductCardActions {
  icon: string;
  onClickFunction: string;
}

export interface ProductCardActionIndex {
  productIndex: number;
  actionFunction: string;
}
