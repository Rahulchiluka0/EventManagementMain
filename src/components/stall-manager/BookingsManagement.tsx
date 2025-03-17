import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, DollarSign, Check, X, Filter, ArrowUpDown, Clock, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockBookings = [
  {
    id: 1,
    customerName: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 234 567 890",
    stallName: "Food Corner A12",
    event: "Summer Food Festival 2024",
    date: "2024-06-15",
    amount: "$500",
    status: "confirmed",
  },
  {
    id: 2,
    customerName: "Alice Johnson",
    email: "alice.j@example.com",
    phone: "+1 234 567 891",
    stallName: "Craft Booth B5",
    event: "Artisan Market",
    date: "2024-07-20",
    amount: "$450",
    status: "pending",
  },
];

const BookingsManagement = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const filteredBookings = mockBookings
    .filter(booking => filter === "all" || booking.status === filter)
    .filter(booking =>
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.stallName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.event.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 flex items-center gap-1 px-2.5 py-1">
            <Check className="h-3 w-3" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-0 flex items-center gap-1 px-2.5 py-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0 flex items-center gap-1 px-2.5 py-1">
            <X className="h-3 w-3" />
            Cancelled
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 pb-8 ml-4">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Bookings Management</h1>
            <p className="text-gray-600">Manage and track all your stall bookings</p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Export Bookings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Stall Bookings</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  className="pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-gray-200">
                  <div className="flex items-center">
                    <ArrowUpDown className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Sort by</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="name">Customer Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <div className="px-6 pt-4">
            <TabsList className="bg-gray-100/80 p-1 rounded-lg">
              <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                All Bookings
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                Confirmed
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                Pending
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="pt-6">
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg flex-shrink-0 ${booking.status === "confirmed" ? "bg-green-50" :
                          booking.status === "pending" ? "bg-yellow-50" : "bg-red-50"
                          }`}>
                          <User className={`h-6 w-6 ${booking.status === "confirmed" ? "text-green-600" :
                            booking.status === "pending" ? "text-yellow-600" : "text-red-600"
                            }`} />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-medium text-gray-800 text-lg">{booking.customerName}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                              <div className="flex items-center">
                                <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                <span>{booking.email}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                <span>{booking.phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                              <span>{booking.stallName}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                              <span>{booking.event} • {new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center mt-4 md:mt-0 space-y-3 md:space-y-0 md:space-x-4 md:ml-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-medium text-gray-800">{booking.amount}</span>
                        </div>
                        <div className="flex flex-col items-start md:items-end space-y-2">
                          <div>{getStatusBadge(booking.status)}</div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                              disabled={booking.status === "confirmed"}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No bookings found</h3>
                    <p className="text-gray-500 max-w-md mb-6">
                      {searchQuery
                        ? "No bookings match your search criteria. Try a different search term."
                        : "You don't have any bookings yet."}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="confirmed" className="mt-0">
              <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-lg flex-shrink-0 bg-green-50">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-medium text-gray-800 text-lg">{booking.customerName}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                              <div className="flex items-center">
                                <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                <span>{booking.email}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                <span>{booking.phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                              <span>{booking.stallName}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                              <span>{booking.event} • {new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center mt-4 md:mt-0 space-y-3 md:space-y-0 md:space-x-4 md:ml-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-medium text-gray-800">{booking.amount}</span>
                        </div>
                        <div className="flex flex-col items-start md:items-end space-y-2">
                          <div>{getStatusBadge(booking.status)}</div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No confirmed bookings</h3>
                    <p className="text-gray-500 max-w-md mb-6">
                      You don't have any confirmed bookings yet.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <div className="space-y-4">
                {filteredBookings.filter(booking => booking.status === "pending").length > 0 ? (
                  filteredBookings
                    .filter(booking => booking.status === "pending")
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="p-3 rounded-lg flex-shrink-0 bg-yellow-50">
                            <User className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-medium text-gray-800 text-lg">{booking.customerName}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                                <div className="flex items-center">
                                  <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                  <span>{booking.email}</span>
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                  <span>{booking.phone}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                <span>{booking.stallName}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                <span>{booking.event} • {new Date(booking.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center mt-4 md:mt-0 space-y-3 md:space-y-0 md:space-x-4 md:ml-4">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                            <span className="font-medium text-gray-800">{booking.amount}</span>
                          </div>
                          <div className="flex flex-col items-start md:items-end space-y-2">
                            <div>{getStatusBadge(booking.status)}</div>
                            <div className="flex space-x-2">
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-sm"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No pending bookings</h3>
                    <p className="text-gray-500 max-w-md mb-6">
                      You don't have any pending bookings that need confirmation.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Booking Analytics */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">Booking Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Conversion Rate</h3>
                <div className="bg-green-50 p-2 rounded-lg">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">78%</div>
              <p className="text-sm text-gray-600">
                Percentage of inquiries that convert to confirmed bookings
              </p>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Average Value</h3>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">$475</div>
              <p className="text-sm text-gray-600">
                Average booking value across all stalls
              </p>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Response Time</h3>
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">4.2 hrs</div>
              <p className="text-sm text-gray-600">
                Average time to respond to booking inquiries
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Feedback */}
      <Card className="bg-gradient-to-r from-red-50 to-white border border-gray-100 shadow-sm mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">Customer Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-medium text-gray-700">JS</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-800">John Smith</h3>
                    <div className="flex ml-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    "Great experience booking the stall. The process was smooth and the staff was very helpful."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Food Corner A12 • Summer Food Festival 2024</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-medium text-gray-700">AJ</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-800">Alice Johnson</h3>
                    <div className="flex ml-2">
                      {[1, 2, 3, 4].map((star) => (
                        <svg key={star} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <svg className="h-4 w-4 text-gray-300 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    "The booking process was good, but I would have liked more information about the stall location."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Craft Booth B5 • Artisan Market</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div >
  );
};

export default BookingsManagement;