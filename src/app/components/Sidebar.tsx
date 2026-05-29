import { 
  LayoutDashboard, 
  Truck, 
  Car, 
  Users, 
  Route, 
  DollarSign, 
  Settings, 
  ChevronLeft,
  Plane,
  Ship
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transports', label: 'Transports / Trips', icon: Truck, badge: '12' },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
  { id: 'drivers', label: 'Drivers', icon: Users },
  { id: 'routes', label: 'Routes & Bookings', icon: Route, badge: '5' },
  { id: 'revenue', label: 'Revenue & Reports', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ collapsed, onCollapse, activeModule, onModuleChange }: SidebarProps) {
  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Collapse Toggle */}
      <div className="p-4 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className="h-8 w-8"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 pb-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeModule === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10",
                collapsed ? "px-0" : "px-3",
                activeModule === item.id && "bg-blue-50 text-blue-700 border-blue-200"
              )}
              onClick={() => onModuleChange(item.id)}
            >
              <item.icon className={cn(
                "h-4 w-4",
                collapsed ? "mx-auto" : "mr-3"
              )} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </div>

        {!collapsed && (
          <div className="mt-8 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Transport Modes</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Road</span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">Air</span>
              </div>
              <div className="flex items-center gap-2">
                <Ship className="h-4 w-4 text-teal-600" />
                <span className="text-gray-700">Sea</span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}