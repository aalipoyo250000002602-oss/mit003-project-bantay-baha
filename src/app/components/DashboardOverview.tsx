import { ContextualKPICards } from './ContextualKPICards';
import { WorldVehicleMap } from './WorldVehicleMap';
import { UpcomingBookings } from './UpcomingBookings';
import { RecentTrips } from './RecentTrips';
import { RevenueAnalytics } from './RevenueAnalytics';

export function DashboardOverview() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Monitor your global supply chain operations in real-time</p>
      </div>

      {/* Contextual KPI Cards - Dynamic and interconnected */}
      <ContextualKPICards />

      {/* World Map for Real-time Vehicle Tracking */}
      <WorldVehicleMap />

      {/* Bookings and Trips Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <UpcomingBookings />
        <RecentTrips />
      </div>

      {/* Revenue Analytics */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Analytics</h2>
        <RevenueAnalytics />
      </div>
    </div>
  );
}