import { DailySummary } from '@/components/food/daily-summary';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <DailySummary />
    </div>
  );
}
