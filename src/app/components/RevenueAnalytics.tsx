import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';

const monthlyRevenueData = [
  { month: 'Jan', revenue: 120000 },
  { month: 'Feb', revenue: 135000 },
  { month: 'Mar', revenue: 148000 },
  { month: 'Apr', revenue: 162000 },
  { month: 'May', revenue: 151000 },
  { month: 'Jun', revenue: 179000 },
];

const transportModeData = [
  { mode: 'Road', revenue: 450000, color: '#10B981' },
  { mode: 'Air', revenue: 320000, color: '#3B82F6' },
  { mode: 'Sea', revenue: 275000, color: '#14B8A6' },
];

const topRoutesData = [
  { route: 'NY → LA', revenue: 89000 },
  { route: 'Chicago → Miami', revenue: 76000 },
  { route: 'Seattle → Denver', revenue: 64000 },
  { route: 'Boston → DC', revenue: 58000 },
  { route: 'Dallas → Houston', revenue: 52000 },
];

export function RevenueAnalytics() {
  const totalRevenue = transportModeData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Revenue Trend */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Monthly Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid key="grid-monthly" strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis key="xaxis-monthly" dataKey="month" stroke="#6B7280" />
              <YAxis key="yaxis-monthly" stroke="#6B7280" tickFormatter={(value) => `$${value / 1000}K`} />
              <Tooltip key="tooltip-monthly" formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Line
                key="line-revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Transport Mode */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Revenue by Transport Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                key="pie-transport-mode"
                data={transportModeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="revenue"
              >
                {transportModeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip key="tooltip-transport-pie" formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {transportModeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-700">{item.mode}</span>
                </div>
                <div className="text-sm font-medium">
                  ${item.revenue.toLocaleString()} ({Math.round((item.revenue / totalRevenue) * 100)}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Routes */}
      <Card className="border-gray-200 lg:col-span-2">
        <CardHeader>
          <CardTitle>Top Performing Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topRoutesData} layout="horizontal">
              <CartesianGrid key="grid-routes" strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis key="xaxis-routes" type="number" stroke="#6B7280" tickFormatter={(value) => `$${value / 1000}K`} />
              <YAxis key="yaxis-routes" dataKey="route" type="category" stroke="#6B7280" width={100} />
              <Tooltip key="tooltip-routes" formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Bar key="bar-revenue" dataKey="revenue" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}