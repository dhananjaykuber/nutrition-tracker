'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { DailySummary as DailySummaryType } from '@/lib/types';
import { getDailySummary, deleteFoodEntry } from '@/lib/food-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { calculateMacroPercentage, formatNumber } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export function DailySummary() {
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [summary, setSummary] = useState<DailySummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSummary = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const dailySummary = await getDailySummary(user.uid, dateString);
      setSummary(dailySummary);
      setError('');
    } catch (err) {
      console.error('Error loading daily summary:', err);
      setError('Failed to load daily summary');
      toast.error('Failed to load daily summary');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [user, selectedDate]);

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await deleteFoodEntry(id);
      toast.success('Food entry deleted successfully');
      // Reload summary after deletion
      loadSummary();
    } catch (err) {
      console.error('Error deleting food entry:', err);
      toast.error('Failed to delete food entry');
    }
  };

  const proteinCalories = summary ? summary.totalProtein * 4 : 0;
  const carbsCalories = summary ? summary.totalCarbs * 4 : 0;
  const fatCalories = summary ? summary.totalFat * 9 : 0;
  const totalCalories = summary ? summary.totalCalories : 0;

  const proteinPercentage = calculateMacroPercentage(
    proteinCalories,
    totalCalories
  );
  const carbsPercentage = calculateMacroPercentage(
    carbsCalories,
    totalCalories
  );
  const fatPercentage = calculateMacroPercentage(fatCalories, totalCalories);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setSelectedDate(newDate);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daily Summary</h2>
        <Input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={handleDateChange}
          className="w-auto"
        />
      </div>

      {error && (
        <div className="text-red-500">
          {error}
          <Button variant="outline" onClick={loadSummary} className="ml-4">
            Try Again
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              Total Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalCalories, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary?.totalProtein || 0)}g
            </div>
            <div className="text-sm text-gray-500">
              {formatNumber(proteinPercentage)}% (
              {formatNumber(proteinCalories, 0)} cal)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Carbs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary?.totalCarbs || 0)}g
            </div>
            <div className="text-sm text-gray-500">
              {formatNumber(carbsPercentage)}% ({formatNumber(carbsCalories, 0)}{' '}
              cal)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Fat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary?.totalFat || 0)}g
            </div>
            <div className="text-sm text-gray-500">
              {formatNumber(fatPercentage)}% ({formatNumber(fatCalories, 0)}{' '}
              cal)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Macro distribution visualization */}
      {totalCalories > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Macro Distribution</h3>
          <div className="h-6 flex rounded-full overflow-hidden">
            <div
              className="bg-blue-500"
              style={{ width: `${proteinPercentage}%` }}
              title={`Protein: ${formatNumber(proteinPercentage)}%`}
            />
            <div
              className="bg-green-500"
              style={{ width: `${carbsPercentage}%` }}
              title={`Carbs: ${formatNumber(carbsPercentage)}%`}
            />
            <div
              className="bg-yellow-500"
              style={{ width: `${fatPercentage}%` }}
              title={`Fat: ${formatNumber(fatPercentage)}%`}
            />
          </div>
          <div className="flex justify-between text-sm mt-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 mr-1 rounded-sm"></div>
              <span>Protein {formatNumber(proteinPercentage)}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
              <span>Carbs {formatNumber(carbsPercentage)}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 mr-1 rounded-sm"></div>
              <span>Fat {formatNumber(fatPercentage)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Food entries table */}
      {summary && summary.entries.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Food Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food</TableHead>
                  <TableHead className="text-right">Servings</TableHead>
                  <TableHead className="text-right">Protein</TableHead>
                  <TableHead className="text-right">Carbs</TableHead>
                  <TableHead className="text-right">Fat</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.foodItemName}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(entry.servings)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(entry.protein)}g
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(entry.carbs)}g
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(entry.fat)}g
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(entry.calories, 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
          No food entries for this day. Add some food entries to see your daily
          summary.
        </div>
      )}
    </div>
  );
}
