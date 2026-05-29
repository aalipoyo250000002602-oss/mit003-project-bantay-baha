import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Progress } from './ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar as CalendarIcon,
  Download,
  FileText,
  Filter,
  Search,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Target,
  Truck,
  Plane,
  Ship,
  Users,
  Route as RouteIcon,
  AlertCircle
} from 'lucide-react';

const revenueData = {
  overview: {
    totalRevenue: 2450000,
    monthlyGrowth: 8.2,
    avgRevenuePerTrip: 4850,
    profitMargin: 24.5,
    yearlyTarget: 3200000,
    targetProgress: 76.6
  },
  byTransportMode: [
    { mode: 'Road Transport', revenue: 1225000, percentage: 50, growth: 12.3, trips: 342, avgRevenue: 3584 },
    { mode: 'Air Transport', revenue: 892500, percentage: 36.4, growth: -2.1, trips: 89, avgRevenue: 10028 },
    { mode: 'Sea Transport', revenue: 332500, percentage: 13.6, growth: 18.7, trips: 24, avgRevenue: 13854 }
  ],
  byRoute: [
    { route: 'NY-Boston Express', revenue: 425000, trips: 156, efficiency: 94.2, profitMargin: 28.5 },
    { route: 'Chicago-Miami Air', revenue: 356000, trips: 45, efficiency: 97.1, profitMargin: 22.8 },
    { route: 'Seattle-Tokyo Ocean', revenue: 298000, trips: 18, efficiency: 89.3, profitMargin: 31.2 },
    { route: 'LA-Denver Road', revenue: 187000, trips: 89, efficiency: 91.7, profitMargin: 25.1 }
  ],
  monthlyTrend: [
    { month: 'Jan', revenue: 185000, trips: 45, profit: 46250 },
    { month: 'Feb', revenue: 192000, trips: 48, profit: 48000 },
    { month: 'Mar', revenue: 205000, trips: 52, profit: 51250 },
    { month: 'Apr', revenue: 198000, trips: 47, profit: 49500 },
    { month: 'May', revenue: 212000, trips: 54, profit: 53000 },
    { month: 'Jun', revenue: 225000, trips: 56, profit: 56250 },
    { month: 'Jul', revenue: 238000, trips: 59, profit: 59500 },
    { month: 'Aug', revenue: 245000, trips: 61, profit: 61250 },
    { month: 'Sep', revenue: 252000, trips: 63, profit: 63000 },
    { month: 'Oct', revenue: 268000, trips: 67, profit: 67000 },
    { month: 'Nov', revenue: 275000, trips: 69, profit: 68750 },
    { month: 'Dec', revenue: 295000, trips: 74, profit: 73750 }
  ],
  expenses: {
    fuel: { amount: 450000, percentage: 35.2, change: 8.5 },
    maintenance: { amount: 180000, percentage: 14.1, change: -3.2 },
    salaries: { amount: 320000, percentage: 25.0, change: 2.8 },
    insurance: { amount: 95000, percentage: 7.4, change: 1.2 },
    permits: { amount: 45000, percentage: 3.5, change: -0.8 },
    other: { amount: 186000, percentage: 14.8, change: 4.1 }
  }
};

const reportsData = [
  {
    id: 'RPT001',
    name: 'Monthly Revenue Summary',
    type: 'Financial',
    lastGenerated: '2024-01-10',
    frequency: 'Monthly',
    status: 'Ready',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: 'RPT002',
    name: 'Route Performance Analysis',
    type: 'Operations',
    lastGenerated: '2024-01-09',
    frequency: 'Weekly',
    status: 'Processing',
    size: '1.8 MB',
    format: 'Excel'
  },
  {
    id: 'RPT003',
    name: 'Driver Performance Report',
    type: 'HR',
    lastGenerated: '2024-01-08',
    frequency: 'Bi-weekly',
    status: 'Ready',
    size: '965 KB',
    format: 'PDF'
  },
  {
    id: 'RPT004',
    name: 'Vehicle Utilization Report',
    type: 'Fleet',
    lastGenerated: '2024-01-07',
    frequency: 'Weekly',
    status: 'Ready',
    size: '3.2 MB',
    format: 'CSV'
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatPercentage = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ready': return 'bg-green-100 text-green-800';
    case 'Processing': return 'bg-orange-100 text-orange-800';
    case 'Failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTransportIcon = (mode: string) => {
  switch (mode.toLowerCase()) {
    case 'road transport': return <Truck className="h-4 w-4 text-green-600" />;
    case 'air transport': return <Plane className="h-4 w-4 text-blue-600" />;
    case 'sea transport': return <Ship className="h-4 w-4 text-teal-600" />;
    default: return <RouteIcon className="h-4 w-4" />;
  }
};

export function RevenueModule() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const filteredReports = reportsData.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-green-600" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Revenue & Reports</h1>
            <p className="text-gray-600">Financial analytics, performance metrics, and custom reports</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Total Revenue</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">{formatPercentage(revenueData.overview.monthlyGrowth)}</span>
            </div>
          </div>
          <p className="text-xl font-semibold mt-2">{formatCurrency(revenueData.overview.totalRevenue)}</p>
        </Card>

        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-600">Avg per Trip</span>
          </div>
          <p className="text-xl font-semibold">{formatCurrency(revenueData.overview.avgRevenuePerTrip)}</p>
        </Card>

        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-gray-600">Profit Margin</span>
          </div>
          <p className="text-xl font-semibold text-purple-600">{revenueData.overview.profitMargin}%</p>
        </Card>

        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-gray-600">Target Progress</span>
          </div>
          <p className="text-xl font-semibold">{revenueData.overview.targetProgress}%</p>
          <Progress value={revenueData.overview.targetProgress} className="h-1 mt-2" />
        </Card>

        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <RouteIcon className="h-4 w-4 text-indigo-600" />
            <span className="text-sm text-gray-600">Active Routes</span>
          </div>
          <p className="text-xl font-semibold">24</p>
        </Card>

        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-teal-600" />
            <span className="text-sm text-gray-600">Active Drivers</span>
          </div>
          <p className="text-xl font-semibold">156</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Revenue by Transport Mode */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue by Transport Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.byTransportMode.map((mode, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTransportIcon(mode.mode)}
                          <span className="font-medium">{mode.mode}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(mode.revenue)}</p>
                          <div className="flex items-center gap-1">
                            {mode.growth >= 0 ? (
                              <ArrowUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <ArrowDown className="h-3 w-3 text-red-500" />
                            )}
                            <span className={`text-xs ${mode.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatPercentage(mode.growth)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                          style={{ width: `${mode.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{mode.trips} trips</span>
                        <span>Avg: {formatCurrency(mode.avgRevenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Routes */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Top Performing Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Efficiency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueData.byRoute.map((route, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{route.route}</p>
                            <p className="text-sm text-gray-500">{route.trips} trips</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(route.revenue)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-purple-100 text-purple-800">
                            {route.profitMargin}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{route.efficiency}%</span>
                            <div className="w-12 bg-gray-200 rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full ${
                                  route.efficiency >= 95 ? 'bg-green-500' : 
                                  route.efficiency >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${route.efficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Monthly Revenue Trend */}
            <Card className="border-0 shadow-sm xl:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trend - Last 12 Months</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {revenueData.monthlyTrend.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-green-500 to-blue-500 rounded-t hover:opacity-80 transition-opacity cursor-pointer"
                           style={{ height: `${(month.revenue / 300000) * 100}%` }}
                           title={`${month.month}: ${formatCurrency(month.revenue)}`}
                      ></div>
                      <span className="text-xs text-gray-600 mt-1">{month.month}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Total Revenue</p>
                    <p className="font-semibold">{formatCurrency(revenueData.monthlyTrend.reduce((sum, m) => sum + m.revenue, 0))}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Total Trips</p>
                    <p className="font-semibold">{revenueData.monthlyTrend.reduce((sum, m) => sum + m.trips, 0)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Total Profit</p>
                    <p className="font-semibold text-green-600">{formatCurrency(revenueData.monthlyTrend.reduce((sum, m) => sum + m.profit, 0))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Expense Breakdown */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Expense Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(revenueData.expenses).map(([category, data], index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{category}</span>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(data.amount)}</p>
                          <div className="flex items-center gap-1">
                            {data.change >= 0 ? (
                              <ArrowUp className="h-3 w-3 text-red-500" />
                            ) : (
                              <ArrowDown className="h-3 w-3 text-green-500" />
                            )}
                            <span className={`text-xs ${data.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {formatPercentage(data.change)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-400 to-orange-500 h-2 rounded-full"
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">{data.percentage}% of total expenses</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profitability Analysis */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Profitability by Route</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.byRoute.map((route, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{route.route}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          {route.profitMargin}% margin
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Revenue</p>
                          <p className="font-semibold">{formatCurrency(route.revenue)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Trips</p>
                          <p className="font-semibold">{route.trips}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Efficiency</p>
                          <p className="font-semibold">{route.efficiency}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Alerts */}
            <Card className="border-0 shadow-sm xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Performance Alerts & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2">Fuel Cost Alert</h4>
                    <p className="text-sm text-yellow-700">
                      Fuel expenses increased by 8.5% this month. Consider route optimization to reduce consumption.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Revenue Growth</h4>
                    <p className="text-sm text-green-700">
                      Sea transport revenue up 18.7%. Expand capacity to capitalize on demand.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Route Efficiency</h4>
                    <p className="text-sm text-blue-700">
                      NY-Boston route achieving 94% efficiency. Best practices can be applied to other routes.
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-800 mb-2">Air Transport Decline</h4>
                    <p className="text-sm text-red-700">
                      Air transport revenue down 2.1%. Review pricing strategy and customer satisfaction.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="fleet">Fleet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <FileText className="h-4 w-4 mr-1" />
                Generate Report
              </Button>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Generated</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.type}</Badge>
                        </TableCell>
                        <TableCell>{report.lastGenerated}</TableCell>
                        <TableCell>{report.frequency}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.size}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Quick Report Templates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium">Revenue Summary</h4>
                  <p className="text-sm text-gray-600 mt-1">Generate monthly revenue overview</p>
                  <Button size="sm" className="mt-3 w-full">Generate</Button>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <PieChart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium">Cost Analysis</h4>
                  <p className="text-sm text-gray-600 mt-1">Detailed expense breakdown report</p>
                  <Button size="sm" className="mt-3 w-full">Generate</Button>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium">Performance Trends</h4>
                  <p className="text-sm text-gray-600 mt-1">Route and driver performance analysis</p>
                  <Button size="sm" className="mt-3 w-full">Generate</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Next Quarter Projection</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Projected Revenue:</span>
                        <span className="font-semibold">{formatCurrency(890000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth Rate:</span>
                        <span className="font-semibold text-green-600">+12.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence Level:</span>
                        <span className="font-semibold">87%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium">Forecast by Transport Mode:</h5>
                    {revenueData.byTransportMode.map((mode, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          {getTransportIcon(mode.mode)}
                          <span className="text-sm">{mode.mode}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(mode.revenue * 1.123)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Market Trends & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-green-800">Growth Opportunity</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      E-commerce growth driving 15% increase in last-mile delivery demand.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium text-orange-800">Market Risk</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Fuel price volatility may impact margins by 3-5% next quarter.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-blue-800">Technology Impact</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Route optimization could improve efficiency by 8-12%.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-purple-800">Seasonal Pattern</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Q4 typically shows 20% revenue increase due to holiday shipping.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}