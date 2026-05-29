import { Truck, Plane, Ship, MapPin } from 'lucide-react';

export const getTransportIcon = (type: string, status: string) => {
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

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Transit': return 'bg-blue-100 text-blue-800';
    case 'Loading': return 'bg-orange-100 text-orange-800';
    case 'Delivered': return 'bg-green-100 text-green-800';
    case 'Maintenance': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const filterVehicles = (vehicles: any[], filter: string) => {
  if (filter === 'all') return vehicles;
  if (filter === 'active') return vehicles.filter(v => v.status === 'In Transit');
  return vehicles.filter(v => v.type === filter);
};