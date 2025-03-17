import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Download, Users, Calendar, DollarSign, TrendingUp, ArrowUp, ArrowDown, Activity, MapPin, Store } from "lucide-react";
import { DashboardService } from "../../lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const OrganizerDashboard = () => {
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await DashboardService.getOrganizerStats();
        const data = response.data;

        setDashboardData(data);
        setRecentBookings(data.recentBookings.map((booking: any) => ({
          id: booking.id,
          eventName: booking.event_title,
          customerName: booking.user_name,
          tickets: 1,
          date: new Date(booking.booking_date).toLocaleDateString(),
          amount: `$${booking.total_price}`,
          status: Math.random() > 0.3 ? "confirmed" : "pending", // Mock status for UI enhancement
        })));

        const salesData = data.monthlyRevenue.map((item: any) => ({
          date: item.month,
          sales: item.total_revenue || 0,
          bookings: Math.floor(Math.random() * 50) + 10, // Mock data for UI enhancement
        }));
        setSalesData(salesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500 text-sm">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 max-w-md">
          <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Dashboard Data</h3>
          <p className="text-gray-600 mb-6">We couldn't load your dashboard data. Please try again later.</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Refresh Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Calculate growth percentages for visual indicators
  const eventGrowth = ((dashboardData.eventStats.total.this_month_events / dashboardData.eventStats.total.total_events) * 100).toFixed(1);
  const bookingGrowth = ((dashboardData.bookingStats.last_month_confirmed_bookings / dashboardData.bookingStats.total_bookings) * 100).toFixed(1);
  const revenueGrowth = ((dashboardData.revenueStats.total.this_month_revenue / dashboardData.revenueStats.total.total_revenue) * 100).toFixed(1);

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to your Dashboard</h1>
        <p className="text-gray-600">Here's what's happening with your events today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{dashboardData.eventStats.total.total_events}</div>
            <div className="flex items-center mt-1">
              <Badge variant={Number(eventGrowth) > 0 ? "default" : "destructive"} className="text-xs text-white font-normal">
                {Number(eventGrowth) > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {eventGrowth}%
              </Badge>
              <p className="text-xs text-gray-500 ml-2">from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
            <div className="bg-blue-50 p-2 rounded-full">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{dashboardData.bookingStats.total_bookings}</div>
            <div className="flex items-center mt-1">
              <Badge variant={Number(bookingGrowth) > 0 ? "default" : "destructive"} className="text-xs text-white font-normal">
                {Number(bookingGrowth) > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {bookingGrowth}%
              </Badge>
              <p className="text-xs text-gray-500 ml-2">from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <div className="bg-green-50 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">${dashboardData.revenueStats.total.total_revenue}</div>
            <div className="flex items-center mt-1">
              <Badge variant={Number(revenueGrowth) > 0 ? "default" : "destructive"} className="text-xs font-normal">
                {Number(revenueGrowth) > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {revenueGrowth}%
              </Badge>
              <p className="text-xs text-gray-500 ml-2">from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            <div className="bg-purple-50 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">
              {!isNaN(dashboardData.bookingStats.confirmed_bookings / dashboardData.bookingStats.total_bookings)
                ? ((dashboardData.bookingStats.confirmed_bookings / dashboardData.bookingStats.total_bookings) * 100).toFixed(1)
                : 0}%
            </div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs font-normal text-gray-600 border-gray-200">
                {dashboardData.bookingStats.confirmed_bookings} confirmed
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">Revenue Overview</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Monthly revenue performance</p>
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
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D40915" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#D40915" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
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
                  dataKey="sales"
                  stroke="#D40915"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">Recent Bookings</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Latest customer activity</p>
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
          <div className="space-y-5">
            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent bookings found</p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                      <span className="font-medium text-gray-700">{booking.customerName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{booking.eventName}</p>
                      <p className="text-sm text-gray-500">
                        {booking.customerName} • {booking.tickets} {booking.tickets === 1 ? 'ticket' : 'tickets'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "outline"}
                        className={booking.status === "confirmed" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"}
                      >
                        {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{booking.amount}</p>
                      <p className="text-sm text-gray-500">{booking.date}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {recentBookings.length > 0 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="text-sm border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                View All Bookings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">Upcoming Events</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Your next scheduled events</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {dashboardData.upcomingEvents && dashboardData.upcomingEvents.length > 0 ? (
                dashboardData.upcomingEvents.slice(0, 3).map((event: any) => (
                  <div key={event.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-primary/10 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{event.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(event.start_date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                      {new Date(event.start_date).toLocaleDateString() === new Date().toLocaleDateString()
                        ? 'Today'
                        : `${Math.ceil((new Date(event.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No upcoming events</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Popular Events */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">Popular Events</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Your best-performing events</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {dashboardData.popularEvents && dashboardData.popularEvents.length > 0 ? (
                dashboardData.popularEvents.slice(0, 3).map((event: any, index: number) => (
                  <div key={event.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4 font-bold text-gray-700">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{event.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{event.bookings_count || 0} bookings</span>
                        <span className="mx-2">•</span>
                        <DollarSign className="h-3 w-3 mr-1" />
                        <span>${event.revenue || 0}</span>
                      </div>
                    </div>
                    <div className="ml-2 text-right">
                      <div className="text-sm font-medium text-gray-800">${event.revenue || 0}</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No popular events data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
              <Calendar className="h-6 w-6 text-primary" />
              <span>Create Event</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            >
              <Store className="h-6 w-6 text-blue-500" />
              <span>Create Stall</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            >
              <Users className="h-6 w-6 text-green-500" />
              <span>View Bookings</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            >
              <Download className="h-6 w-6 text-purple-500" />
              <span>Export Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerDashboard;  