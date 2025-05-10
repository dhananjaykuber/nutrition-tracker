'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/providers/auth-provider';
import { addFoodItem } from '@/lib/food-service';
import { calculateNutrition } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const servingUnits = [
  'g',
  'ml',
  'oz',
  'cup',
  'tbsp',
  'tsp',
  'piece',
  'slice',
  'serving',
];

export function FoodItemForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [calories, setCalories] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [servingUnit, setServingUnit] = useState('g');
  const [isCalculatingCalories, setIsCalculatingCalories] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateCalories = () => {
    if (!protein || !carbs || !fat) return;

    const proteinValue = parseFloat(protein);
    const carbsValue = parseFloat(carbs);
    const fatValue = parseFloat(fat);

    if (isNaN(proteinValue) || isNaN(carbsValue) || isNaN(fatValue)) return;

    const calculatedCalories = calculateNutrition(
      proteinValue,
      carbsValue,
      fatValue
    );
    setCalories(calculatedCalories.toFixed(1));
  };

  const handleProteinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProtein(e.target.value);
    if (isCalculatingCalories) {
      setTimeout(calculateCalories, 500);
    }
  };

  const handleCarbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarbs(e.target.value);
    if (isCalculatingCalories) {
      setTimeout(calculateCalories, 500);
    }
  };

  const handleFatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFat(e.target.value);
    if (isCalculatingCalories) {
      setTimeout(calculateCalories, 500);
    }
  };

  const handleCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCalories(e.target.value);
    setIsCalculatingCalories(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in');
      return;
    }

    // Validate inputs
    const proteinValue = parseFloat(protein);
    const carbsValue = parseFloat(carbs);
    const fatValue = parseFloat(fat);
    const caloriesValue = parseFloat(calories);
    const servingSizeValue = parseFloat(servingSize);

    if (isNaN(proteinValue) || proteinValue < 0) {
      setError('Please enter a valid protein value');
      return;
    }

    if (isNaN(carbsValue) || carbsValue < 0) {
      setError('Please enter a valid carbs value');
      return;
    }

    if (isNaN(fatValue) || fatValue < 0) {
      setError('Please enter a valid fat value');
      return;
    }

    if (isNaN(caloriesValue) || caloriesValue < 0) {
      setError('Please enter a valid calories value');
      return;
    }

    if (isNaN(servingSizeValue) || servingSizeValue <= 0) {
      setError('Please enter a valid serving size');
      return;
    }

    setIsLoading(true);

    try {
      const foodItem = {
        name,
        protein: proteinValue,
        carbs: carbsValue,
        fat: fatValue,
        calories: caloriesValue,
        servingSize: servingSizeValue,
        servingUnit,
        createdBy: user.uid,
      };

      await addFoodItem(foodItem);

      // Reset form
      setName('');
      setProtein('');
      setCarbs('');
      setFat('');
      setCalories('');
      setServingSize('');
      setServingUnit('g');
      setIsCalculatingCalories(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to add food item');
      } else {
        setError('An unknown error occurred');
      }
      console.error('Error adding food item:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Add Food Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Food Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chicken Breast"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="protein" className="text-sm font-medium">
                Protein (g)
              </label>
              <Input
                id="protein"
                type="number"
                min="0"
                step="0.1"
                value={protein}
                onChange={handleProteinChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="carbs" className="text-sm font-medium">
                Carbs (g)
              </label>
              <Input
                id="carbs"
                type="number"
                min="0"
                step="0.1"
                value={carbs}
                onChange={handleCarbsChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="fat" className="text-sm font-medium">
                Fat (g)
              </label>
              <Input
                id="fat"
                type="number"
                min="0"
                step="0.1"
                value={fat}
                onChange={handleFatChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="calories" className="text-sm font-medium">
                Calories
              </label>
              <Input
                id="calories"
                type="number"
                min="0"
                step="1"
                value={calories}
                onChange={handleCaloriesChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="servingSize" className="text-sm font-medium">
                Serving Size
              </label>
              <Input
                id="servingSize"
                type="number"
                min="0.1"
                step="0.1"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="servingUnit" className="text-sm font-medium">
                Serving Unit
              </label>
              <Select value={servingUnit} onValueChange={setServingUnit}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {servingUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Food Item'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
