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
import { useAuth } from '@/providers/auth-provider';
import { getFoodItem, updateFoodItem } from '@/lib/food-service';
import { calculateNutrition } from '@/lib/utils';
import { FoodItem } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'react-toastify';

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

interface FoodItemEditFormProps {
  foodItemId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function FoodItemEditForm({
  foodItemId,
  open,
  onOpenChange,
  onSuccess,
}: FoodItemEditFormProps) {
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
  const { user } = useAuth();

  useEffect(() => {
    const loadFoodItem = async () => {
      if (open && foodItemId) {
        try {
          const item = await getFoodItem(foodItemId);
          if (item) {
            setName(item.name);
            setProtein(item.protein.toString());
            setCarbs(item.carbs.toString());
            setFat(item.fat.toString());
            setCalories(item.calories.toString());
            setServingSize(item.servingSize.toString());
            setServingUnit(item.servingUnit);
          }
        } catch (err) {
          console.error('Error loading food item:', err);
          setError('Failed to load food item');
        }
      }
    };

    loadFoodItem();
  }, [open, foodItemId]);

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
      const updatedItem: Partial<FoodItem> = {
        name,
        protein: proteinValue,
        carbs: carbsValue,
        fat: fatValue,
        calories: caloriesValue,
        servingSize: servingSizeValue,
        servingUnit,
      };

      await updateFoodItem(foodItemId, updatedItem);

      toast.success('Food item updated successfully!');

      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error updating food item:', err);
      setError(err.message || 'Failed to update food item');
      toast.error(err.message || 'Failed to update food item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Food Item</DialogTitle>
          <DialogDescription>
            Update the nutritional information for this food item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="edit-name" className="text-sm font-medium">
              Food Name
            </label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chicken Breast"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="edit-protein" className="text-sm font-medium">
                Protein (g)
              </label>
              <Input
                id="edit-protein"
                type="number"
                min="0"
                step="0.1"
                value={protein}
                onChange={handleProteinChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-carbs" className="text-sm font-medium">
                Carbs (g)
              </label>
              <Input
                id="edit-carbs"
                type="number"
                min="0"
                step="0.1"
                value={carbs}
                onChange={handleCarbsChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-fat" className="text-sm font-medium">
                Fat (g)
              </label>
              <Input
                id="edit-fat"
                type="number"
                min="0"
                step="0.1"
                value={fat}
                onChange={handleFatChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-calories" className="text-sm font-medium">
                Calories
              </label>
              <Input
                id="edit-calories"
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
              <label htmlFor="edit-servingSize" className="text-sm font-medium">
                Serving Size
              </label>
              <Input
                id="edit-servingSize"
                type="number"
                min="0.1"
                step="0.1"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-servingUnit" className="text-sm font-medium">
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Food Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
