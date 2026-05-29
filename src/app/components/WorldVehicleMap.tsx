import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Globe, RefreshCw, Maximize2, Filter, Truck, Plane, Ship } from 'lucide-react';
import { worldVehicleData, filterOptions } from './data/vehicleData';
import { filterVehicles } from './utils/mapUtils';
import { WorldMapBackground } from './map/WorldMapBackground';
import { VehicleMarker, VehiclePopup } from './map/VehicleMarker';
import { VehicleList } from './map/VehicleList';

export function WorldVehicleMap() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  
  const filteredVehicles = filterVehicles(worldVehicleData, filter);

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(selectedVehicle === vehicleId ? null : vehicleId);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Global Fleet Tracking
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* World Map */}
          <div className="lg:col-span-3 relative">
            <WorldMapBackground />
            
            {/* Vehicle Markers */}
            <div className="absolute inset-0">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id}>
                  <VehicleMarker
                    vehicle={vehicle}
                    isSelected={selectedVehicle === vehicle.id}
                    onClick={() => handleVehicleSelect(vehicle.id)}
                  />
                  <VehiclePopup
                    vehicle={vehicle}
                    isVisible={selectedVehicle === vehicle.id}
                  />
                </div>
              ))}
            </div>

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

          {/* Vehicle List */}
          <div>
            <VehicleList
              vehicles={filteredVehicles}
              selectedVehicle={selectedVehicle}
              onVehicleSelect={handleVehicleSelect}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}