import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  Waves,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  activeModule: string;
  onModuleChange: (module: string) => void;
  onOpenRouteOptimization?: () => void;
  onOpenAnalytics?: () => void;
  onOpenAlerts?: () => void;
  onOpenGenerateReport?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    variant: 'default' | 'destructive' | 'outline' | 'secondary';
    animate?: boolean;
  };
  notifications?: number;
  submenu?: MenuItem[];
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'vehicles',
    label: 'Analysis',
    icon: BarChart3,
    description: 'Data analysis and monitoring'
  },
  {
    id: 'transports',
    label: 'Reports',
    icon: Waves,
    description: 'View saved analysis reports'
  }
];

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
}

export function EnhancedSidebar({ 
  collapsed, 
  onCollapse, 
  activeModule, 
  onModuleChange,
  onOpenRouteOptimization,
  onOpenAnalytics,
  onOpenAlerts,
  onOpenGenerateReport
}: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const quickActions: QuickAction[] = [
    { 
      id: 'optimize', 
      label: 'Optimize Routes', 
      icon: Zap, 
      color: 'text-orange-500',
      onClick: () => onOpenRouteOptimization?.()
    },
    { 
      id: 'analytics', 
      label: 'View Analytics', 
      icon: TrendingUp, 
      color: 'text-blue-500',
      onClick: () => onOpenAnalytics?.()
    },
    { 
      id: 'alerts', 
      label: 'Check Alerts', 
      icon: AlertCircle, 
      color: 'text-red-500',
      onClick: () => onOpenAlerts?.()
    },
    { 
      id: 'reports', 
      label: 'Generate Report', 
      icon: CheckCircle2, 
      color: 'text-green-500',
      onClick: () => onOpenGenerateReport?.()
    }
  ];

  const MenuItem = ({ item }: { item: MenuItem }) => {
    const isActive = activeModule === item.id;
    
    const menuButton = (
      <Button
        variant={isActive ? 'default' : 'ghost'}
        className={`w-full justify-start h-11 px-3 mb-1 transition-all duration-200 ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'hover:bg-accent hover:text-accent-foreground hover:translate-x-1'
        } ${collapsed ? 'px-0 justify-center' : ''}`}
        onClick={() => onModuleChange(item.id)}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <item.icon className={`h-5 w-5 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
        
        {!collapsed && (
          <>
            <span className="flex-1 text-left font-medium">{item.label}</span>
            
            <div className="flex items-center gap-2">
              {item.notifications && item.notifications > 0 && (
                <Badge 
                  className={`h-5 w-5 flex items-center justify-center p-0 text-xs ${
                    item.notifications > 99 ? 'px-1' : ''
                  }`}
                  variant="destructive"
                >
                  {item.notifications > 99 ? '99+' : item.notifications}
                </Badge>
              )}
              
              {item.badge && (
                <Badge 
                  variant={item.badge.variant} 
                  className={`text-xs font-medium ${item.badge.animate ? 'animate-pulse' : ''}`}
                >
                  {item.badge.text}
                </Badge>
              )}
            </div>
          </>
        )}
      </Button>
    );

    if (collapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {menuButton}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-popover border-border">
              <div className="flex flex-col gap-1">
                <p className="font-medium">{item.label}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                )}
                {item.notifications && item.notifications > 0 && (
                  <Badge variant="destructive" className="text-xs self-start">
                    {item.notifications} new
                  </Badge>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return menuButton;
  };

  return (
    <aside className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col ${
      collapsed ? 'w-16' : 'w-72'
    }`}>
      {/* Sidebar Header */}
      <div className={`p-4 border-b border-sidebar-border ${collapsed ? 'px-2' : ''}`}>
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Navigation</h2>
              <p className="text-xs text-sidebar-foreground/60">Manage your operations</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onCollapse}
            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </nav>

      {/* Sidebar Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-accent/50 rounded-lg p-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-sidebar-foreground">System Status</span>
            </div>
            <p className="text-xs text-sidebar-foreground/60">All systems operational</p>
            <div className="mt-2 text-xs text-sidebar-foreground/60">
              Last update: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}