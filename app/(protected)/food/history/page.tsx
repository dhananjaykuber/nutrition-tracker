'use client';

import { WeeklySummary } from '@/components/food/weekly-summary';

export default function FoodHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Food History</h1>
      <WeeklySummary />
    </div>
  );
}
