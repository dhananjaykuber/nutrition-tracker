import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  servingSize: number;
  servingUnit: string;
  createdBy: string;
}

export interface FoodEntry {
  id: string;
  foodItemId: string;
  foodItemName: string;
  servings: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  date: Timestamp;
  userId: string;
}

export interface DailySummary {
  date: string;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalCalories: number;
  entries: FoodEntry[];
}
