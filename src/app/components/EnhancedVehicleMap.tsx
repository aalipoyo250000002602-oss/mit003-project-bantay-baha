import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  MapPin, 
  Truck, 
  Plane, 
  Ship, 
  Navigation, 
  Clock,
  Fuel,
  User,
  Maximize2,
  Filter,
  RefreshCw
} from 'lucide-react';

const vehicleData = [
  {
    id: 'TRK-001',
    name: 'Volvo VNL 860',
    type: 'road',
    status: 'In Transit',
    driver: {
      name: 'Michael Johnson',
      photo: 'https://images.unsplash.com/photo-1718434137166-b3cb7d944b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU1ODMxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'I-95 Near Hartford, CT', lat: 41.7658, lng: -72.6734 },
    destination: 'Boston, MA',
    speed: '65 mph',
    fuelLevel: 78,
    eta: '2h 15m',
    mapPosition: { x: '68%', y: '35%' }
  },
  {
    id: 'VAN-205',
    name: 'Ford Transit',
    type: 'road',
    status: 'Loading',
    driver: {
      name: 'Sarah Wilson',
      photo: 'https://images.unsplash.com/photo-1622175691858-a4deb912838e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjB0cnVjayUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxODd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'LAX Distribution Center', lat: 33.9425, lng: -118.4081 },
    destination: 'San Francisco, CA',
    speed: '0 mph',
    fuelLevel: 42,
    eta: 'Loading...',
    mapPosition: { x: '15%', y: '62%' }
  },
  {
    id: 'AIR-102',
    name: 'Boeing 737 Cargo',
    type: 'air',
    status: 'In Transit',
    driver: {
      name: 'Captain Rodriguez',
      photo: 'https://images.unsplash.com/photo-1710242078536-fe62a305a86c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxODR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'Over Kansas', lat: 38.5266, lng: -96.7265 },
    destination: 'Miami, FL',
    speed: '485 mph',
    fuelLevel: 91,
    eta: '1h 45m',
    mapPosition: { x: '45%', y: '52%' }
  },
  {
    id: 'SEA-301',
    name: 'Container Ship Atlas',
    type: 'sea',
    status: 'In Transit',
    driver: {
      name: 'Captain Thompson',
      photo: 'https://images.unsplash.com/photo-1659353740059-5554fb2ac89e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhkZWxpdmVyeSUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'Pacific Ocean', lat: 36.7783, lng: -119.4179 },
    destination: 'Tokyo Port',
    speed: '22 knots',
    fuelLevel: 65,
    eta: '12 days',
    mapPosition: { x: '8%', y: '45%' }
  },
  {
    id: 'TRK-089',
    name: 'Peterbilt 579',
    type: 'road',
    status: 'Delivered',
    driver: {
      name: 'Lisa Brown',
      photo: 'https://images.unsplash.com/photo-1659353740059-5554fb2ac89e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhkZWxpdmVyeSUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    location: { name: 'Miami Distribution Hub', lat: 25.7617, lng: -80.1918 },
    destination: 'Completed',
    speed: '0 mph',
    fuelLevel: 23,
    eta: 'Delivered',
    mapPosition: { x: '78%', y: '85%' }
  }
];

const getTransportIcon = (type: string, status: string) => {
  const baseClasses = "h-5 w-5";
  const isActive = status === 'In Transit';
  
  switch (type) {
    case 'road': 
      return <Truck className={`${baseClasses} ${isActive ? 'text-green-600' : 'text-green-400'}`} />;
    case 'air': 
      return <Plane className={`${baseClasses} ${isActive ? 'text-blue-600' : 'text-blue-400'}`} />;
    case 'sea': 
      return <Ship className={`${baseClasses} ${isActive ? 'text-teal-600' : 'text-teal-400'}`} />;
    default: 
      return <MapPin className={`${baseClasses} text-gray-400`} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Transit': return 'bg-blue-100 text-blue-800';
    case 'Loading': return 'bg-orange-100 text-orange-800';
    case 'Delivered': return 'bg-green-100 text-green-800';
    case 'Maintenance': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function EnhancedVehicleMap() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  
  const filteredVehicles = vehicleData.filter(vehicle => {
    if (filter === 'all') return true;
    if (filter === 'active') return vehicle.status === 'In Transit';
    return vehicle.type === filter;
  });

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            Real-time Vehicle Tracking
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Maximize2 className="h-3 w-3" />
              Fullscreen
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 mt-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Vehicles' },
              { key: 'active', label: 'Active Only' },
              { key: 'road', label: 'Road' },
              { key: 'air', label: 'Air' },
              { key: 'sea', label: 'Sea' }
            ].map(f => (
              <Button
                key={f.key}
                size="sm"
                variant={filter === f.key ? 'default' : 'outline'}
                onClick={() => setFilter(f.key)}
                className="text-xs"
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 rounded-xl h-96 relative overflow-hidden border">
              {/* Map Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-12 grid-rows-8 h-full">
                  {Array.from({ length: 96 }).map((_, i) => (
                    <div key={i} className="border border-gray-300"></div>
                  ))}
                </div>
              </div>
              
              {/* Geographic Features */}
              <div className="absolute inset-0">
                {/* Simulated coastlines */}
                <div className="absolute left-0 top-0 w-2 h-full bg-blue-200 opacity-30"></div>
                <div className="absolute right-0 top-0 w-2 h-full bg-blue-200 opacity-30"></div>
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-200 opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 opacity-30"></div>
                
                {/* Simulated highways */}
                <div className="absolute top-1/3 left-1/4 w-1/2 h-0.5 bg-gray-400 opacity-40 rotate-12"></div>
                <div className="absolute top-2/3 left-1/6 w-2/3 h-0.5 bg-gray-400 opacity-40 -rotate-6"></div>
              </div>

              {/* Vehicle Markers */}
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: vehicle.mapPosition.x,
                    top: vehicle.mapPosition.y,
                  }}
                  onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
                >
                  {/* Vehicle Marker */}
                  <div className={`bg-white rounded-full p-3 shadow-lg border-2 transition-all duration-200 ${
                    selectedVehicle === vehicle.id 
                      ? 'scale-125 border-blue-500 ring-2 ring-blue-200' 
                      : vehicle.status === 'In Transit' 
                        ? 'border-green-500 animate-pulse' 
                        : 'border-gray-300'
                  }`}>
                    {getTransportIcon(vehicle.type, vehicle.status)}
                  </div>
                  
                  {/* Vehicle Info Popup */}
                  {selectedVehicle === vehicle.id && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl p-4 min-w-64 z-10 border">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={vehicle.driver.photo} />
                          <AvatarFallback>{vehicle.driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
                          <p className="text-sm text-gray-600">{vehicle.id}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Driver:</span>
                          <span className="font-medium">{vehicle.driver.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{vehicle.location.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Speed:</span>
                          <span className="font-medium">{vehicle.speed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel:</span>
                          <span className="font-medium">{vehicle.fuelLevel}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ETA:</span>
                          <span className="font-medium text-blue-600">{vehicle.eta}</span>
                        </div>
                      </div>
                      
                      <Badge className={`${getStatusColor(vehicle.status)} mt-3`}>
                        {vehicle.status}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Movement Trail for Active Vehicles */}
                  {vehicle.status === 'In Transit' && (
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping -translate-x-1/2 -translate-y-1/2"></div>
                  )}
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <h5 className="font-medium text-gray-900 mb-2 text-sm">Legend</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="h-3 w-3 text-green-600" />
                    <span>Road Transport</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane className="h-3 w-3 text-blue-600" />
                    <span>Air Transport</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ship className="h-3 w-3 text-teal-600" />
                    <span>Sea Transport</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Active Vehicles ({filteredVehicles.length})</h4>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredVehicles.map((vehicle) => (
                <Card 
                  key={vehicle.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedVehicle === vehicle.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
                  }`}
                  onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getTransportIcon(vehicle.type, vehicle.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 truncate">{vehicle.name}</h5>
                        <p className="text-sm text-gray-600">{vehicle.id}</p>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(vehicle.status)}>
                            {vehicle.status}
                          </Badge>
                          {vehicle.status === 'In Transit' && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-blue-600">{vehicle.eta}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={vehicle.driver.photo} />
                              <AvatarFallback className="text-xs">
                                {vehicle.driver.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-600">{vehicle.driver.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Fuel className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{vehicle.fuelLevel}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}