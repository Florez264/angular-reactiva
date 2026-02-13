import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap, startWith } from 'rxjs/operators';
import { MockService } from '../../services/mock.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss']
})
export class CustomerSearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  customers: Customer[] = [];
  isLoading = false;
  showDropdown = false;
  private destroy$ = new Subject<void>();

  constructor(private mockService: MockService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(term => {
          const trimmed = term?.trim() || '';
          if (trimmed.length < 3) {
            this.customers = [];
            this.isLoading = false;
            this.showDropdown = false;
          } else {
            this.isLoading = true;
            this.showDropdown = true;
          }
        }),
        filter(term => (term?.trim() || '').length >= 3),
        switchMap(term => this.mockService.search(term!)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results) => {
          this.customers = results;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.customers = [];
        }
      });
  }

  selectCustomer(customer: Customer): void {
    this.searchControl.setValue(customer.name, { emitEvent: false });
    this.showDropdown = false;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onFocus(): void {
    if (this.searchControl.value && this.searchControl.value.length >= 3) {
      this.showDropdown = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
