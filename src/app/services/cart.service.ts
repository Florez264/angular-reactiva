import { Injectable, signal, computed, effect } from '@angular/core';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _items = signal<CartItem[]>([]);

  items = this._items.asReadonly();

  totalPrice = computed(() => 
    this._items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  totalCount = computed(() => 
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor() {
    effect(() => {
      console.log('Cart changed:', {
        items: this._items(),
        totalPrice: this.totalPrice(),
        totalCount: this.totalCount()
      });
    });
  }

  addItem(product: Product): void {
    const currentItems = this._items();
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      this._items.set(
        currentItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this._items.set([...currentItems, { ...product, quantity: 1 }]);
    }
  }
}