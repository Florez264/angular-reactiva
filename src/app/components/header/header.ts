import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartService } from '../../services/cart.service';
import {SearchBar} from '../search-bar/search-bar';

@Component({
  selector: 'app-header',
  imports: [CommonModule, SearchBar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  activeTab = 'products';

  constructor(public cartService: CartService) {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    window.dispatchEvent(new CustomEvent('tabChange', { detail: tab }));
  }
}
