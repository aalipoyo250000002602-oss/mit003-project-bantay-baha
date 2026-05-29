import {
  Search,
  Truck,
  Route,
  Users,
  User,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Bell
} from 'lucide-react';

export const getSearchIcon = (type: string) => {
  switch (type) {
    case 'vehicle': return <Truck className="h-4 w-4 text-green-600" />;
    case 'driver': return <User className="h-4 w-4 text-blue-600" />;
    case 'trip': return <Package className="h-4 w-4 text-orange-600" />;
    case 'route': return <Route className="h-4 w-4 text-purple-600" />;
    case 'customer': return <Users className="h-4 w-4 text-teal-600" />;
    default: return <Search className="h-4 w-4" />;
  }
};

export const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning': return <Clock className="h-4 w-4 text-orange-500" />;
    default: return <Bell className="h-4 w-4 text-blue-500" />;
  }
};

export const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('');
};