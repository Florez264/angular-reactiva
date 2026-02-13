# EJERCICIO 3: Debugging y Performance

## Análisis del Código Problemático

```typescript
@Component({
  template: `
    <div *ngFor="let item of items">
      {{ expensiveCalculation(item) }}
    </div>
  `,
})
export class ListComponent {
  @Input() items: any[];

  expensiveCalculation(item) {
    console.log("Calculando..."); // Simula proceso pesado
    return Math.random();
  }
}
```

## 3 Errores de Performance/Lógica Identificados

### ❌ Error 1: Función en Template sin TrackBy
**Problema:** `expensiveCalculation()` se ejecuta en cada ciclo de detección de cambios
**Impacto:** Performance crítica - la función se ejecuta múltiples veces innecesariamente

### ❌ Error 2: Falta TrackBy Function en ngFor
**Problema:** Angular no puede identificar qué elementos cambiaron en la lista
**Impacto:** Re-renderiza toda la lista cuando cambia cualquier elemento

### ❌ Error 3: Cálculo No Determinístico
**Problema:** `Math.random()` devuelve valores diferentes en cada ejecución
**Impacto:** Resultados inconsistentes y imposibilidad de cachear

## ✅ Solución Optimizada

```typescript
@Component({
  template: `
    <div *ngFor="let item of items; trackBy: trackByFn">
      {{ getCalculatedValue(item) }}
    </div>
  `,
})
export class ListComponent {
  @Input() items: any[];
  private calculationCache = new Map<any, number>();

  // Función determinística con caché
  getCalculatedValue(item: any): number {
    if (!this.calculationCache.has(item)) {
      console.log("Calculando...");
      this.calculationCache.set(item, this.expensiveCalculation(item));
    }
    return this.calculationCache.get(item)!;
  }

  // TrackBy function para optimizar ngFor
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  private expensiveCalculation(item: any): number {
    // Cálculo determinístico basado en propiedades del item
    return item.value * 2 + item.id;
  }
}
```

## Mejoras Implementadas

1. **Caché de resultados** - Evita recálculos innecesarios
2. **TrackBy function** - Optimiza renderizado de listas
3. **Cálculo determinístico** - Resultados consistentes y cacheables
4. **Separación de responsabilidades** - Lógica clara y mantenible