import { Card, CardContent } from './ui/card';
import { 
  Truck, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ArrowUp, 
  ArrowDown,
  Users,
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react';

const kpiData = [
  {
    title: 'Active Vehicles',
    value: '247',
    change: '+12',
    changeType: 'increase',
    icon: Truck,
    color: 'blue',
    subtitle: 'Fleet Size'
  },
  {
    title: 'In Transit',
    value: '18',
    change: '+3',
    changeType: 'increase',
    icon: TrendingUp,
    color: 'green',
    subtitle: 'Active Trips'
  },
  {
    title: 'Monthly Revenue',
    value: '$1.2M',
    change: '+8.2%',
    changeType: 'increase',
    icon: DollarSign,
    color: 'emerald',
    subtitle: 'This Month'
  },
  {
    title: 'Active Drivers',
    value: '156',
    change: '+5',
    changeType: 'increase',
    icon: Users,
    color: 'purple',
    subtitle: 'Available Now'
  },
  {
    title: 'Pending Bookings',
    value: '34',
    change: '-2',
    changeType: 'decrease',
    icon: Calendar,
    color: 'orange',
    subtitle: 'Awaiting Confirm'
  },
  {
    title: 'Maintenance Due',
    value: '8',
    change: '+1',
    changeType: 'increase',
    icon: AlertTriangle,
    color: 'red',
    subtitle: 'Requires Attention'
  },
  {
    title: 'Avg Delivery Time',
    value: '4.2h',
    change: '-12min',
    changeType: 'decrease',
    icon: Clock,
    color: 'indigo',
    subtitle: 'Performance'
  },
  {
    title: 'On-Time Delivery',
    value: '94.8%',
    change: '+2.1%',
    changeType: 'increase',
    icon: Target,
    color: 'teal',
    subtitle: 'Success Rate'
  },
];

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  indigo: 'bg-indigo-500',
  teal: 'bg-teal-500',
};

export function KPICards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
      {kpiData.map((kpi, index) => (
        <Card key={index} className="border-0 shadow-sm bg-card hover:shadow-md transition-all duration-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className={`h-5 w-5 rounded flex items-center justify-center ${colorClasses[kpi.color]}`}>
                <kpi.icon className="h-2.5 w-2.5 text-white" />
              </div>
              <div className="flex items-center">
                {kpi.changeType === 'increase' ? (
                  <ArrowUp className="h-2.5 w-2.5 text-green-500" />
                ) : (
                  <ArrowDown className="h-2.5 w-2.5 text-red-500" />
                )}
                <span className={`text-xs ml-1 ${
                  kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-lg font-semibold text-foreground">{kpi.value}</p>
              <p className="text-xs text-foreground">{kpi.title}</p>
              <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}