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
  Target,
  MapPin,
  Fuel
} from 'lucide-react';

// Contextual data that changes based on real-time conditions
const getContextualKPIs = () => {
  const currentHour = new Date().getHours();
  const isBusinessHours = currentHour >= 8 && currentHour <= 18;
  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  return [
    {
      title: 'Active Fleet',
      value: isBusinessHours ? '247' : '156',
      change: isBusinessHours ? '+12' : '+8',
      changeType: 'increase',
      icon: Truck,
      color: 'blue',
      subtitle: isBusinessHours ? 'Peak Hours' : 'Off Hours',
      context: isBusinessHours ? 'Business hours - full fleet active' : 'Reduced operations'
    },
    {
      title: 'Real-time Trips',
      value: isBusinessHours ? '42' : '18',
      change: isWeekend ? '-15%' : '+8%',
      changeType: isWeekend ? 'decrease' : 'increase',
      icon: MapPin,
      color: 'green',
      subtitle: 'In Progress',
      context: isWeekend ? 'Weekend schedule' : 'Active deliveries'
    },
    {
      title: 'Today\'s Revenue',
      value: isBusinessHours ? '$89.2K' : '$124.5K',
      change: '+12.3%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'emerald',
      subtitle: isBusinessHours ? 'Real-time' : 'Day Total',
      context: isBusinessHours ? 'Accumulating...' : 'Target exceeded'
    },
    {
      title: 'Available Drivers',
      value: isBusinessHours ? '156' : '89',
      change: isBusinessHours ? '+5' : '-12',
      changeType: isBusinessHours ? 'increase' : 'decrease',
      icon: Users,
      color: 'purple',
      subtitle: 'On Duty',
      context: isBusinessHours ? 'Full staff' : 'Night shift'
    },
    {
      title: 'Urgent Deliveries',
      value: isBusinessHours ? '8' : '3',
      change: isBusinessHours ? '+2' : '-5',
      changeType: isBusinessHours ? 'increase' : 'decrease',
      icon: AlertTriangle,
      color: 'orange',
      subtitle: 'Priority',
      context: isBusinessHours ? 'Peak demand' : 'Reduced urgency'
    },
    {
      title: 'Fuel Efficiency',
      value: '8.2 MPG',
      change: '+0.4',
      changeType: 'increase',
      icon: Fuel,
      color: 'indigo',
      subtitle: 'Fleet Average',
      context: 'Optimized routes active'
    },
    {
      title: 'Avg Response Time',
      value: isBusinessHours ? '12min' : '18min',
      change: isBusinessHours ? '-3min' : '+5min',
      changeType: isBusinessHours ? 'decrease' : 'increase',
      icon: Clock,
      color: 'teal',
      subtitle: 'Pickup ETA',
      context: isBusinessHours ? 'Rush hour traffic' : 'Clear roads'
    },
    {
      title: 'Daily Target',
      value: '78.4%',
      change: '+5.2%',
      changeType: 'increase',
      icon: Target,
      color: 'pink',
      subtitle: 'Progress',
      context: isBusinessHours ? 'On track' : 'Ahead of schedule'
    }
  ];
};

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  indigo: 'bg-indigo-500',
  teal: 'bg-teal-500',
  pink: 'bg-pink-500',
};

export function ContextualKPICards() {
  const kpiData = getContextualKPIs();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
      {kpiData.map((kpi, index) => (
        <Card 
          key={index} 
          className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`h-6 w-6 rounded-lg flex items-center justify-center ${colorClasses[kpi.color]} group-hover:scale-110 transition-transform`}>
                <kpi.icon className="h-3 w-3 text-white" />
              </div>
              <div className="flex items-center">
                {kpi.changeType === 'increase' ? (
                  <ArrowUp className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ml-1 font-medium ${
                  kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {kpi.value}
              </p>
              <p className="text-xs text-gray-600 font-medium">{kpi.title}</p>
              <p className="text-xs text-gray-400">{kpi.subtitle}</p>
              
              {/* Contextual indicator */}
              <div className="pt-1">
                <div className={`h-1 w-full rounded-full overflow-hidden ${
                  kpi.changeType === 'increase' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      kpi.changeType === 'increase' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: kpi.changeType === 'increase' ? '75%' : '45%',
                      animation: 'pulse 2s infinite'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}