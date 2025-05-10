'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { DailySummary } from '@/lib/types';
import { getWeeklySummaries } from '@/lib/food-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays, addDays } from 'date-fns';
import { formatNumber } from '@/lib/utils';

export function WeeklySummary() {
  const { user } = useAuth();

  const [startDate, setStartDate] = useState(subDays(new Date(), 6));
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSummaries = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const endDate = addDays(startDate, 6);
      const weekSummaries = await getWeeklySummaries(
        user.uid,
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );
      setSummaries(weekSummaries);
      setError('');
    } catch (err) {
      console.error('Error loading weekly summaries:', err);
      setError('Failed to load weekly summaries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSummaries();
  }, [user, startDate]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const days = direction === 'prev' ? -7 : 7;
    setStartDate((prevDate) => addDays(prevDate, days));
  };

  const totalCalories = summaries.reduce(
    (sum, day) => sum + day.totalCalories,
    0
  );
  const totalProtein = summaries.reduce(
    (sum, day) => sum + day.totalProtein,
    0
  );
  const totalCarbs = summaries.reduce((sum, day) => sum + day.totalCarbs, 0);
  const totalFat = summaries.reduce((sum, day) => sum + day.totalFat, 0);

  const avgCalories = totalCalories / 7;
  const avgProtein = totalProtein / 7;
  const avgCarbs = totalCarbs / 7;
  const avgFat = totalFat / 7;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 md:flex-row flex-col">
        <h2 className="text-xl font-semibold">
          Week of {format(startDate, 'MMM d')} -{' '}
          {format(addDays(startDate, 6), 'MMM d, yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button onClick={() => navigateWeek('prev')} variant="outline">
            Previous Week
          </Button>
          <Button onClick={() => navigateWeek('next')} variant="outline">
            Next Week
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500">
          {error}
          <Button variant="outline" onClick={loadSummaries} className="ml-4">
            Try Again
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Average Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(avgCalories, 0)}
            </div>
            <div className="text-sm text-gray-500">per day</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Average Protein
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(avgProtein)}g
            </div>
            <div className="text-sm text-gray-500">per day</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Average Carbs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(avgCarbs)}g</div>
            <div className="text-sm text-gray-500">per day</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Average Fat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(avgFat)}g</div>
            <div className="text-sm text-gray-500">per day</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 7 }, (_, index) => {
          const currentDate = addDays(startDate, index);
          const dateString = format(currentDate, 'yyyy-MM-dd');
          const daySummary = summaries.find((s) => s.date === dateString);

          return (
            <Card key={dateString} className={daySummary ? '' : 'opacity-75'}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {format(currentDate, 'EEEE, MMM d')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {daySummary ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Calories</p>
                      <p className="font-semibold">
                        {formatNumber(daySummary.totalCalories, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Protein</p>
                      <p className="font-semibold">
                        {formatNumber(daySummary.totalProtein)}g
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Carbs</p>
                      <p className="font-semibold">
                        {formatNumber(daySummary.totalCarbs)}g
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fat</p>
                      <p className="font-semibold">
                        {formatNumber(daySummary.totalFat)}g
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No entries recorded</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
