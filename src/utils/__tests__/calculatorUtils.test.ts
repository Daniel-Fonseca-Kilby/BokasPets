import { describe, it, expect } from 'vitest';
import {
  calculateDailyGrams,
  getMealsPerDay,
  getLoyaltyLevel,
} from '../calculatorUtils';

// ─────────────────────────────────────────
// Tests para calculateDailyGrams()
// ─────────────────────────────────────────
describe('calculateDailyGrams()', () => {
  it('perro adulto de 10kg con actividad moderada devuelve 250g', () => {
    // 10kg * 1000g * 2.5% = 250g
    expect(calculateDailyGrams(10, 'moderado', 3)).toBe(250);
  });

  it('cachorro (< 1 año) necesita 1.5x más que un adulto del mismo peso', () => {
    const adultGrams = calculateDailyGrams(10, 'moderado', 3);
    const puppyGrams = calculateDailyGrams(10, 'moderado', 0.5);
    // Los cachorros tienen un multiplicador de x1.5
    expect(puppyGrams).toBe(Math.round(adultGrams * 1.5));
  });

  it('senior (>= 8 años) necesita 0.85x menos que un adulto del mismo peso', () => {
    const adultGrams = calculateDailyGrams(10, 'moderado', 3);
    const seniorGrams = calculateDailyGrams(10, 'moderado', 9);
    // Los seniors tienen un multiplicador de x0.85
    expect(seniorGrams).toBe(Math.round(adultGrams * 0.85));
  });

  it('actividad alta produce más gramos que actividad baja con el mismo peso', () => {
    const highActivity = calculateDailyGrams(10, 'alto', 3);
    const lowActivity = calculateDailyGrams(10, 'bajo', 3);
    expect(highActivity).toBeGreaterThan(lowActivity);
  });

  it('lanza error cuando el peso es negativo', () => {
    // Peso negativo no tiene sentido fisiológico
    expect(() => calculateDailyGrams(-5, 'moderado', 3)).toThrow('El peso debe ser mayor a 0');
  });

  it('lanza error cuando el peso es cero', () => {
    expect(() => calculateDailyGrams(0, 'moderado', 3)).toThrow('El peso debe ser mayor a 0');
  });

  it('lanza error cuando la edad es negativa', () => {
    expect(() => calculateDailyGrams(10, 'moderado', -1)).toThrow('La edad no puede ser negativa');
  });
});

// ─────────────────────────────────────────
// Tests para getMealsPerDay()
// ─────────────────────────────────────────
describe('getMealsPerDay()', () => {
  it('cachorro (< 1 año) → 3 comidas al día', () => {
    expect(getMealsPerDay(0.5)).toBe(3);
  });

  it('adulto (>= 1 año) → 2 comidas al día', () => {
    expect(getMealsPerDay(3)).toBe(2);
  });

  it('senior (>= 8 años) → 2 comidas al día', () => {
    // Los seniors mantienen 2 comidas pero con menor cantidad
    expect(getMealsPerDay(10)).toBe(2);
  });
});

// ─────────────────────────────────────────
// Tests para getLoyaltyLevel()
// ─────────────────────────────────────────
describe('getLoyaltyLevel()', () => {
  it('0 puntos → nivel Cachorro', () => {
    expect(getLoyaltyLevel(0)).toBe('Cachorro');
  });

  it('199 puntos → aún es nivel Cachorro (límite inferior del siguiente nivel)', () => {
    expect(getLoyaltyLevel(199)).toBe('Cachorro');
  });

  it('200 puntos → sube a nivel Compañero', () => {
    // 200 es el umbral exacto para subir de nivel
    expect(getLoyaltyLevel(200)).toBe('Compañero');
  });

  it('500 puntos → nivel Fiel', () => {
    expect(getLoyaltyLevel(500)).toBe('Fiel');
  });

  it('1000 puntos → nivel Alfa (máximo)', () => {
    expect(getLoyaltyLevel(1000)).toBe('Alfa');
  });
});
