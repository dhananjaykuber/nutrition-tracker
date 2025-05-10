import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(number: number, decimals = 1): string {
  return number.toFixed(decimals);
}

export function calculateNutrition(
  protein: number,
  carbs: number,
  fat: number
): number {
  return protein * 4 + carbs * 4 + fat * 9;
}

export function calculateMacroPercentage(
  macroCalories: number,
  totalCalories: number
): number {
  if (totalCalories === 0) return 0;
  return (macroCalories / totalCalories) * 100;
}
