import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GoogleMapsTracker } from './GoogleMapsTracker';
import { UpcomingBookings } from './UpcomingBookings';
import { RecentTrips } from './RecentTrips';
import { RevenueAnalytics } from './RevenueAnalytics';
import { TimePeriodModal } from './TimePeriodModal';
import { FiltersModal } from './FiltersModal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Truck,
  Users,
  Package,
  DollarSign,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Fuel,
  Target,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Plus
} from 'lucide-react';

interface EnhancedDashboardProps {
  onOpenCreateTrip?: () => void;
  onOpenRouteOptimization?: () => void;
  onOpenAnalytics?: () => void;
  onOpenAlerts?: () => void;
  onOpenGenerateReport?: () => void;
  onNavigateToModule?: (module: string) => void;
}

// Real-time data simulation
const useRealTimeData = () => {
  const [data, setData] = useState({
    activeVehicles: 247,
    tripsInProgress: 42,
    monthlyRevenue: 892500,
    upcomingBookings: 18,
    fuelEfficiency: 8.2,
    onTimeDelivery: 94.5,
    driverUtilization: 87.3,
    maintenanceAlerts: 5
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        activeVehicles: prev.activeVehicles + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3),
        tripsInProgress: Math.max(20, prev.tripsInProgress + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)),
        monthlyRevenue: prev.monthlyRevenue + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 1000),
        fuelEfficiency: Math.max(6, Math.min(12, prev.fuelEfficiency + (Math.random() - 0.5) * 0.1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return data;
};

const revenueData = [
  { month: 'Jan', revenue: 185000, profit: 46250, trips: 156 },
  { month: 'Feb', revenue: 192000, profit: 48000, trips: 168 },
  { month: 'Mar', revenue: 205000, profit: 51250, trips: 189 },
  { month: 'Apr', revenue: 198000, profit: 49500, trips: 172 },
  { month: 'May', revenue: 212000, profit: 53000, trips: 195 },
  { month: 'Jun', revenue: 225000, profit: 56250, trips: 208 },
  { month: 'Jul', revenue: 238000, profit: 59500, trips: 219 },
  { month: 'Aug', revenue: 245000, profit: 61250, trips: 225 },
  { month: 'Sep', revenue: 252000, profit: 63000, trips: 231 },
  { month: 'Oct', revenue: 268000, profit: 67000, trips: 247 },
  { month: 'Nov', revenue: 275000, profit: 68750, trips: 253 },
  { month: 'Dec', revenue: 295000, profit: 73750, trips: 269 }
];

const transportModeData = [
  { name: 'Road Transport', value: 45, revenue: 450000, color: '#10b981' },
  { name: 'Air Transport', value: 30, revenue: 380000, color: '#3b82f6' },
  { name: 'Sea Transport', value: 20, revenue: 280000, color: '#0d9488' },
  { name: 'Rail Transport', value: 5, revenue: 90000, color: '#f59e0b' }
];

const performanceData = [
  { metric: 'On-Time Delivery', current: 94.5, target: 95, trend: 'up' },
  { metric: 'Fuel Efficiency', current: 8.2, target: 8.5, trend: 'up' },
  { metric: 'Vehicle Utilization', current: 87.3, target: 90, trend: 'down' },
  { metric: 'Customer Satisfaction', current: 92.1, target: 95, trend: 'up' }
];

const upcomingTrips = [
  {
    id: 'TR-001',
    route: 'NY → Boston',
    driver: 'Michael Johnson',
    vehicle: 'TRK-001',
    departure: '08:30 AM',
    cargo: 'Electronics',
    priority: 'High',
    status: 'Ready'
  },
  {
    id: 'TR-002',
    route: 'LA → Seattle',
    driver: 'Sarah Wilson',
    vehicle: 'TRK-105',
    departure: '09:15 AM',
    cargo: 'Medical Supplies',
    priority: 'Urgent',
    status: 'Loading'
  },
  {
    id: 'TR-003',
    route: 'Chicago → Miami',
    driver: 'Carlos Rodriguez',
    vehicle: 'AIR-202',
    departure: '10:00 AM',
    cargo: 'Fresh Produce',
    priority: 'Medium',
    status: 'Scheduled'
  }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Urgent': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300';
    case 'High': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300';
    case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300';
    case 'Low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
  }
};

export function EnhancedDashboard({
  onOpenCreateTrip,
  onOpenRouteOptimization,
  onOpenAnalytics,
  onOpenAlerts,
  onOpenGenerateReport,
  onNavigateToModule
}: EnhancedDashboardProps) {
  const realTimeData = useRealTimeData();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timePeriodModalOpen, setTimePeriodModalOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Trigger report generation modal
      onOpenGenerateReport?.();
    }, 1500);
  };

  const handleTimePeriodSelect = (period: string) => {
    setSelectedTimeRange(period);
    // Here you would typically refresh data based on the selected period
    console.log('Selected time period:', period);
  };

  const handleFiltersApply = (filters: any) => {
    console.log('Applied filters:', filters);
    // Here you would apply the filters to your data
  };

  const getTimePeriodLabel = (period: string) => {
    switch (period) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 1 month';
      case '3m': return 'Last 3 months';
      case '6m': return 'Last 6 months';
      case '1y': return 'Last 1 year';
      case 'ytd': return 'Year to date';
      default: return 'Last 7 days';
    }
  };

  const kpiCards = [
    {
      title: 'Active Fleet',
      value: realTimeData.activeVehicles,
      change: '+8',
      changePercent: 3.3,
      icon: Truck,
      color: 'blue',
      description: 'vehicles operational',
      onClick: () => onNavigateToModule?.('vehicles')
    },
    {
      title: 'Active Trips',
      value: realTimeData.tripsInProgress,
      change: '+5',
      changePercent: 13.5,
      icon: Package,
      color: 'green',
      description: 'in progress now',
      onClick: () => onNavigateToModule?.('transports')
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(realTimeData.monthlyRevenue),
      change: formatCurrency(45200),
      changePercent: 5.3,
      icon: DollarSign,
      color: 'emerald',
      description: 'vs last month',
      onClick: () => onNavigateToModule?.('revenue')
    },
    {
      title: 'Available Drivers',
      value: 156,
      change: '+12',
      changePercent: 8.3,
      icon: Users,
      color: 'purple',
      description: 'ready for dispatch',
      onClick: () => onNavigateToModule?.('drivers')
    },
    {
      title: 'Pending Bookings',
      value: realTimeData.upcomingBookings,
      change: '+3',
      changePercent: 20.0,
      icon: MapPin,
      color: 'orange',
      description: 'awaiting confirmation',
      onClick: () => onNavigateToModule?.('routes')
    },
    {
      title: 'Fuel Efficiency',
      value: `${realTimeData.fuelEfficiency.toFixed(1)} MPG`,
      change: '+0.3',
      changePercent: 3.8,
      icon: Fuel,
      color: 'indigo',
      description: 'fleet average'
    },
    {
      title: 'On-Time Rate',
      value: `${realTimeData.onTimeDelivery.toFixed(1)}%`,
      change: '+2.1%',
      changePercent: 2.3,
      icon: Target,
      color: 'teal',
      description: 'delivery performance'
    },
    {
      title: 'Maintenance Alerts',
      value: realTimeData.maintenanceAlerts,
      change: '-2',
      changePercent: -28.6,
      icon: AlertTriangle,
      color: 'red',
      description: 'requiring attention',
      onClick: () => onOpenAlerts?.()
    }
  ];

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      emerald: 'bg-emerald-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      indigo: 'bg-indigo-500',
      teal: 'bg-teal-500',
      red: 'bg-red-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Flood Surveillance System
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-accent"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-accent"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className={`h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      {/* KPI Cards - Reduced dimensions */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {kpiCards.map((kpi, index) => (
          <Card 
            key={index} 
            className={`relative overflow-hidden hover:shadow-lg transition-all duration-200 group border-0 shadow-sm ${
              kpi.onClick ? 'cursor-pointer' : ''
            }`}
            onClick={kpi.onClick}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className={`h-7 w-7 rounded-lg ${getIconColor(kpi.color)} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  {kpi.changePercent > 0 ? (
                    <ArrowUp className="h-2.5 w-2.5 text-green-500" />
                  ) : (
                    <ArrowDown className="h-2.5 w-2.5 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    kpi.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(kpi.changePercent).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-foreground group-hover:text-blue-600 transition-colors">
                  {typeof kpi.value === 'string' ? kpi.value : kpi.value.toLocaleString()}
                </h3>
                <p className="text-xs font-medium text-foreground">{kpi.title}</p>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </div>

              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Change</span>
                  <span className={`font-medium ${
                    kpi.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
                <Progress 
                  value={Math.abs(kpi.changePercent) * 2} 
                  className="h-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Google Maps - Full Width */}
      <GoogleMapsTracker />

      {/* Bookings and Trips Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Upcoming Trips
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigateToModule?.('transports')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTrips.map((trip, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{trip.route}</h4>
                        <Badge className={getPriorityColor(trip.priority)}>
                          {trip.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {trip.driver} • {trip.vehicle} • {trip.cargo}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{trip.departure}</p>
                    <Badge variant="outline" className="text-xs">
                      {trip.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((metric, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className="text-sm font-semibold">
                        {metric.current}
                        {metric.metric.includes('%') ? '' : metric.metric.includes('MPG') ? ' MPG' : '%'}
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={(metric.current / metric.target) * 100}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Current</span>
                    <span>Target: {metric.target}{metric.metric.includes('%') ? '' : metric.metric.includes('MPG') ? ' MPG' : '%'}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2">
          <Card className="h-96">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Revenue & Performance Trends
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onOpenAnalytics}
                >
                  View Details
                </Button>
                <Button variant="outline" size="sm">7D</Button>
                <Button variant="outline" size="sm" className="bg-accent">30D</Button>
                <Button variant="outline" size="sm">90D</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <CartesianGrid key="grid-revenue" strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    key="xaxis-revenue"
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    key="yaxis-revenue"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    key="tooltip-revenue"
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : formatCurrency(value),
                      name === 'revenue' ? 'Revenue' : 'Profit'
                    ]}
                  />
                  <Area
                    key="area-revenue"
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    key="area-profit"
                    type="monotone"
                    dataKey="profit"
                    stackId="1"
                    stroke="#10b981"
                    fill="url(#colorProfit)"
                  />
                  <defs>
                    <linearGradient key="gradient-revenue" id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop key="stop-revenue-start" offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop key="stop-revenue-end" offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient key="gradient-profit" id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop key="stop-profit-start" offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop key="stop-profit-end" offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Transport Mode Distribution */}
        <Card className="h-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Transport Modes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  key="pie-transport-mode"
                  data={transportModeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {transportModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  key="tooltip-transport-mode"
                  formatter={(value: any, name: string, props: any) => [
                    `${value}%`,
                    formatCurrency(props.payload.revenue)
                  ]}
                  labelFormatter={(label) => label}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2 mt-4">
              {transportModeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.value}%</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <TimePeriodModal
        isOpen={timePeriodModalOpen}
        onClose={() => setTimePeriodModalOpen(false)}
        onSelect={handleTimePeriodSelect}
        currentPeriod={selectedTimeRange}
      />

      <FiltersModal
        isOpen={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        onApply={handleFiltersApply}
      />
    </div>
  );
}