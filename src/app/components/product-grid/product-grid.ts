import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-grid',
  imports: [CommonModule],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGrid {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.products = this.productService.getProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
  }
}
