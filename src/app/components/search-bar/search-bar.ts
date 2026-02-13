import { Component, OnInit, OnDestroy, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap, delay } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  products: Product[] = [];
  searchHistory: string[] = [];
  isLoading = false;
  showDropdown = false;
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) {
    afterNextRender(() => {
      this.loadSearchHistory();
    });
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
          const trimmed = term?.trim() || '';
          
          if (trimmed.length === 0) {
            this.showDropdown = false;
            this.isLoading = false;
            return of([]);
          }
          
          if (trimmed.length < 3) {
            this.showDropdown = false;
            this.isLoading = false;
            return of([]);
          }
          
          this.isLoading = true;
          this.showDropdown = true;
          return this.searchProducts(trimmed);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results) => {
          this.products = results;
          this.isLoading = false;
          if (results.length > 0 && this.searchControl.value && this.searchControl.value.trim().length >= 3) {
            this.showDropdown = true;
          }
        },
        error: () => {
          this.isLoading = false;
          this.products = [];
          this.showDropdown = false;
        }
      });
  }

  private searchProducts(term: string) {
    const results = this.productService.getProducts().filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    return of(results).pipe(delay(150));
  }

  selectProduct(product: Product): void {
    this.searchControl.setValue(product.name, { emitEvent: false });
    this.addToHistory(product.name);
    this.showDropdown = false;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onFocus(): void {
    const value = this.searchControl.value?.trim() || '';
    if (value.length >= 3 && this.products.length > 0) {
      this.showDropdown = true;
    } else if (value.length === 0 && this.searchHistory.length > 0) {
      this.showDropdown = true;
    }
  }

  private loadSearchHistory(): void {
    if (typeof localStorage !== 'undefined') {
      const history = localStorage.getItem('searchHistory');
      if (history) {
        this.searchHistory = JSON.parse(history);
      }
    }
  }

  private addToHistory(term: string): void {
    const trimmed = term.trim();
    if (trimmed && !this.searchHistory.includes(trimmed)) {
      this.searchHistory.unshift(trimmed);
      this.searchHistory = this.searchHistory.slice(0, 5);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
      }
    }
  }

  selectFromHistory(term: string): void {
    this.searchControl.setValue(term);
    this.showDropdown = false;
  }

  clearHistory(): void {
    this.searchHistory = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('searchHistory');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
