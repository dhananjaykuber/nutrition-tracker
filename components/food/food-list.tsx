'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { FoodItem } from '@/lib/types';
import { getFoodItems, deleteFoodItem } from '@/lib/food-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber } from '@/lib/utils';

export function FoodList() {
  const { user } = useAuth();

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFoodItems = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const items = await getFoodItems(user.uid);
      setFoodItems(items);
      setError('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Failed to load food items');
      } else {
        setError('An unknown error occurred');
      }
      console.error('Error loading food items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food item?')) {
      return;
    }

    try {
      await deleteFoodItem(id);
      setFoodItems((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting food item:', err);
      setError('Failed to delete food item');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
        <Button variant="outline" onClick={loadFoodItems} className="ml-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (foodItems.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No food items found. Add some food items to get started.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Food Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Protein (g)</TableHead>
              <TableHead className="text-right">Carbs (g)</TableHead>
              <TableHead className="text-right">Fat (g)</TableHead>
              <TableHead className="text-right">Calories</TableHead>
              <TableHead className="text-right">Serving</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foodItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">
                  {formatNumber(item.protein)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(item.carbs)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(item.fat)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(item.calories, 0)}
                </TableCell>
                <TableCell className="text-right">
                  {item.servingSize} {item.servingUnit}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
