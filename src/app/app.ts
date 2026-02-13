import { Component, signal, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {Header} from './components/header/header';
import {ProductGrid} from './components/product-grid/product-grid';
import {Cart} from './components/cart/cart';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Header, ProductGrid, Cart],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pruebas-angular');
  activeTab = signal('products');

  constructor() {
    afterNextRender(() => {
      window.addEventListener('tabChange', (event: any) => {
        this.activeTab.set(event.detail);
      });
    });
  }
}
