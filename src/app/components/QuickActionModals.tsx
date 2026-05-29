import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  FileText,
  CheckCircle,
  Clock,
  Route,
  DollarSign,
  MapPin,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Target,
  Fuel,
  Users
} from 'lucide-react';

// Route Optimization Modal
interface RouteOptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RouteOptimizationModal({ isOpen, onClose }: RouteOptimizationModalProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationComplete(true);
    }, 3000);
  };

  const routeData = [
    {
      id: 'RT001',
      name: 'NY-Boston Express',
      current: { distance: '215 miles', time: '4h 30m', cost: '$2,450', efficiency: 94 },
      optimized: { distance: '198 miles', time: '4h 8m', cost: '$2,250', efficiency: 97 },
      savings: { distance: '17 miles', time: '22 min', cost: '$200', efficiency: '+3%' }
    },
    {
      id: 'RT002',
      name: 'LA-Seattle Route',
      current: { distance: '1,135 miles', time: '18h 45m', cost: '$4,850', efficiency: 89 },
      optimized: { distance: '1,089 miles', time: '17h 52m', cost: '$4,520', efficiency: 92 },
      savings: { distance: '46 miles', time: '53 min', cost: '$330', efficiency: '+3%' }
    },
    {
      id: 'RT003',
      name: 'Chicago-Miami Air',
      current: { distance: '1,197 miles', time: '3h 15m', cost: '$8,900', efficiency: 97 },
      optimized: { distance: '1,197 miles', time: '3h 15m', cost: '$8,650', efficiency: 98 },
      savings: { distance: '0 miles', time: '0 min', cost: '$250', efficiency: '+1%' }
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-orange-600" />
            Route Optimization Engine
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Optimization Status */}
          <Card className="border-0 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">AI-Powered Route Optimization</h3>
                  <p className="text-muted-foreground">
                    {isOptimizing ? 'Analyzing routes and calculating optimal paths...' : 
                     optimizationComplete ? 'Optimization complete! Review the suggested improvements below.' :
                     'Analyze your current routes and discover optimization opportunities.'}
                  </p>
                </div>
                <Button 
                  onClick={handleOptimize} 
                  disabled={isOptimizing}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isOptimizing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-1" />
                      Start Optimization
                    </>
                  )}
                </Button>
              </div>
              
              {isOptimizing && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>Analyzing routes...</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Route Optimization Results */}
          {(optimizationComplete || !isOptimizing) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Optimization Results</span>
                  <Badge className="bg-green-100 text-green-800">
                    Potential Savings: $780/day
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Optimized</TableHead>
                      <TableHead>Savings</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routeData.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{route.name}</p>
                            <p className="text-sm text-muted-foreground">{route.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{route.current.distance} • {route.current.time}</p>
                            <p className="text-muted-foreground">{route.current.cost} • {route.current.efficiency}% eff.</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="text-green-600">{route.optimized.distance} • {route.optimized.time}</p>
                            <p className="text-green-600">{route.optimized.cost} • {route.optimized.efficiency}% eff.</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <ArrowDown className="h-3 w-3 text-green-500" />
                              <span className="text-green-600">{route.savings.distance}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ArrowDown className="h-3 w-3 text-green-500" />
                              <span className="text-green-600">{route.savings.cost}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Apply Changes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Analytics Modal
interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    { title: 'Fleet Utilization', value: '87.3%', change: '+2.1%', trend: 'up' },
    { title: 'On-Time Delivery', value: '94.5%', change: '+1.8%', trend: 'up' },
    { title: 'Fuel Efficiency', value: '8.2 MPG', change: '+0.4', trend: 'up' },
    { title: 'Revenue per Mile', value: '$3.45', change: '-$0.08', trend: 'down' },
    { title: 'Customer Satisfaction', value: '4.7/5', change: '+0.2', trend: 'up' },
    { title: 'Maintenance Cost', value: '$892/vehicle', change: '-$45', trend: 'down' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Advanced Analytics Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Time Range Selector */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Performance Analytics</h3>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{metric.title}</span>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' ? (
                        <ArrowUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Analytics */}
          <Tabs defaultValue="performance" className="w-full">
            <TabsList>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="operational">Operational</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Fleet Performance Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Interactive Performance Chart
                      <br />
                      <small>(Chart would be rendered here with real data)</small>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Route Efficiency Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>NY-Boston Express</span>
                        <div className="flex items-center gap-2">
                          <Progress value={94} className="w-20" />
                          <span className="text-sm font-medium">94%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Chicago-Miami Air</span>
                        <div className="flex items-center gap-2">
                          <Progress value={97} className="w-20" />
                          <span className="text-sm font-medium">97%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>LA-Seattle Route</span>
                        <div className="flex items-center gap-2">
                          <Progress value={89} className="w-20" />
                          <span className="text-sm font-medium">89%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">$127K</p>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">$89K</p>
                      <p className="text-sm text-muted-foreground">Net Profit</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">24.5%</p>
                      <p className="text-sm text-muted-foreground">Profit Margin</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="operational" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Operational Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Vehicle Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Active</span>
                          <span className="text-green-600 font-medium">247</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Maintenance</span>
                          <span className="text-orange-600 font-medium">15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Out of Service</span>
                          <span className="text-red-600 font-medium">3</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Driver Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>On Duty</span>
                          <span className="text-green-600 font-medium">156</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Off Duty</span>
                          <span className="text-gray-600 font-medium">89</span>
                        </div>
                        <div className="flex justify-between">
                          <span>On Break</span>
                          <span className="text-yellow-600 font-medium">12</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Export Options */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export PDF
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Alerts Modal
interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertsModal({ isOpen, onClose }: AlertsModalProps) {
  const alerts = [
    {
      id: 'ALT001',
      type: 'critical',
      title: 'Vehicle Breakdown - TRK-105',
      description: 'Vehicle TRK-105 has reported engine failure on I-95. Driver is safe, requesting immediate assistance.',
      time: '5 minutes ago',
      status: 'unresolved',
      priority: 'critical'
    },
    {
      id: 'ALT002',
      type: 'warning',
      title: 'Maintenance Due - Multiple Vehicles',
      description: '5 vehicles are due for scheduled maintenance within the next 48 hours.',
      time: '1 hour ago',
      status: 'acknowledged',
      priority: 'high'
    },
    {
      id: 'ALT003',
      type: 'info',
      title: 'Route Optimization Available',
      description: 'NY-Boston route can be optimized to save 22 minutes and $200 in fuel costs.',
      time: '2 hours ago',
      status: 'unresolved',
      priority: 'medium'
    },
    {
      id: 'ALT004',
      type: 'warning',
      title: 'Weather Alert - Chicago Route',
      description: 'Severe weather conditions reported on Chicago-Milwaukee route. Consider delays or rerouting.',
      time: '3 hours ago',
      status: 'resolved',
      priority: 'high'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <Clock className="h-5 w-5 text-orange-500" />;
      case 'info': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 border-red-200 dark:bg-red-950/20';
      case 'high': return 'bg-orange-50 border-orange-200 dark:bg-orange-950/20';
      case 'medium': return 'bg-blue-50 border-blue-200 dark:bg-blue-950/20';
      case 'low': return 'bg-green-50 border-green-200 dark:bg-green-950/20';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-950/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            System Alerts & Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Summary */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-sm text-red-700">Critical</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">2</p>
                <p className="text-sm text-orange-700">High Priority</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">1</p>
                <p className="text-sm text-blue-700">Medium Priority</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">3</p>
                <p className="text-sm text-green-700">Resolved Today</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Alerts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Active Alerts</h3>
            {alerts.map((alert) => (
              <Card key={alert.id} className={`${getAlertColor(alert.priority)} border`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {getAlertIcon(alert.type)}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{alert.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              alert.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }
                          >
                            {alert.priority}
                          </Badge>
                          <Badge 
                            variant={alert.status === 'resolved' ? 'secondary' : 'outline'}
                            className={alert.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                        <div className="flex gap-2">
                          {alert.status === 'unresolved' && (
                            <>
                              <Button size="sm" variant="outline">
                                Acknowledge
                              </Button>
                              <Button size="sm">
                                Resolve
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Generate Report Modal
interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GenerateReportModal({ isOpen, onClose }: GenerateReportModalProps) {
  const [reportType, setReportType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Simulate download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
    }, 3000);
  };

  const reportTypes = [
    { id: 'revenue', name: 'Revenue Summary', description: 'Financial performance and revenue analytics' },
    { id: 'fleet', name: 'Fleet Performance', description: 'Vehicle utilization and performance metrics' },
    { id: 'driver', name: 'Driver Performance', description: 'Driver statistics and performance analysis' },
    { id: 'routes', name: 'Route Analysis', description: 'Route efficiency and optimization opportunities' },
    { id: 'maintenance', name: 'Maintenance Report', description: 'Vehicle maintenance costs and schedules' },
    { id: 'customer', name: 'Customer Analytics', description: 'Customer satisfaction and service metrics' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-green-600" />
            Generate Custom Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Report Type</h3>
            <div className="grid grid-cols-1 gap-3">
              {reportTypes.map((type) => (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    reportType === type.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''
                  }`}
                  onClick={() => setReportType(type.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        reportType === type.id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {reportType && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Report Configuration</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Format:</span>
                    <span className="ml-2 font-medium">PDF</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date Range:</span>
                    <span className="ml-2 font-medium">Last 30 days</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Include Charts:</span>
                    <span className="ml-2 font-medium">Yes</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated Size:</span>
                    <span className="ml-2 font-medium">2.4 MB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={!reportType || isGenerating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-1" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}