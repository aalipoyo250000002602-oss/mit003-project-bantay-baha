import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Calendar, Truck, Plane, Ship } from 'lucide-react';

const bookings = [
  {
    id: 'BK001',
    customer: 'Acme Corp',
    origin: 'New York',
    destination: 'Los Angeles',
    mode: 'road',
    material: 'Electronics',
    date: '2024-01-15',
    status: 'Confirmed',
  },
  {
    id: 'BK002',
    customer: 'TechFlow Inc',
    origin: 'Chicago',
    destination: 'Miami',
    mode: 'air',
    material: 'Medical Supplies',
    date: '2024-01-16',
    status: 'Pending',
  },
  {
    id: 'BK003',
    customer: 'Global Exports',
    origin: 'Seattle',
    destination: 'Tokyo',
    mode: 'sea',
    material: 'Machinery',
    date: '2024-01-18',
    status: 'Confirmed',
  },
  {
    id: 'BK004',
    customer: 'FastTrack Ltd',
    origin: 'Dallas',
    destination: 'Denver',
    mode: 'road',
    material: 'Consumer Goods',
    date: '2024-01-20',
    status: 'In Progress',
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function UpcomingBookings() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Upcoming Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>{booking.customer}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{booking.origin} →</div>
                    <div className="text-gray-500">{booking.destination}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTransportIcon(booking.mode)}
                    <span className="capitalize">{booking.mode}</span>
                  </div>
                </TableCell>
                <TableCell>{booking.material}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
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