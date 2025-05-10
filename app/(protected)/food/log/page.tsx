'use client';

import { useState } from 'react';
import { DailySummary } from '@/components/food/daily-summary';
import { FoodEntryForm } from '@/components/food/food-entry-form';

export default function AddFoodEntryPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    // Refresh the daily summary after successful addition
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Log Food</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FoodEntryForm onSuccess={handleSuccess} />
        <div key={refreshKey}>
          <DailySummary />
        </div>
      </div>
    </div>
  );
}
