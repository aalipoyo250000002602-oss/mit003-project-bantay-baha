import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Globe,
  RefreshCw,
  Maximize2,
  Minimize2,
  Filter,
  Truck,
  Plane,
  Ship,
  Navigation,
  MapPin,
  Fuel,
  Clock,
  Plus,
  Minus
} from 'lucide-react';
import { worldVehicleData, filterOptions } from './data/vehicleData';

interface GoogleMapsTrackerProps {
  className?: string;
}

export function GoogleMapsTracker({ className = '' }: GoogleMapsTrackerProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Simulate real Google Maps (since we can't use actual Google Maps API in this environment)
  const initializeMap = () => {
    // This would normally initialize Google Maps
    // For demo purposes, we'll create a realistic-looking map interface
    console.log('Initializing Google Maps...');
  };

  useEffect(() => {
    initializeMap();
  }, []);

  const filteredVehicles = worldVehicleData.filter(vehicle => {
    if (filter === 'all') return true;
    if (filter === 'active') return vehicle.status === 'In Transit';
    return vehicle.type === filter;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Simulate data refresh
    }, 2000);
  };

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        mapRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.log('Fullscreen not supported in this environment');
      // Fullscreen API is blocked by permissions policy in iframe
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
      case 'In Transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Loading': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`border-0 shadow-lg ${className}`} ref={mapRef}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Live Camera Tracking
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3 w-3" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3" />
                  Fullscreen
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 mt-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <div className="flex gap-2">
            {filterOptions.map(f => (
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
        <div className="grid grid-cols-1 gap-6">
          {/* Interactive Map Container */}
          <div className="w-full">
            <div className="relative">
              {/* Realistic Google Maps Interface */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-96 relative overflow-hidden border shadow-inner">
                {/* Map Controls (Google Maps Style) */}
                <div className="absolute top-4 right-4 z-20 space-y-2">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
                    <Button variant="ghost" size="sm" className="p-2 rounded-t-lg rounded-b-none border-b">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2 rounded-none border-b">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2 rounded-b-lg rounded-t-none">
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Map Type Controls */}
                <div className="absolute bottom-4 right-4 z-20">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-1 flex gap-1">
                    <Button variant="ghost" size="sm" className="text-xs">Map</Button>
                    <Button variant="ghost" size="sm" className="text-xs">Satellite</Button>
                    <Button variant="ghost" size="sm" className="text-xs">Terrain</Button>
                  </div>
                </div>

                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 dark:from-blue-900/20 dark:via-green-900/10 dark:to-blue-900/20">
                  {/* Simulated road networks */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#666" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                  
                  {/* Simulated landmasses */}
                  <div className="absolute top-8 left-12 w-24 h-16 bg-green-200 dark:bg-green-800/30 rounded-lg opacity-60"></div>
                  <div className="absolute top-16 right-20 w-20 h-12 bg-green-200 dark:bg-green-800/30 rounded-lg opacity-60"></div>
                  <div className="absolute bottom-20 left-16 w-28 h-20 bg-green-200 dark:bg-green-800/30 rounded-lg opacity-60"></div>
                  <div className="absolute bottom-12 right-12 w-16 h-14 bg-green-200 dark:bg-green-800/30 rounded-lg opacity-60"></div>
                </div>

                {/* Vehicle Markers with Real-time Positions */}
                {filteredVehicles.map((vehicle) => (
                  <div key={vehicle.id}>
                    {/* Vehicle Marker */}
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                      style={{
                        left: vehicle.mapPosition.x,
                        top: vehicle.mapPosition.y,
                      }}
                      onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
                    >
                      {/* Google Maps Style Marker */}
                      <div className={`relative ${
                        selectedVehicle === vehicle.id 
                          ? 'scale-125' 
                          : vehicle.status === 'In Transit' 
                            ? 'animate-pulse' 
                            : ''
                      } transition-all duration-200`}>
                        
                        {/* Marker Pin */}
                        <div className="bg-white rounded-full p-2 shadow-lg border-2 border-gray-300 hover:shadow-xl transition-shadow">
                          {getTransportIcon(vehicle.type)}
                        </div>
                        
                        {/* Marker Stem */}
                        <div className="w-0.5 h-3 bg-gray-400 mx-auto"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto -mt-1"></div>
                        
                        {/* Movement Trail for Active Vehicles */}
                        {vehicle.status === 'In Transit' && (
                          <div className="absolute top-1/2 left-1/2 w-8 h-8 border-2 border-blue-400 rounded-full animate-ping -translate-x-1/2 -translate-y-1/2 opacity-75"></div>
                        )}
                      </div>
                      
                      {/* Country Label */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {vehicle.location.country}
                      </div>
                      
                      {/* Google Maps Style Info Window */}
                      {selectedVehicle === vehicle.id && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 min-w-72 z-30 border">
                          {/* Info Window Arrow */}
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t rotate-45"></div>
                          
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={vehicle.driver.photo} />
                              <AvatarFallback>{vehicle.driver.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-foreground">{vehicle.name}</h4>
                              <p className="text-sm text-muted-foreground">{vehicle.id}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Driver:</span>
                              <span className="font-medium">{vehicle.driver.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Location:</span>
                              <span className="font-medium">{vehicle.location.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Speed:</span>
                              <span className="font-medium">{vehicle.speed}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Fuel:</span>
                              <div className="flex items-center gap-1">
                                <Fuel className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{vehicle.fuelLevel}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">ETA:</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium text-blue-600">{vehicle.eta}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between items-center">
                            <Badge className={getStatusColor(vehicle.status)}>
                              {vehicle.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              Track Route
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                  <h5 className="font-medium text-foreground mb-2 text-sm">Vehicle Types</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Truck className="h-3 w-3 text-green-600" />
                      <span>Road Transport ({filteredVehicles.filter(v => v.type === 'road').length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plane className="h-3 w-3 text-blue-600" />
                      <span>Air Transport ({filteredVehicles.filter(v => v.type === 'air').length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ship className="h-3 w-3 text-teal-600" />
                      <span>Sea Transport ({filteredVehicles.filter(v => v.type === 'sea').length})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Status Bar */}
        <div className="mt-4 flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Live Tracking Active</span>
            </div>
            <div className="text-muted-foreground">
              Last Update: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredVehicles.filter(v => v.status === 'In Transit').length} vehicles in transit
          </div>
        </div>
      </CardContent>
    </Card>
  );
}