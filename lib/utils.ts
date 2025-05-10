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
