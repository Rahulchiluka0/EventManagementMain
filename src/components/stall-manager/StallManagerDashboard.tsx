import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Calendar, DollarSign, TrendingUp, Package, Users, ArrowUpRight, Download, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const earningsData = [
  { month: "Jan", earnings: 1200, bookings: 8 },
  { month: "Feb", earnings: 1800, bookings: 12 },
  { month: "Mar", earnings: 2200, bookings: 15 },
  { month: "Apr", earnings: 1600, bookings: 10 },
  { month: "May", earnings: 2400, bookings: 18 },
  { month: "Jun", earnings: 2100, bookings: 14 },
];

const recentBookings = [
  { id: 1, eventName: "Summer Food Festival", customerName: "John Smith", date: "2023-06-15", amount: "$350" },
  { id: 2, eventName: "Craft Market", customerName: "Emily Johnson", date: "2023-06-12", amount: "$275" },
  { id: 3, eventName: "Tech Expo", customerName: "Michael Brown", date: "2023-06-10", amount: "$425" },
];

const StallManagerDashboard = () => {
  return (
    <div className="space-y-8 pb-8 ml-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to your Stall Dashboard</h1>
        <p className="text-gray-600">Manage your stalls and track your performance across events.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Stalls</CardTitle>
            <div className="bg-red-50 p-2 rounded-full">
              <Store className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">3</div>
            <div className="flex items-center mt-1">
              <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-200 border-0">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +1
              </Badge>
              <p className="text-xs text-gray-500 ml-2">across 2 events</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming Events</CardTitle>
            <div className="bg-blue-50 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">2</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs font-normal text-gray-600 border-gray-200">
                Next in 5 days
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
            <div className="bg-green-50 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">$11,300</div>
            <div className="flex items-center mt-1">
              <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-200 border-0">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                15%
              </Badge>
              <p className="text-xs text-gray-500 ml-2">from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg. Booking Value</CardTitle>
            <div className="bg-purple-50 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">$350</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs font-normal text-gray-600 border-gray-200">
                32 total bookings
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">Earnings Overview</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Monthly earnings performance</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D40915" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#D40915" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb'
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#D40915"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">Recent Bookings</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Latest stall reservations</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-red-50 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                    <Store className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{booking.eventName}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{booking.customerName}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="ml-2 text-right">
                    <div className="text-sm font-medium text-gray-800">{booking.amount}</div>
                    <div className="text-xs text-gray-500">Booking fee</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stall Performance */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">Stall Performance</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Revenue by stall type</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-blue-50 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Food Stall</h4>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div className="ml-2 text-right">
                  <div className="text-sm font-medium text-gray-800">$5,600</div>
                  <div className="text-xs text-gray-500">70% of total</div>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-purple-50 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Craft Stall</h4>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div className="ml-2 text-right">
                  <div className="text-sm font-medium text-gray-800">$3,200</div>
                  <div className="text-xs text-gray-500">20% of total</div>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-green-50 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Merchandise Stall</h4>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
                <div className="ml-2 text-right">
                  <div className="text-sm font-medium text-gray-800">$2,500</div>
                  <div className="text-xs text-gray-500">10% of total</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">Upcoming Events</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Events where you have stalls</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            View Calendar
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-red-50 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Summer Food Festival</h4>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Jun 15, 2023</span>
                  <span className="mx-2">•</span>
                  <Store className="h-3 w-3 mr-1" />
                  <span>2 stalls</span>
                </div>
              </div>
              <Badge className="ml-2 bg-red-50 text-red-600 hover:bg-red-100 border-0">
                5 days
              </Badge>
            </div>

            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-blue-50 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Craft Market</h4>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Jun 22, 2023</span>
                  <span className="mx-2">•</span>
                  <Store className="h-3 w-3 mr-1" />
                  <span>1 stall</span>
                </div>
              </div>
              <Badge className="ml-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border-0">
                12 days
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            >
              <Store className="h-6 w-6 text-red-600" />
              <span>Create Stall</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            >
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>Browse Events</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            >
              <Users className="h-6 w-6 text-green-600" />
              <span>View Bookings</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            >
              <Download className="h-6 w-6 text-purple-600" />
              <span>Export Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips & Resources */}
      <Card className="bg-gradient-to-r from-red-50 to-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">Tips for Stall Success</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="bg-red-50 p-2 rounded-lg mr-3">
                  <Store className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-medium text-gray-800">Stall Presentation</h3>
              </div>
              <p className="text-sm text-gray-600">
                Create an eye-catching display that showcases your products effectively and attracts visitors from a distance.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800">Customer Engagement</h3>
              </div>
              <p className="text-sm text-gray-600">
                Engage with visitors, offer samples or demonstrations, and collect contact information for future marketing.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="bg-green-50 p-2 rounded-lg mr-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-800">Pricing Strategy</h3>
              </div>
              <p className="text-sm text-gray-600">
                Set competitive prices and consider offering event-specific promotions or bundle deals to increase sales.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StallManagerDashboard;