import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Ticket, Bell, User, ArrowRight, Download, Activity, Star, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DashboardService, BookingService, UserService } from "../../lib/api";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add interface for bookings
interface Booking {
  id: string;
  event_id: string;
  event_title: string;
  booking_date: string;
  status: string;
  ticket_type?: string;
  quantity?: number;
  total_price: number;
  location?: string;
  start_date?: string;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await DashboardService.getUserStats();
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserBookings = async () => {
      try {
        setBookingsLoading(true);
        const response = await BookingService.getUserBookings();
        // Make sure bookings is always an array
        setBookings(Array.isArray(response.data) ? response.data :
          (response.data.bookings || []));
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        setBookings([]);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchDashboardData();
    fetchUserBookings();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await UserService.getUserProfile();
        const userData = response.data.user;
        setProfile(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col items-center backdrop-blur-sm bg-white/30 p-10 rounded-2xl shadow-sm">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary mb-6"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 bg-gradient-to-b from-gray-50 to-white min-h-screen px-4 sm:px-6">
      {/* Welcome Section */}
      <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-gray-100 shadow-lg mt-8 max-w-7xl mx-auto transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Welcome to Your Dashboard</h1>
            <p className="text-gray-600 text-lg">Track your events, bookings, and activities</p>
          </div>
          {dashboardData?.unreadNotifications > 0 && (
            <div className="mt-6 md:mt-0 flex items-center">
              <Badge className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-1 px-4 py-2 text-sm rounded-full shadow-md">
                <Bell className="h-4 w-4 mr-1.5" />
                {dashboardData.unreadNotifications} unread notifications
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <Card className="backdrop-blur-sm bg-white/80 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Bookings</CardTitle>
              <div className="bg-blue-50 p-3 rounded-full shadow-inner">
                <Ticket className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-800">{dashboardData?.bookingStats.confirmed_bookings || 0}</div>
              <p className="text-sm text-gray-500 mt-2">Across all events</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">Upcoming Events</CardTitle>
              <div className="bg-green-50 p-3 rounded-full shadow-inner">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-800">{dashboardData?.upcomingEvents?.length || 0}</div>
              <p className="text-sm text-gray-500 mt-2">Events you're attending</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Spent</CardTitle>
              <div className="bg-purple-50 p-3 rounded-full shadow-inner">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-800">${dashboardData?.totalSpent || 0}</div>
              <p className="text-sm text-gray-500 mt-2">On tickets and bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column - Upcoming Events */}
          <div className="md:col-span-2 space-y-8">
            <Card className="backdrop-blur-sm bg-white/80 border border-gray-100 shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <CardTitle className="text-2xl font-semibold text-gray-800">Upcoming Events</CardTitle>
                  <p className="text-gray-500 mt-1">Events you're attending soon</p>
                </div>
                <Link to="/events">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-colors rounded-lg"
                  >
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-5">
                  {dashboardData?.upcomingEvents?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center backdrop-blur-sm bg-white/30 rounded-xl">
                      <div className="bg-gray-50 p-6 rounded-full mb-6 shadow-inner">
                        <Calendar className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-3">No upcoming events</h3>
                      <p className="text-gray-600 max-w-md mb-8">
                        You don't have any upcoming events. Browse our events to find something you'll enjoy!
                      </p>
                      <Link to="/events">
                        <Button className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md rounded-full px-6 py-2.5 transition-all duration-300">
                          Browse Events
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    dashboardData?.upcomingEvents?.map((event: any) => (
                      <div
                        key={event.booking_id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl border border-gray-100 backdrop-blur-sm bg-white/60 hover:bg-white/90 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <div className="flex items-start space-x-5">
                          <div className="p-4 rounded-xl flex-shrink-0 bg-blue-50 shadow-inner">
                            <Calendar className="h-7 w-7 text-blue-600" />
                          </div>
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">{event.title}</h3>
                              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 mt-2">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>{formatDate(event.start_date)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>{formatTime(event.start_date)}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-5 md:mt-0 md:ml-4">
                          <Link to={`/events/${event.event_id}`}>
                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md rounded-lg px-5 py-2.5 transition-all duration-300">
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile & Recent Bookings */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="backdrop-blur-sm bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden">
              <CardContent className="pt-8 pb-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center mb-5 shadow-inner border-4 border-white">
                    <User className="h-12 w-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{profile?.first_name + " " + profile?.last_name || "User"}</h3>
                  <p className="text-gray-500 mb-6">{profile?.email || "user@example.com"}</p>

                  <div className="w-full mt-2 space-y-3">
                    <Link to="/profile">
                      <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg py-2.5 transition-all duration-300">
                        Edit Profile
                      </Button>
                    </Link>
                    <Link to="/settings">
                      <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg py-2.5 transition-all duration-300">
                        Account Settings
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="backdrop-blur-sm bg-white/80 border border-gray-100 shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-xl font-semibold text-gray-800">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="bg-gray-100/70 p-1 rounded-lg w-full mb-4">
                    <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="confirmed" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                      Confirmed
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                      Pending
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-2">
                    {bookingsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="bg-gray-50 p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center shadow-inner">
                          <Ticket className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No bookings yet</h3>
                        <p className="text-gray-600 text-sm mb-6">
                          You haven't made any bookings yet
                        </p>
                        <Link to="/events">
                          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md rounded-lg px-5 py-2 transition-all duration-300">
                            Browse Events
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {bookings.map((booking) => (
                          <Link to={`/bookings/${booking.id}`} key={booking.id}>
                            <div className="p-4 rounded-lg border border-gray-100 backdrop-blur-sm bg-white/60 hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-50' :
                                  booking.status === 'cancelled' ? 'bg-red-50' : 'bg-yellow-50'
                                  }`}>
                                  <Ticket className={`h-5 w-5 ${booking.status === 'confirmed' ? 'text-green-500' :
                                    booking.status === 'cancelled' ? 'text-red-500' : 'text-yellow-500'
                                    }`} />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-800 text-sm">{booking.event_title}</h4>
                                  <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{formatDate(booking.start_date || booking.booking_date)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Badge className={`mr-3 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {booking.status}
                                </Badge>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="confirmed" className="mt-2">
                    {bookingsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : bookings.filter(b => b.status === 'confirmed').length === 0 ? (
                      <div className="text-center py-8">
                        <div className="bg-gray-50 p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center shadow-inner">
                          <Ticket className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No confirmed bookings</h3>
                        <p className="text-gray-600 text-sm mb-6">
                          You don't have any confirmed bookings yet
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {bookings
                          .filter(booking => booking.status === 'confirmed')
                          .map((booking) => (
                            <Link to={`/bookings/${booking.id}`} key={booking.id}>
                              <div className="p-4 rounded-lg border border-gray-100 backdrop-blur-sm bg-white/60 hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2.5 rounded-full bg-green-50">
                                    <Ticket className="h-5 w-5 text-green-500" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-800 text-sm">{booking.event_title}</h4>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>{formatDate(booking.start_date || booking.booking_date)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Badge className="mr-3 bg-green-100 text-green-800">
                                    {booking.status}
                                  </Badge>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </Link>
                          ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="pending" className="mt-2">
                    {bookingsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : bookings.filter(b => b.status === 'pending').length === 0 ? (
                      <div className="text-center py-8">
                        <div className="bg-gray-50 p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center shadow-inner">
                          <Ticket className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No pending bookings</h3>
                        <p className="text-gray-600 text-sm mb-6">
                          You don't have any pending bookings
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {bookings
                          .filter(booking => booking.status === 'pending')
                          .map((booking) => (
                            <Link to={`/bookings/${booking.id}`} key={booking.id}>
                              <div className="p-4 rounded-lg border border-gray-100 backdrop-blur-sm bg-white/60 hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2.5 rounded-full bg-yellow-50">
                                    <Ticket className="h-5 w-5 text-yellow-500" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-800 text-sm">{booking.event_title}</h4>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>{formatDate(booking.start_date || booking.booking_date)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Badge className="mr-3 bg-yellow-100 text-yellow-800">
                                    {booking.status}
                                  </Badge>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </Link>
                          ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;