'use client';

import { FoodItemForm } from '@/components/food/food-item-form';
import { FoodList } from '@/components/food/food-list';
import { useState } from 'react';

export default function AddFoodItemPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Food Items</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FoodItemForm onSuccess={handleSuccess} />
        <div key={refreshKey}>
          <FoodList />
        </div>
      </div>
    </div>
  );
}
