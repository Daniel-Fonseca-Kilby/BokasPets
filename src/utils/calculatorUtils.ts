/**
 * Calcula los gramos diarios recomendados de comida natural.
 * @param weight - Peso en kg
 * @param activity - Nivel de actividad ('bajo', 'moderado', 'alto')
 * @param age - Edad en años
 * @returns Gramos sugeridos al día
 * @throws Error si el peso o la edad son inválidos
 */
export const calculateDailyGrams = (weight: number, activity: string, age: number): number => {
  // Validaciones: valores negativos o cero no tienen sentido fisiológico
  if (weight <= 0) throw new Error('El peso debe ser mayor a 0');
  if (age < 0) throw new Error('La edad no puede ser negativa');

  let multiplier = 2.5; // Moderado por defecto

  if (activity === 'bajo') multiplier = 2.0;
  if (activity === 'alto') multiplier = 3.0;

  // Calculo base (% del peso)
  let baseGrams = (weight * 1000) * (multiplier / 100);

  // Modificadores por edad
  if (age < 1) {
    baseGrams *= 1.5; // Cachorros necesitan más energía
  } else if (age >= 8) {
    baseGrams *= 0.85; // Seniors necesitan menos calorías
  }

  return Math.round(baseGrams);
};

/**
 * Calcula el número de comidas recomendadas al día.
 * @param age - Edad en años
 * @returns Número de comidas
 */
export const calculateDailyMeals = (age: number): number => {
  if (age < 1) return 3;
  return 2;
};

/**
 * Alias de calculateDailyMeals para compatibilidad con tests y nueva API.
 */
export const getMealsPerDay = calculateDailyMeals;

/**
 * Determina el nivel de fidelidad según los puntos acumulados.
 * Niveles: Cachorro (0-199) → Compañero (200-499) → Fiel (500-999) → Alfa (1000+)
 * @param points - Puntos acumulados del usuario
 * @returns Nombre del nivel de fidelidad
 */
export const getLoyaltyLevel = (points: number): string => {
  if (points >= 1000) return 'Alfa';
  if (points >= 500) return 'Fiel';
  if (points >= 200) return 'Compañero';
  return 'Cachorro'; // 0-199 puntos
};

/**
 * Sugiere un plan de comida basado en el perfil del perro.
 * @param weight - Peso en kg
 * @param activity - Nivel de actividad
 * @param age - Edad en años
 * @returns Nombre del plan sugerido
 */
export const suggestPlan = (_weight: number, activity: string, age: number): string => {
  if (age < 1 || activity === 'alto') {
    return 'Bokita de Res'; // Alta energía y proteína
  } else if (age >= 8 || activity === 'bajo') {
    return 'Bokita de Cerdo'; // Fácil digestión para estómagos sensibles o seniors
  }
  return 'Bokita Personalizada'; // Por defecto o moderado
};
