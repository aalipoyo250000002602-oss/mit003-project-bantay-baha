import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Settings, 
  Users, 
  Shield, 
  Bell,
  Database,
  Key,
  Globe,
  Palette,
  Download,
  Upload,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Smartphone,
  Mail,
  Clock
} from 'lucide-react';

const usersData = [
  {
    id: 'USR001',
    name: 'Alex Ali',
    email: 'alex.ali - aalipoyo_250000002602@uic.edu.ph',
    role: 'Super Admin',
    department: 'IT',
    status: 'Active',
    lastLogin: '2024-01-12 09:30',
    permissions: ['Full Access'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwwfHx8fDE3MzQyMTA0Mjh8MA&ixlib=rb-4.0.3&q=80&w=1080'
  },
  {
    id: 'USR002',
    name: 'Sarah Manager',
    email: 'sarah@company.com',
    role: 'Operations Manager',
    department: 'Operations',
    status: 'Active',
    lastLogin: '2024-01-12 08:15',
    permissions: ['Routes', 'Vehicles', 'Drivers', 'Reports'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fHx8MTczNDIxMDQ2N3ww&ixlib=rb-4.0.3&q=80&w=1080'
  },
  {
    id: 'USR003',
    name: 'Mike Supervisor',
    email: 'mike@company.com',
    role: 'Fleet Supervisor',
    department: 'Fleet',
    status: 'Active',
    lastLogin: '2024-01-11 16:45',
    permissions: ['Vehicles', 'Drivers', 'Maintenance'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwwfHx8fDE3MzQyMTA1MDF8MA&ixlib=rb-4.0.3&q=80&w=1080'
  },
  {
    id: 'USR004',
    name: 'Lisa Analyst',
    email: 'lisa@company.com',
    role: 'Data Analyst',
    department: 'Finance',
    status: 'Inactive',
    lastLogin: '2024-01-08 14:22',
    permissions: ['Reports', 'Analytics'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fHx8MTczNDIxMDUzNHww&ixlib=rb-4.0.3&q=80&w=1080'
  }
];

const systemSettings = {
  general: {
    companyName: 'TranSphere Logistics',
    timezone: 'America/New_York',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    maintenanceReminders: true,
    deliveryUpdates: true,
    lowFuelAlerts: true
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 480,
    passwordComplexity: 'High',
    loginAttempts: 3,
    dataEncryption: true
  },
  integrations: {
    gpsTracking: 'Enabled',
    paymentGateway: 'Stripe',
    weatherService: 'OpenWeather',
    mapsProvider: 'Google Maps'
  }
};

const auditLogs = [
  {
    id: 'AUD001',
    user: 'Alex Ali',
    action: 'User Created',
    target: 'Mike Supervisor',
    timestamp: '2024-01-12 10:30:15',
    ipAddress: '192.168.1.101',
    status: 'Success'
  },
  {
    id: 'AUD002',
    user: 'Sarah Manager',
    action: 'Route Updated',
    target: 'NY-Boston Express',
    timestamp: '2024-01-12 09:15:42',
    ipAddress: '192.168.1.105',
    status: 'Success'
  },
  {
    id: 'AUD003',
    user: 'System',
    action: 'Backup Created',
    target: 'Database Backup',
    timestamp: '2024-01-12 02:00:00',
    ipAddress: 'System',
    status: 'Success'
  },
  {
    id: 'AUD004',
    user: 'Lisa Analyst',
    action: 'Report Generated',
    target: 'Revenue Summary',
    timestamp: '2024-01-11 16:22:30',
    ipAddress: '192.168.1.108',
    status: 'Success'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Inactive': return 'bg-gray-100 text-gray-800';
    case 'Suspended': return 'bg-red-100 text-red-800';
    case 'Success': return 'bg-green-100 text-green-800';
    case 'Failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Super Admin': return 'bg-purple-100 text-purple-800';
    case 'Operations Manager': return 'bg-blue-100 text-blue-800';
    case 'Fleet Supervisor': return 'bg-green-100 text-green-800';
    case 'Data Analyst': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function SettingsModule() {
  const [activeTab, setActiveTab] = useState('general');
  const [selectedUser, setSelectedUser] = useState(usersData[0]);
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-gray-600" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
            <p className="text-gray-600">Configure system preferences, manage users, and monitor security</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Config
          </Button>
          <Button className="bg-gray-600 hover:bg-gray-700 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" value={systemSettings.general.companyName} readOnly />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={systemSettings.general.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">System Language</Label>
                  <Select value={systemSettings.general.language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={systemSettings.general.dateFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={systemSettings.general.currency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance & Branding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme Selection</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" className="justify-start" disabled>
                      <div className="w-4 h-4 bg-white border rounded mr-2"></div>
                      Light Mode (Default)
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload company logo</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded border-2 border-blue-700"></div>
                    <div className="w-8 h-8 bg-green-500 rounded"></div>
                    <div className="w-8 h-8 bg-purple-500 rounded"></div>
                    <div className="w-8 h-8 bg-orange-500 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">System Version</p>
                    <p className="font-semibold">v2.1.3</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Database Size</p>
                    <p className="font-semibold">847 MB</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="font-semibold">156</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Backup</p>
                    <p className="font-semibold">2024-01-12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                    <Button size="sm" className="bg-gray-600 hover:bg-gray-700">
                      <Plus className="h-4 w-4 mr-1" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersData.map((user) => (
                        <TableRow 
                          key={user.id}
                          className={`cursor-pointer hover:bg-gray-50 ${selectedUser.id === user.id ? 'bg-blue-50' : ''}`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{user.lastLogin}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-4">
                        <AvatarImage src={selectedUser.avatar} />
                        <AvatarFallback className="text-lg">
                          {selectedUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{selectedUser.name}</h3>
                      <p className="text-sm text-gray-600">{selectedUser.email}</p>
                      <Badge className={getRoleColor(selectedUser.role)} style={{ marginTop: '8px' }}>
                        {selectedUser.role}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Department</Label>
                        <p className="text-sm text-gray-700">{selectedUser.department}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(selectedUser.status)}>
                            {selectedUser.status}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Last Login</Label>
                        <p className="text-sm text-gray-700">{selectedUser.lastLogin}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Permissions</Label>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedUser.permissions.map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit User
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        Reset Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Require 2FA for all users</p>
                  </div>
                  <Switch checked={systemSettings.security.twoFactorAuth} />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" value={systemSettings.security.sessionTimeout} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>Password Complexity</Label>
                  <Select value={systemSettings.security.passwordComplexity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input type="number" value={systemSettings.security.loginAttempts} readOnly />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Encryption</Label>
                    <p className="text-sm text-gray-600">Encrypt sensitive data at rest</p>
                  </div>
                  <Switch checked={systemSettings.security.dataEncryption} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      type={showApiKey ? "text" : "password"}
                      value="sk_live_abcd1234567890..."
                      readOnly
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input value="https://api.company.com/webhooks" readOnly />
                </div>

                <div className="space-y-2">
                  <Label>Rate Limiting</Label>
                  <Select defaultValue="1000">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 requests/hour</SelectItem>
                      <SelectItem value="1000">1,000 requests/hour</SelectItem>
                      <SelectItem value="10000">10,000 requests/hour</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    Generate New API Key
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm xl:col-span-2">
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">SSL Certificate</span>
                    </div>
                    <p className="text-sm text-green-700">Valid until Dec 2024</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Firewall Status</span>
                    </div>
                    <p className="text-sm text-green-700">Active and configured</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Security Scan</span>
                    </div>
                    <p className="text-sm text-yellow-700">Last scan: 7 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch checked={systemSettings.notifications.emailAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label>SMS Alerts</Label>
                      <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
                    </div>
                  </div>
                  <Switch checked={systemSettings.notifications.smsAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-600">Browser push notifications</p>
                    </div>
                  </div>
                  <Switch checked={systemSettings.notifications.pushNotifications} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Alert Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Reminders</Label>
                    <p className="text-sm text-gray-600">Vehicle maintenance schedules</p>
                  </div>
                  <Switch checked={systemSettings.notifications.maintenanceReminders} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Delivery Updates</Label>
                    <p className="text-sm text-gray-600">Real-time delivery status</p>
                  </div>
                  <Switch checked={systemSettings.notifications.deliveryUpdates} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Low Fuel Alerts</Label>
                    <p className="text-sm text-gray-600">Vehicle fuel level warnings</p>
                  </div>
                  <Switch checked={systemSettings.notifications.lowFuelAlerts} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm xl:col-span-2">
              <CardHeader>
                <CardTitle>Notification Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Delivery Confirmation</Label>
                      <Textarea 
                        placeholder="Your package has been delivered successfully..."
                        className="h-20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Maintenance Alert</Label>
                      <Textarea 
                        placeholder="Vehicle maintenance is due in 3 days..."
                        className="h-20"
                      />
                    </div>
                  </div>
                  <Button>Save Templates</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Active Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(systemSettings.integrations).map(([integration, status], index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{integration.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-sm text-gray-600">Status: {status}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={status === 'Enabled' ? getStatusColor('Active') : getStatusColor('Inactive')}>
                        {status}
                      </Badge>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Available Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'QuickBooks', type: 'Accounting', description: 'Financial data sync' },
                  { name: 'Salesforce', type: 'CRM', description: 'Customer management' },
                  { name: 'Slack', type: 'Communication', description: 'Team notifications' },
                  { name: 'Microsoft Teams', type: 'Communication', description: 'Video conferencing' }
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg border-dashed">
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                      <Badge variant="outline" className="text-xs mt-1">{integration.type}</Badge>
                    </div>
                    <Button size="sm">Connect</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}