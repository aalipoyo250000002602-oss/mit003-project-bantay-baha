import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  User,
  Truck,
  Package,
  Route,
  DollarSign,
  Settings,
  Shield,
  RefreshCw,
  Calendar
} from 'lucide-react';

const activityLogs = [
  {
    id: 'LOG001',
    timestamp: '2024-01-12 10:30:15',
    user: {
      name: 'Alex Ali',
      email: 'alex.ali - aalipoyo_250000002602@uic.edu.ph',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwwfHx8fDE3MzQyMTA0Mjh8MA&ixlib=rb-4.0.3&q=80&w=1080'
    },
    action: 'Created',
    category: 'User Management',
    target: 'New driver account for Mike Supervisor',
    details: 'Added new driver with full credentials and vehicle assignments',
    ipAddress: '192.168.1.101',
    status: 'Success',
    severity: 'info'
  },
  {
    id: 'LOG002',
    timestamp: '2024-01-12 10:15:42',
    user: {
      name: 'Sarah Manager',
      email: 'sarah@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fHx8MTczNDIxMDQ2N3ww&ixlib=rb-4.0.3&q=80&w=1080'
    },
    action: 'Updated',
    category: 'Route Management',
    target: 'NY-Boston Express route optimization',
    details: 'Modified route parameters to improve efficiency by 8%',
    ipAddress: '192.168.1.105',
    status: 'Success',
    severity: 'info'
  },
  {
    id: 'LOG003',
    timestamp: '2024-01-12 09:45:30',
    user: {
      name: 'System',
      email: 'system@company.com',
      avatar: null
    },
    action: 'Alert Generated',
    category: 'Vehicle Maintenance',
    target: 'TRK-001 maintenance reminder',
    details: 'Vehicle TRK-001 scheduled maintenance due in 2 days',
    ipAddress: 'System',
    status: 'Warning',
    severity: 'warning'
  },
  {
    id: 'LOG004',
    timestamp: '2024-01-12 09:30:18',
    user: {
      name: 'Michael Johnson',
      email: 'mjohnson@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwwfHx8fDE3MzQyMTA1MDF8MA&ixlib=rb-4.0.3&q=80&w=1080'
    },
    action: 'Completed',
    category: 'Trip Management',
    target: 'Trip TR-2024-089 delivery',
    details: 'Successfully delivered shipment to Boston - Customer signature obtained',
    ipAddress: '192.168.1.110',
    status: 'Success',
    severity: 'success'
  },
  {
    id: 'LOG005',
    timestamp: '2024-01-12 08:45:12',
    user: {
      name: 'System',
      email: 'system@company.com',
      avatar: null
    },
    action: 'Failed Login Attempt',
    category: 'Security',
    target: 'Multiple failed login attempts detected',
    details: 'User account lisa@company.com exceeded maximum login attempts',
    ipAddress: '192.168.1.200',
    status: 'Error',
    severity: 'error'
  },
  {
    id: 'LOG006',
    timestamp: '2024-01-12 08:30:45',
    user: {
      name: 'Carlos Silva',
      email: 'carlos@company.com',
      avatar: 'https://images.unsplash.com/photo-1718434137166-b3cb7d944b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU1ODMxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    action: 'Started',
    category: 'Trip Management',
    target: 'Trip TR-2024-095 departure',
    details: 'Departed São Paulo with destination Rio de Janeiro - ETA 4h 15m',
    ipAddress: '192.168.1.115',
    status: 'Success',
    severity: 'info'
  }
];

const systemEvents = [
  {
    id: 'SYS001',
    timestamp: '2024-01-12 02:00:00',
    event: 'Database Backup',
    status: 'Completed',
    duration: '00:45:30',
    details: 'Full system backup completed successfully - 2.4GB archived'
  },
  {
    id: 'SYS002',
    timestamp: '2024-01-12 01:30:00',
    event: 'Route Optimization Job',
    status: 'Completed',
    duration: '00:15:22',
    details: 'Analyzed 24 routes - 3 optimization opportunities identified'
  },
  {
    id: 'SYS003',
    timestamp: '2024-01-12 00:45:00',
    event: 'Fuel Price Update',
    status: 'Completed',
    duration: '00:02:15',
    details: 'Updated fuel prices from 15 regional sources'
  },
  {
    id: 'SYS004',
    timestamp: '2024-01-11 23:30:00',
    event: 'Vehicle Telemetry Sync',
    status: 'Completed',
    duration: '00:08:45',
    details: 'Synchronized data from 247 active vehicles'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Success': return 'bg-green-100 text-green-800 border-green-200';
    case 'Warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Error': return 'bg-red-100 text-red-800 border-red-200';
    case 'Info': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'warning': return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'info': return <Info className="h-4 w-4 text-blue-500" />;
    default: return <Info className="h-4 w-4 text-gray-500" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'User Management': return <User className="h-4 w-4 text-purple-500" />;
    case 'Vehicle Maintenance': return <Truck className="h-4 w-4 text-orange-500" />;
    case 'Trip Management': return <Package className="h-4 w-4 text-blue-500" />;
    case 'Route Management': return <Route className="h-4 w-4 text-green-500" />;
    case 'Financial': return <DollarSign className="h-4 w-4 text-emerald-500" />;
    case 'Security': return <Shield className="h-4 w-4 text-red-500" />;
    case 'System': return <Settings className="h-4 w-4 text-gray-500" />;
    default: return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

export function LogsModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate new log entries
        console.log('Refreshing logs...');
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(activityLogs.map(log => log.category))];
  const statuses = [...new Set(activityLogs.map(log => log.status))];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Activity Logs</h1>
            <p className="text-muted-foreground">Monitor system activities and user actions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
            <div className={`h-2 w-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-muted-foreground">
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">1,247</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">1,186</p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">45</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">16</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="system">System Events</TabsTrigger>
          <TabsTrigger value="security">Security Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6">
          {/* Filters */}
          <Card className="mb-6 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Activity Table */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-accent/50 cursor-pointer">
                      <TableCell className="font-mono text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {log.user.avatar ? (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={log.user.avatar} />
                              <AvatarFallback>{log.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-6 w-6 bg-muted rounded-full flex items-center justify-center">
                              <Settings className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm">{log.user.name}</p>
                            <p className="text-xs text-muted-foreground">{log.ipAddress}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(log.severity)}
                          <span className="font-medium">{log.action}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(log.category)}
                          <span className="text-sm">{log.category}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{log.target}</p>
                        <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                      </TableCell>
                      
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>System Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Settings className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.event}</h4>
                        <p className="text-sm text-muted-foreground">{event.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(event.timestamp).toLocaleString()} • Duration: {event.duration}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.filter(log => log.category === 'Security').map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                      <div>
                        <h4 className="font-medium text-red-800">{log.action}</h4>
                        <p className="text-sm text-red-700">{log.details}</p>
                        <p className="text-xs text-red-600 mt-1">
                          {new Date(log.timestamp).toLocaleString()} • IP: {log.ipAddress}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      Security Alert
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}