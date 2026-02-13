import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class MockService {
  private customers: Customer[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan1@example.com' },
    { id: 2, name: 'Juan Rodríguez', email: 'juan2@example.com' },
    { id: 3, name: 'Juan Martínez', email: 'juan3@example.com' },
    { id: 4, name: 'Juan Gómez', email: 'juan4@example.com' },

    { id: 5, name: 'María García', email: 'maria1@example.com' },
    { id: 6, name: 'María López', email: 'maria2@example.com' },
    { id: 7, name: 'María Fernández', email: 'maria3@example.com' },
    { id: 8, name: 'María Torres', email: 'maria4@example.com' },

    { id: 9, name: 'Carlos Sánchez', email: 'carlos1@example.com' },
    { id: 10, name: 'Carlos Ramírez', email: 'carlos2@example.com' },
    { id: 11, name: 'Carlos Herrera', email: 'carlos3@example.com' },

    { id: 12, name: 'Ana Castro', email: 'ana1@example.com' },
    { id: 13, name: 'Ana Morales', email: 'ana2@example.com' },
    { id: 14, name: 'Ana Ríos', email: 'ana3@example.com' },

    { id: 15, name: 'Pedro Díaz', email: 'pedro1@example.com' },
    { id: 16, name: 'Pedro Ortiz', email: 'pedro2@example.com' },

    { id: 17, name: 'Laura Navarro', email: 'laura1@example.com' },
    { id: 18, name: 'Laura Pineda', email: 'laura2@example.com' },

    { id: 19, name: 'Jorge Vega', email: 'jorge1@example.com' },
    { id: 20, name: 'Jorge Silva', email: 'jorge2@example.com' }
  ];

  search(term: string): Observable<Customer[]> {
    const results = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(term.toLowerCase()) ||
      customer.email.toLowerCase().includes(term.toLowerCase())
    );
    
    return of(results).pipe(delay(300));
  }
}
