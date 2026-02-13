import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
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
  private destroy$ = new Subject<void>();

  constructor(private mockService: MockService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(term => (term?.trim().length ?? 0) >= 3),
        switchMap(term => {
          this.isLoading = true;
          return this.mockService.search(term!);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results) => {
          this.customers = results;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
