import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Route, 
  Search, 
  Filter, 
  MapPin, 
  Calendar as CalendarIcon,
  Plus,
  Clock,
  DollarSign,
  User,
  Package,
  Truck,
  Plane,
  Ship,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye,
  TrendingUp,
  Navigation,
  MoreHorizontal,
  Trash2,
  Copy,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';

const routesData = [
  {
    id: 'RT001',
    name: 'NY-Boston Express',
    origin: { city: 'New York', state: 'NY', coords: [40.7128, -74.0060] },
    destination: { city: 'Boston', state: 'MA', coords: [42.3601, -71.0589] },
    distance: '215 miles',
    estimatedTime: '4h 30m',
    transportMode: 'road',
    status: 'Active',
    frequency: 'Daily',
    pricing: { baseRate: '$2.50/mile', fuelSurcharge: '15%' },
    activeBookings: 12,
    completedTrips: 342,
    avgRevenue: '$2,450',
    lastOptimized: '2024-01-08',
    efficiency: 94
  },
  {
    id: 'RT002',
    name: 'Chicago-Miami Air Route',
    origin: { city: 'Chicago', state: 'IL', coords: [41.8781, -87.6298] },
    destination: { city: 'Miami', state: 'FL', coords: [25.7617, -80.1918] },
    distance: '1,197 miles',
    estimatedTime: '3h 15m',
    transportMode: 'air',
    status: 'Active',
    frequency: 'Weekly',
    pricing: { baseRate: '$5.80/mile', fuelSurcharge: '12%' },
    activeBookings: 8,
    completedTrips: 89,
    avgRevenue: '$8,900',
    lastOptimized: '2024-01-05',
    efficiency: 97
  },
  {
    id: 'RT003',
    name: 'Seattle-Tokyo Ocean Route',
    origin: { city: 'Seattle', state: 'WA', coords: [47.6062, -122.3321] },
    destination: { city: 'Tokyo', state: 'Japan', coords: [35.6762, 139.6503] },
    distance: '4,792 miles',
    estimatedTime: '14 days',
    transportMode: 'sea',
    status: 'Seasonal',
    frequency: 'Monthly',
    pricing: { baseRate: '$1.20/mile', fuelSurcharge: '8%' },
    activeBookings: 3,
    completedTrips: 24,
    avgRevenue: '$15,600',
    lastOptimized: '2023-12-20',
    efficiency: 89
  }
];

const bookingsData = [
  {
    id: 'BK001',
    customer: {
      name: 'Acme Corporation',
      contact: 'John Smith',
      email: 'john@acme.com',
      phone: '+1 (555) 123-4567'
    },
    route: 'NY-Boston Express',
    routeId: 'RT001',
    shipmentDetails: {
      type: 'Electronics',
      weight: '15,000 lbs',
      dimensions: '8x6x6 ft',
      value: '$125,000'
    },
    pickupDate: '2024-01-15',
    deliveryDate: '2024-01-16',
    status: 'Confirmed',
    priority: 'High',
    revenue: '$2,450',
    specialRequirements: ['Temperature Control', 'Fragile Handling'],
    assignedVehicle: 'TRK-001',
    assignedDriver: 'Michael Johnson'
  },
  {
    id: 'BK002',
    customer: {
      name: 'MedSupply Inc',
      contact: 'Dr. Sarah Wilson',
      email: 'sarah@medsupply.com',
      phone: '+1 (555) 234-5678'
    },
    route: 'Chicago-Miami Air Route',
    routeId: 'RT002',
    shipmentDetails: {
      type: 'Medical Supplies',
      weight: '8,500 lbs',
      dimensions: '6x4x4 ft',
      value: '$85,000'
    },
    pickupDate: '2024-01-18',
    deliveryDate: '2024-01-18',
    status: 'Pending',
    priority: 'Urgent',
    revenue: '$8,900',
    specialRequirements: ['Biohazard Certified', 'Express Delivery'],
    assignedVehicle: 'AIR-102',
    assignedDriver: 'Captain Rodriguez'
  },
  {
    id: 'BK003',
    customer: {
      name: 'Global Exports Ltd',
      contact: 'David Chen',
      email: 'david@globalexports.com',
      phone: '+1 (555) 345-6789'
    },
    route: 'Seattle-Tokyo Ocean Route',
    routeId: 'RT003',
    shipmentDetails: {
      type: 'Machinery',
      weight: '45,000 lbs',
      dimensions: '20x8x8 ft',
      value: '$280,000'
    },
    pickupDate: '2024-01-25',
    deliveryDate: '2024-02-08',
    status: 'In Review',
    priority: 'Normal',
    revenue: '$15,600',
    specialRequirements: ['Heavy Lift', 'Customs Documentation'],
    assignedVehicle: 'SEA-301',
    assignedDriver: 'Captain Thompson'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'Seasonal': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    case 'Confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'In Review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    case 'Normal': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'Low': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const getTransportIcon = (mode: string) => {
  switch (mode) {
    case 'road': return <Truck className="h-4 w-4 text-green-600" />;
    case 'air': return <Plane className="h-4 w-4 text-blue-600" />;
    case 'sea': return <Ship className="h-4 w-4 text-teal-600" />;
    default: return <Route className="h-4 w-4" />;
  }
};

interface RoutesModuleProps {
  onOpenCreateTrip?: () => void;
  onOpenRouteOptimization?: () => void;
  onOpenAnalytics?: () => void;
  onOpenAlerts?: () => void;
  onOpenGenerateReport?: () => void;
  onNavigateToModule?: (module: string) => void;
}

export function RoutesModule({ onOpenRouteOptimization }: RoutesModuleProps) {
  const [selectedRoute, setSelectedRoute] = useState(routesData[0]);
  const [selectedBooking, setSelectedBooking] = useState(bookingsData[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('routes');
  const [routeDetailsOpen, setRouteDetailsOpen] = useState(false);
  const [editRouteOpen, setEditRouteOpen] = useState(false);
  const [selectedRouteForAction, setSelectedRouteForAction] = useState<any>(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<any>(null);

  const filteredRoutes = routesData.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookingsData.filter(booking =>
    booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRouteAction = (action: string, route: any) => {
    setSelectedRouteForAction(route);
    console.log(`${action} action for route:`, route.id);
    
    switch (action) {
      case 'view':
        setRouteDetailsOpen(true);
        break;
      case 'edit':
        setEditRouteOpen(true);
        break;
      case 'duplicate':
        console.log('Duplicating route:', route.id);
        break;
      case 'optimize':
        console.log('Optimizing route:', route.id);
        onOpenRouteOptimization?.();
        break;
      case 'delete':
        console.log('Deleting route:', route.id);
        break;
      default:
        break;
    }
  };

  const handleBookingAction = (action: string, booking: any) => {
    setSelectedBookingForAction(booking);
    console.log(`${action} action for booking:`, booking.id);
    
    switch (action) {
      case 'view':
        setBookingDetailsOpen(true);
        break;
      case 'approve':
        console.log('Approving booking:', booking.id);
        break;
      case 'reject':
        console.log('Rejecting booking:', booking.id);
        break;
      case 'modify':
        console.log('Modifying booking:', booking.id);
        break;
      case 'cancel':
        console.log('Cancelling booking:', booking.id);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Route className="h-6 w-6 text-orange-600" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Routes & Bookings</h1>
            <p className="text-muted-foreground">Manage routes, optimize paths, and handle customer bookings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={onOpenRouteOptimization}>
            <Navigation className="h-4 w-4" />
            Optimize Routes
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Route
          </Button>
        </div>
      </div>

      {/* Quick Stats - Reduced dimensions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3 border-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-muted-foreground">Active Routes</span>
          </div>
          <p className="text-xl font-semibold mt-1">24</p>
        </Card>
        <Card className="p-3 border-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Pending Bookings</span>
          </div>
          <p className="text-xl font-semibold mt-1">18</p>
        </Card>
        <Card className="p-3 border-0 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Route Efficiency</span>
          </div>
          <p className="text-xl font-semibold mt-1">94.2%</p>
        </Card>
        <Card className="p-3 border-0 shadow-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-muted-foreground">Booking Revenue</span>
          </div>
          <p className="text-xl font-semibold mt-1">$127K</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="routes">Routes Management</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="optimization">Route Optimization</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        <TabsContent value="routes" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Routes List */}
            <div className="xl:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Route Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Path</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Efficiency</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoutes.map((route) => (
                        <TableRow 
                          key={route.id}
                          className={`cursor-pointer hover:bg-accent/50 ${selectedRoute.id === route.id ? 'bg-orange-50 dark:bg-orange-950/20' : ''}`}
                          onClick={() => setSelectedRoute(route)}
                        >
                          <TableCell className="font-medium">{route.name}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{route.origin.city}, {route.origin.state} →</div>
                              <div className="text-muted-foreground">{route.destination.city}, {route.destination.state}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTransportIcon(route.transportMode)}
                              <span className="text-sm capitalize">{route.transportMode}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(route.status)}>
                              {route.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{route.efficiency}%</span>
                              <div className={`h-2 w-8 rounded-full ${route.efficiency >= 95 ? 'bg-green-200' : route.efficiency >= 90 ? 'bg-yellow-200' : 'bg-red-200'}`}>
                                <div 
                                  className={`h-2 rounded-full ${route.efficiency >= 95 ? 'bg-green-500' : route.efficiency >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${route.efficiency}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">{route.avgRevenue}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleRouteAction('view', route)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRouteAction('edit', route)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Route
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRouteAction('duplicate', route)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleRouteAction('optimize', route)}>
                                  <Navigation className="mr-2 h-4 w-4" />
                                  Optimize
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRouteAction('settings', route)}>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleRouteAction('delete', route)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Route Details */}
            <div>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Route Details</span>
                    <Badge className={getStatusColor(selectedRoute.status)}>
                      {selectedRoute.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Route Info */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">{selectedRoute.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Route ID:</span>
                          <span className="font-medium">{selectedRoute.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Distance:</span>
                          <span className="font-medium">{selectedRoute.distance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. Time:</span>
                          <span className="font-medium">{selectedRoute.estimatedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frequency:</span>
                          <span className="font-medium">{selectedRoute.frequency}</span>
                        </div>
                      </div>
                    </div>

                    {/* Route Points */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Route Path</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-300">Origin</p>
                            <p className="text-sm text-green-600 dark:text-green-400">{selectedRoute.origin.city}, {selectedRoute.origin.state}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
                          <MapPin className="h-4 w-4 text-red-600" />
                          <div>
                            <p className="font-medium text-red-800 dark:text-red-300">Destination</p>
                            <p className="text-sm text-red-600 dark:text-red-400">{selectedRoute.destination.city}, {selectedRoute.destination.state}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Performance Metrics</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-accent/30 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Active Bookings</p>
                          <p className="text-lg font-semibold">{selectedRoute.activeBookings}</p>
                        </div>
                        <div className="bg-accent/30 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Completed</p>
                          <p className="text-lg font-semibold">{selectedRoute.completedTrips}</p>
                        </div>
                        <div className="bg-accent/30 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Efficiency</p>
                          <p className="text-lg font-semibold text-green-600">{selectedRoute.efficiency}%</p>
                        </div>
                        <div className="bg-accent/30 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Avg Revenue</p>
                          <p className="text-lg font-semibold text-green-600">{selectedRoute.avgRevenue}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Pricing Structure</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base Rate:</span>
                          <span className="font-medium">{selectedRoute.pricing.baseRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fuel Surcharge:</span>
                          <span className="font-medium">{selectedRoute.pricing.fuelSurcharge}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Bookings List */}
            <div className="xl:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Customer Bookings</CardTitle>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      <Plus className="h-4 w-4 mr-1" />
                      New Booking
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow 
                          key={booking.id}
                          className={`cursor-pointer hover:bg-accent/50 ${selectedBooking.id === booking.id ? 'bg-orange-50 dark:bg-orange-950/20' : ''}`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.customer.name}</p>
                              <p className="text-sm text-muted-foreground">{booking.customer.contact}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{booking.route}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>Pickup: {booking.pickupDate}</div>
                              <div className="text-muted-foreground">Delivery: {booking.deliveryDate}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(booking.priority)}>
                              {booking.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">{booking.revenue}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleBookingAction('view', booking)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {booking.status === 'Pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleBookingAction('approve', booking)}>
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleBookingAction('reject', booking)}>
                                      <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem onClick={() => handleBookingAction('modify', booking)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modify
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleBookingAction('download', booking)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download PDF
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleBookingAction('cancel', booking)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Booking Details */}
            <div>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Booking Details</span>
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Customer Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Company:</span>
                          <span className="font-medium">{selectedBooking.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contact:</span>
                          <span className="font-medium">{selectedBooking.customer.contact}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium">{selectedBooking.customer.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">{selectedBooking.customer.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipment Details */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Shipment Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{selectedBooking.shipmentDetails.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="font-medium">{selectedBooking.shipmentDetails.weight}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dimensions:</span>
                          <span className="font-medium">{selectedBooking.shipmentDetails.dimensions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Value:</span>
                          <span className="font-medium text-green-600">{selectedBooking.shipmentDetails.value}</span>
                        </div>
                      </div>
                    </div>

                    {/* Special Requirements */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Special Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedBooking.specialRequirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Assignment */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Assignment</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vehicle:</span>
                          <span className="font-medium">{selectedBooking.assignedVehicle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Driver:</span>
                          <span className="font-medium">{selectedBooking.assignedDriver}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial */}
                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800 dark:text-green-300">Revenue</span>
                      </div>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">{selectedBooking.revenue}</p>
                      <p className="text-sm text-green-600 dark:text-green-500 mt-1">Priority: {selectedBooking.priority}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-orange-600" />
                Route Optimization Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Route Optimization Tools</h3>
                <p className="text-muted-foreground mb-6">Advanced algorithms to optimize your delivery routes for maximum efficiency</p>
                <Button 
                  onClick={onOpenRouteOptimization}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Launch Optimization Tool
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Route Details Modal */}
      <Dialog open={routeDetailsOpen} onOpenChange={setRouteDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Route Details - {selectedRouteForAction?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Detailed route information and analytics would be displayed here.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Route Modal */}
      <Dialog open={editRouteOpen} onOpenChange={setEditRouteOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Route - {selectedRouteForAction?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="routeName">Route Name</Label>
              <Input id="routeName" defaultValue={selectedRouteForAction?.name} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input id="origin" defaultValue={`${selectedRouteForAction?.origin.city}, ${selectedRouteForAction?.origin.state}`} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" defaultValue={`${selectedRouteForAction?.destination.city}, ${selectedRouteForAction?.destination.state}`} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Add any special notes or requirements..." />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditRouteOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Details Modal */}
      <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details - {selectedBookingForAction?.id}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Comprehensive booking information and management options would be displayed here.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}