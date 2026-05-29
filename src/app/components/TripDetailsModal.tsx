import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Package, 
  Truck, 
  User, 
  Calendar,
  Route,
  CheckCircle,
  AlertCircle,
  Plane,
  Ship,
  Navigation,
  Phone,
  Mail,
  FileText
} from 'lucide-react';

interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'In Transit': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Loading': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTransportIcon = (type: string) => {
  switch (type) {
    case 'road': return <Truck className="h-5 w-5 text-green-600" />;
    case 'air': return <Plane className="h-5 w-5 text-blue-600" />;
    case 'sea': return <Ship className="h-5 w-5 text-teal-600" />;
    default: return <Truck className="h-5 w-5" />;
  }
};

const getTimelineStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'current': return <Clock className="h-4 w-4 text-blue-500" />;
    case 'pending': return <Clock className="h-4 w-4 text-gray-400" />;
    default: return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

export function TripDetailsModal({ isOpen, onClose, trip }: TripDetailsModalProps) {
  if (!trip) return null;

  const completedSteps = trip.timeline?.filter((step: any) => step.status === 'completed').length || 0;
  const totalSteps = trip.timeline?.length || 0;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Trip Details - {trip.id}
            </DialogTitle>
            <Badge className={getStatusColor(trip.status)}>
              {trip.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Progress Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Trip Progress</span>
              <span className="text-sm text-muted-foreground">{completedSteps}/{totalSteps} completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trip Information */}
                <div className="space-y-4">
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Route className="h-4 w-4 text-blue-600" />
                      Trip Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trip ID:</span>
                        <span className="font-medium">{trip.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Customer:</span>
                        <span className="font-medium">{trip.customer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="font-medium">{trip.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{trip.estimatedDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span className="font-medium">{new Date(trip.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date:</span>
                        <span className="font-medium">{new Date(trip.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route Details */}
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      Route Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium text-sm">Origin</p>
                          <p className="text-xs text-muted-foreground">{trip.route.origin}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <div>
                          <p className="font-medium text-sm">Destination</p>
                          <p className="text-xs text-muted-foreground">{trip.route.destination}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                      Financial Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Revenue:</span>
                        <span className="font-medium text-green-600">{trip.revenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fuel Cost:</span>
                        <span className="font-medium text-red-600">{trip.fuelCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Profit:</span>
                        <span className="font-medium text-blue-600">
                          ${parseInt(trip.revenue.replace('$', '').replace(',', '')) - 
                             parseInt(trip.fuelCost.replace('$', '').replace(',', ''))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment & Cargo */}
                <div className="space-y-4">
                  {/* Vehicle Assignment */}
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      {getTransportIcon(trip.vehicle?.type)}
                      Vehicle Assignment
                    </h3>
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                      {getTransportIcon(trip.vehicle?.type)}
                      <div>
                        <p className="font-medium">{trip.vehicle?.name}</p>
                        <p className="text-sm text-muted-foreground">{trip.vehicle?.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Driver Assignment */}
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-indigo-600" />
                      Driver Assignment
                    </h3>
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={trip.driver?.photo} />
                        <AvatarFallback>
                          {trip.driver?.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{trip.driver?.name}</p>
                        <p className="text-sm text-muted-foreground">{trip.driver?.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cargo Details */}
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4 text-orange-600" />
                      Cargo Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{trip.material?.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="font-medium">{trip.material?.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{trip.material?.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Trip Timeline</h3>
                <div className="space-y-3">
                  {trip.timeline?.map((step: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                      {getTimelineStatusIcon(step.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${
                            step.status === 'current' ? 'text-blue-700' : 
                            step.status === 'completed' ? 'text-green-700' : 'text-muted-foreground'
                          }`}>
                            {step.step}
                          </p>
                          <span className="text-sm text-muted-foreground">{step.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {trip.status === 'In Transit' && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Current Location</span>
                    </div>
                    <p className="text-sm text-blue-700">En route to {trip.route.destination}</p>
                    <p className="text-xs text-blue-600 mt-1">ETA: 2 hours 15 minutes</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Trip Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Bill of Lading', type: 'PDF', size: '2.4 MB', status: 'Available' },
                    { name: 'Delivery Receipt', type: 'PDF', size: '1.2 MB', status: 'Pending' },
                    { name: 'Insurance Certificate', type: 'PDF', size: '800 KB', status: 'Available' },
                    { name: 'Custom Declaration', type: 'PDF', size: '1.1 MB', status: 'Available' }
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <Badge variant={doc.status === 'Available' ? 'default' : 'secondary'}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="communication" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Communication Log</h3>
                <div className="space-y-3">
                  {[
                    {
                      time: '2024-01-12 14:30',
                      type: 'phone',
                      contact: 'Driver Check-in',
                      message: 'Cargo loaded successfully, departing on schedule'
                    },
                    {
                      time: '2024-01-12 10:15',
                      type: 'email',
                      contact: 'Customer Notification',
                      message: 'Trip started, tracking information sent'
                    },
                    {
                      time: '2024-01-12 08:00',
                      type: 'system',
                      contact: 'System Alert',
                      message: 'Pre-trip inspection completed'
                    }
                  ].map((log, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg border">
                      <div className="p-2 bg-accent rounded-full">
                        {log.type === 'phone' && <Phone className="h-4 w-4" />}
                        {log.type === 'email' && <Mail className="h-4 w-4" />}
                        {log.type === 'system' && <AlertCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{log.contact}</span>
                          <span className="text-sm text-muted-foreground">{log.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button className="flex-1">
            Track Live
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}