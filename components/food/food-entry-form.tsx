// components/food/food-entry-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { useAuth } from '@/providers/auth-provider';
import { FoodItem, FoodEntry } from '@/lib/types';
import { getFoodItems, addFoodEntry } from '@/lib/food-service';
import { Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';

export function FoodEntryForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [servings, setServings] = useState('1');
  const [date, setDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const loadFoodItems = async () => {
        try {
          const items = await getFoodItems(user.uid);
          setFoodItems(items);
        } catch (err) {
          console.error('Error loading food items:', err);
          setError('Failed to load food items');
        }
      };

      loadFoodItems();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in');
      return;
    }

    if (!selectedFoodId) {
      setError('Please select a food item');
      return;
    }

    const servingsNum = parseFloat(servings);
    if (isNaN(servingsNum) || servingsNum <= 0) {
      setError('Please enter a valid number of servings');
      return;
    }

    setIsLoading(true);

    try {
      const foodItem = foodItems.find((item) => item.id === selectedFoodId);
      if (!foodItem) {
        throw new Error('Food item not found');
      }

      const entry: Omit<FoodEntry, 'id'> = {
        foodItemId: foodItem.id,
        foodItemName: foodItem.name,
        servings: servingsNum,
        protein: foodItem.protein * servingsNum,
        carbs: foodItem.carbs * servingsNum,
        fat: foodItem.fat * servingsNum,
        calories: foodItem.calories * servingsNum,
        date: Timestamp.fromDate(date),
        userId: user.uid,
      };

      await addFoodEntry(entry);

      // Reset form
      setSelectedFoodId('');
      setServings('1');

      toast.success('Food entry added successfully!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error adding food entry:', err);
      setError(err.message || 'Failed to add food entry');
      toast.error(err.message || 'Failed to add food entry');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFood = foodItems.find((item) => item.id === selectedFoodId);
  const nutritionInfo =
    selectedFood && servings
      ? {
          protein: selectedFood.protein * parseFloat(servings) || 0,
          carbs: selectedFood.carbs * parseFloat(servings) || 0,
          fat: selectedFood.fat * parseFloat(servings) || 0,
          calories: selectedFood.calories * parseFloat(servings) || 0,
        }
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Food Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="foodItem" className="text-sm font-medium">
              Food Item
            </label>
            <Select value={selectedFoodId} onValueChange={setSelectedFoodId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a food item" />
              </SelectTrigger>
              <SelectContent>
                {foodItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} ({item.calories} cal per {item.servingSize}{' '}
                    {item.servingUnit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="servings" className="text-sm font-medium">
              Servings
            </label>
            <Input
              id="servings"
              type="number"
              min="0.1"
              step="0.1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <Input
              id="date"
              type="date"
              value={format(date, 'yyyy-MM-dd')}
              onChange={(e) => setDate(new Date(e.target.value))}
              required
            />
          </div>

          {nutritionInfo && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">
                Nutrition Info (for {servings} servings)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Protein: {nutritionInfo.protein.toFixed(1)}g</div>
                <div>Carbs: {nutritionInfo.carbs.toFixed(1)}g</div>
                <div>Fat: {nutritionInfo.fat.toFixed(1)}g</div>
                <div>Calories: {nutritionInfo.calories.toFixed(0)}</div>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Food Entry'}
          </Button>
        </form>

        {foodItems.length === 0 && !isLoading && (
          <div className="text-center py-4 text-gray-500">
            No food items found. Please add some food items first.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
