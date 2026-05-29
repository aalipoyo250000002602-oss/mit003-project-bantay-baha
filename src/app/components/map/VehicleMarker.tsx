import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { getTransportIcon, getStatusColor } from '../utils/mapUtils';

interface VehicleMarkerProps {
  vehicle: any;
  isSelected: boolean;
  onClick: () => void;
}

export function VehicleMarker({ vehicle, isSelected, onClick }: VehicleMarkerProps) {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
      style={{
        left: vehicle.mapPosition.x,
        top: vehicle.mapPosition.y,
      }}
      onClick={onClick}
    >
      {/* Vehicle Marker */}
      <div className={`bg-white rounded-full p-3 shadow-xl border-2 transition-all duration-200 ${
        isSelected 
          ? 'scale-125 border-yellow-400 ring-2 ring-yellow-200' 
          : vehicle.status === 'In Transit' 
            ? 'border-green-400 animate-pulse shadow-green-400/50' 
            : 'border-gray-300'
      }`}>
        {getTransportIcon(vehicle.type, vehicle.status)}
      </div>
      
      {/* Country Label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
        {vehicle.location.country}
      </div>
      
      {/* Movement Trail for Active Vehicles */}
      {vehicle.status === 'In Transit' && (
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping -translate-x-1/2 -translate-y-1/2"></div>
      )}
    </div>
  );
}

interface VehiclePopupProps {
  vehicle: any;
  isVisible: boolean;
}

export function VehiclePopup({ vehicle, isVisible }: VehiclePopupProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white rounded-lg shadow-2xl p-4 min-w-72 z-20 border">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={vehicle.driver.photo} />
          <AvatarFallback>{vehicle.driver.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
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
  );
}