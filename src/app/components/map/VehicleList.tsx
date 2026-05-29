import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Clock, Fuel } from 'lucide-react';
import { getTransportIcon, getStatusColor } from '../utils/mapUtils';

interface VehicleListProps {
  vehicles: any[];
  selectedVehicle: string | null;
  onVehicleSelect: (vehicleId: string) => void;
}

export function VehicleList({ vehicles, selectedVehicle, onVehicleSelect }: VehicleListProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Active Vehicles ({vehicles.length})</h4>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {vehicles.map((vehicle) => (
          <Card 
            key={vehicle.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedVehicle === vehicle.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
            }`}
            onClick={() => onVehicleSelect(selectedVehicle === vehicle.id ? '' : vehicle.id)}
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
                          {vehicle.driver.name.split(' ').map((n: string) => n[0]).join('')}
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
  );
}