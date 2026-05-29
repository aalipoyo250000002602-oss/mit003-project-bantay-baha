import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Truck, Plane, Ship, MapPin } from 'lucide-react';
import { Badge } from './ui/badge';

const vehicles = [
  { id: 'V001', type: 'road', location: 'New York', status: 'In Transit', lat: 40.7128, lng: -74.0060 },
  { id: 'V002', type: 'air', location: 'Los Angeles', status: 'Loading', lat: 34.0522, lng: -118.2437 },
  { id: 'V003', type: 'sea', location: 'Miami Port', status: 'In Transit', lat: 25.7617, lng: -80.1918 },
  { id: 'V004', type: 'road', location: 'Chicago', status: 'Delivered', lat: 41.8781, lng: -87.6298 },
  { id: 'V005', type: 'air', location: 'Denver', status: 'In Transit', lat: 39.7392, lng: -104.9903 },
];

const getTransportIcon = (type: string) => {
  switch (type) {
    case 'road': return <Truck className="h-4 w-4 text-green-600" />;
    case 'air': return <Plane className="h-4 w-4 text-blue-600" />;
    case 'sea': return <Ship className="h-4 w-4 text-teal-600" />;
    default: return <MapPin className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Transit': return 'bg-blue-100 text-blue-800';
    case 'Loading': return 'bg-yellow-100 text-yellow-800';
    case 'Delivered': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function VehicleTrackingMap() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Real-time Vehicle Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mock Map Area */}
        <div className="bg-gray-50 rounded-lg h-64 relative mb-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Interactive Map View</p>
              <p className="text-xs">Real-time vehicle tracking</p>
            </div>
          </div>
          
          {/* Vehicle Markers */}
          {vehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md border-2 border-white"
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index * 10)}%`,
              }}
            >
              {getTransportIcon(vehicle.type)}
            </div>
          ))}
        </div>

        {/* Vehicle List */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">Active Vehicles</h4>
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getTransportIcon(vehicle.type)}
                <div>
                  <p className="font-medium text-gray-900">{vehicle.id}</p>
                  <p className="text-sm text-gray-500">{vehicle.location}</p>
                </div>
              </div>
              <Badge className={getStatusColor(vehicle.status)}>
                {vehicle.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}