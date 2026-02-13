import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerSearchComponent } from './components/customer-search/customer-search.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CustomerSearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pruebas-angular');
}
