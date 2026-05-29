import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Award,
  FileText
} from 'lucide-react';

const driversData = [
  {
    id: 'D001',
    name: 'Michael Johnson',
    photo: 'https://images.unsplash.com/photo-1718434137166-b3cb7d944b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU1ODMxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    phone: '+1 (555) 234-5678',
    email: 'michael.johnson@company.com',
    license: 'CDL-A #987654321',
    experience: '8 years',
    rating: 4.8,
    status: 'Available',
    location: 'New York, NY',
    vehicleAssigned: 'TRK-001',
    completedTrips: 342,
    totalDistance: '125,400 mi',
    onTimeDelivery: 96,
    safetyScore: 98,
    earnings: '$8,450',
    joinDate: '2016-03-15',
    licenseExpiry: '2026-03-15',
    medicalCert: '2025-06-20',
    emergencyContact: 'Sarah Johnson - (555) 234-5679'
  },
  {
    id: 'D002',
    name: 'Sarah Wilson',
    photo: 'https://images.unsplash.com/photo-1622175691858-a4deb912838e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjB0cnVjayUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    phone: '+1 (555) 345-6789',
    email: 'sarah.wilson@company.com',
    license: 'CDL-A #876543210',
    experience: '5 years',
    rating: 4.9,
    status: 'On Trip',
    location: 'Los Angeles, CA',
    vehicleAssigned: 'AIR-205',
    completedTrips: 198,
    totalDistance: '89,200 mi',
    onTimeDelivery: 98,
    safetyScore: 100,
    earnings: '$7,890',
    joinDate: '2019-01-20',
    licenseExpiry: '2027-01-20',
    medicalCert: '2025-08-15',
    emergencyContact: 'David Wilson - (555) 345-6790'
  },
  {
    id: 'D003',
    name: 'David Chen',
    photo: 'https://images.unsplash.com/photo-1710242078536-fe62a305a86c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    phone: '+1 (555) 456-7890',
    email: 'david.chen@company.com',
    license: 'CDL-B #765432109',
    experience: '12 years',
    rating: 4.7,
    status: 'Maintenance',
    location: 'Chicago, IL',
    vehicleAssigned: 'SEA-102',
    completedTrips: 567,
    totalDistance: '203,800 mi',
    onTimeDelivery: 94,
    safetyScore: 96,
    earnings: '$9,120',
    joinDate: '2012-08-10',
    licenseExpiry: '2025-08-10',
    medicalCert: '2025-04-12',
    emergencyContact: 'Linda Chen - (555) 456-7891'
  },
  {
    id: 'D004',
    name: 'Lisa Brown',
    photo: 'https://images.unsplash.com/photo-1659353740059-5554fb2ac89e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMGRyaXZlciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTU1ODMxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    phone: '+1 (555) 567-8901',
    email: 'lisa.brown@company.com',
    license: 'CDL-A #654321098',
    experience: '6 years',
    rating: 4.6,
    status: 'Available',
    location: 'Miami, FL',
    vehicleAssigned: 'TRK-089',
    completedTrips: 289,
    totalDistance: '98,600 mi',
    onTimeDelivery: 92,
    safetyScore: 94,
    earnings: '$7,650',
    joinDate: '2018-05-12',
    licenseExpiry: '2026-05-12',
    medicalCert: '2025-11-08',
    emergencyContact: 'Robert Brown - (555) 567-8902'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available': return 'bg-green-100 text-green-800';
    case 'On Trip': return 'bg-blue-100 text-blue-800';
    case 'Maintenance': return 'bg-orange-100 text-orange-800';
    case 'Off Duty': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function DriversModule() {
  const [selectedDriver, setSelectedDriver] = useState(driversData[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrivers = driversData.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Drivers Management</h1>
            <p className="text-gray-600">Manage driver profiles, performance, and assignments</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Add New Driver
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search drivers by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Driver List */}
        <div className="space-y-4">
          {filteredDrivers.map((driver) => (
            <Card 
              key={driver.id} 
              className={`cursor-pointer transition-all border-0 shadow-sm hover:shadow-md ${
                selectedDriver.id === driver.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
              }`}
              onClick={() => setSelectedDriver(driver)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={driver.photo}
                    alt={driver.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{driver.name}</h3>
                    <p className="text-sm text-gray-500">{driver.id}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(driver.status)}>
                        {driver.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{driver.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Driver Details */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src={selectedDriver.photo}
                  alt={selectedDriver.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedDriver.name}</CardTitle>
                      <p className="text-gray-600">{selectedDriver.id} • {selectedDriver.experience} experience</p>
                    </div>
                    <Badge className={getStatusColor(selectedDriver.status)}>
                      {selectedDriver.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{selectedDriver.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedDriver.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{selectedDriver.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{selectedDriver.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{selectedDriver.location}</span>
                        </div>
                      </div>

                      <h3 className="font-medium text-gray-900 mt-6">License & Certification</h3>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="font-medium">License:</span> {selectedDriver.license}</p>
                        <p className="text-sm"><span className="font-medium">Expiry:</span> {selectedDriver.licenseExpiry}</p>
                        <p className="text-sm"><span className="font-medium">Medical Cert:</span> {selectedDriver.medicalCert}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Assignment</h3>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="font-medium">Vehicle:</span> {selectedDriver.vehicleAssigned}</p>
                        <p className="text-sm"><span className="font-medium">Join Date:</span> {selectedDriver.joinDate}</p>
                        <p className="text-sm"><span className="font-medium">Emergency Contact:</span> {selectedDriver.emergencyContact}</p>
                      </div>

                      <h3 className="font-medium text-gray-900 mt-6">Quick Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Total Trips</p>
                          <p className="text-lg font-semibold">{selectedDriver.completedTrips}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Distance</p>
                          <p className="text-lg font-semibold">{selectedDriver.totalDistance}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Earnings</p>
                          <p className="text-lg font-semibold text-green-600">{selectedDriver.earnings}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Rating</p>
                          <p className="text-lg font-semibold">{selectedDriver.rating}/5.0</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="mt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4 bg-green-50 border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800">On-Time Delivery</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-2xl font-bold text-green-700">{selectedDriver.onTimeDelivery}%</span>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                          <Progress value={selectedDriver.onTimeDelivery} className="h-2" />
                        </div>
                      </Card>

                      <Card className="p-4 bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-800">Safety Score</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-2xl font-bold text-blue-700">{selectedDriver.safetyScore}%</span>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                          </div>
                          <Progress value={selectedDriver.safetyScore} className="h-2" />
                        </div>
                      </Card>

                      <Card className="p-4 bg-purple-50 border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-purple-800">Customer Rating</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-2xl font-bold text-purple-700">{selectedDriver.rating}/5.0</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < Math.floor(selectedDriver.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-4">
                        <h4 className="font-medium text-gray-900 mb-4">Performance Trends</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">This Month</span>
                            <span className="text-sm font-medium">18 trips completed</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Average Trip Time</span>
                            <span className="text-sm font-medium">4.2 hours</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Fuel Efficiency</span>
                            <span className="text-sm font-medium">8.2 MPG</span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <h4 className="font-medium text-gray-900 mb-4">Achievements</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">Safe Driver Award 2023</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">100+ Trips Milestone</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-green-500" />
                            <span className="text-sm">On-Time Delivery Champion</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Driver Documents</h3>
                      <Button variant="outline" size="sm">Upload Document</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'Driver License', status: 'Valid', expiry: selectedDriver.licenseExpiry, type: 'CDL-A' },
                        { name: 'Medical Certificate', status: 'Valid', expiry: selectedDriver.medicalCert, type: 'DOT Physical' },
                        { name: 'Background Check', status: 'Valid', expiry: '2024-12-31', type: 'MVR Report' },
                        { name: 'Insurance Certificate', status: 'Valid', expiry: '2024-08-15', type: 'Commercial' },
                      ].map((doc, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{doc.name}</span>
                            </div>
                            <Badge className={doc.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {doc.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">Type: {doc.type}</p>
                          <p className="text-sm text-gray-600">Expires: {doc.expiry}</p>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs">View</Button>
                            <Button size="sm" variant="outline" className="text-xs">Download</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Recent Trip History</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'TR001', route: 'New York → Boston', date: '2024-01-10', status: 'Completed', revenue: '$2,450' },
                        { id: 'TR005', route: 'Boston → Philadelphia', date: '2024-01-08', status: 'Completed', revenue: '$1,890' },
                        { id: 'TR009', route: 'New York → Albany', date: '2024-01-06', status: 'Completed', revenue: '$1,320' },
                        { id: 'TR012', route: 'Albany → Buffalo', date: '2024-01-04', status: 'Completed', revenue: '$2,100' },
                      ].map((trip, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{trip.id}</p>
                              <p className="text-sm text-gray-600">{trip.route}</p>
                              <p className="text-xs text-gray-500">{trip.date}</p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-green-100 text-green-800 mb-1">{trip.status}</Badge>
                              <p className="text-sm font-medium text-green-600">{trip.revenue}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}