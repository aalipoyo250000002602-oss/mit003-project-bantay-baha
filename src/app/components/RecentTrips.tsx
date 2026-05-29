import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Clock, Truck, Plane, Ship } from 'lucide-react';

const recentTrips = [
  {
    id: 'TR001',
    route: 'New York → Boston',
    vehicle: 'TRK-001',
    driver: 'Mike Johnson',
    driverInitials: 'MJ',
    mode: 'road',
    material: 'Electronics',
    revenue: '$2,450',
    status: 'Completed',
    completedDate: '2024-01-10',
  },
  {
    id: 'TR002',
    route: 'LA → San Francisco',
    vehicle: 'AIR-205',
    driver: 'Sarah Wilson',
    driverInitials: 'SW',
    mode: 'air',
    material: 'Medical Supplies',
    revenue: '$8,900',
    status: 'Completed',
    completedDate: '2024-01-09',
  },
  {
    id: 'TR003',
    route: 'Seattle → Vancouver',
    vehicle: 'SEA-102',
    driver: 'David Chen',
    driverInitials: 'DC',
    mode: 'sea',
    material: 'Machinery',
    revenue: '$15,600',
    status: 'Completed',
    completedDate: '2024-01-08',
  },
  {
    id: 'TR004',
    route: 'Chicago → Detroit',
    vehicle: 'TRK-089',
    driver: 'Lisa Brown',
    driverInitials: 'LB',
    mode: 'road',
    material: 'Consumer Goods',
    revenue: '$1,890',
    status: 'Completed',
    completedDate: '2024-01-07',
  },
];

const getTransportIcon = (mode: string) => {
  switch (mode) {
    case 'road': return <Truck className="h-4 w-4 text-green-600" />;
    case 'air': return <Plane className="h-4 w-4 text-blue-600" />;
    case 'sea': return <Ship className="h-4 w-4 text-teal-600" />;
    default: return null;
  }
};

export function RecentTrips() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Recent Trips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trip ID</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTrips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell className="font-medium">{trip.id}</TableCell>
                <TableCell>
                  <div className="text-sm">{trip.route}</div>
                  <div className="text-xs text-gray-500">{trip.completedDate}</div>
                </TableCell>
                <TableCell className="font-medium">{trip.vehicle}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                        {trip.driverInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{trip.driver}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTransportIcon(trip.mode)}
                    <span className="capitalize text-sm">{trip.mode}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{trip.material}</TableCell>
                <TableCell className="font-semibold text-green-600">{trip.revenue}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">
                    {trip.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}