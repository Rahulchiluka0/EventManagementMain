import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  ArrowLeft,
  Building,
  Info,
  BarChart,
  Image,
  Clock,
  Tag,
  ChevronRight,
  Edit,
  BookOpen,
  Trash2,
  Download,
  Tickets
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EventService } from "@/lib/api";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define TypeScript interface for event details
interface EventDetail {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  banner_image: string;
  max_capacity: number;
  price: string;
  is_published: boolean;
  verification_status: string;
  organizer_id: string;
  organizer_name: string;
  created_at: string;
  updated_at: string;
  images: Array<{
    id: string;
    image_url: string;
  }>;
  booking_count?: number;
  total_revenue?: string;
}

// Update the EventDetail interface to include stalls
interface EventDetail {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  banner_image: string;
  max_capacity: number;
  current_capacity: number;
  price: string;
  is_published: boolean;
  verification_status: string;
  organizer_id: string;
  organizer_name: string;
  created_at: string;
  updated_at: string;
  images: Array<{
    id: string;
    image_url: string;
  }>;
  stats?: {
    totalBookings: number;
    totalTicketSold: number;
    totalRevenue: number;
    uniqueAttendees: number;
  }
  stalls?: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    size: string;
    location_in_venue: string;
    is_available: boolean;
    created_at: string;
    updated_at: string;
    event_id: string;
  }>;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        const response = await EventService.getOrganiserEventById(id!);
        setEventDetail(response.data.event);
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetail();
    }
  }, [id, toast]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "p");
    } catch (error) {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-500 text-sm font-medium">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="pt-12 pb-12">
            <div className="text-center py-8">
              <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info className="h-10 w-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Event Not Found</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                The event you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button
                onClick={() => navigate("/organizer/events")}
                className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                Back to My Events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-0";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-0";
      default:
        return "bg-red-100 text-red-800 hover:bg-red-200 border-0";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          onClick={() => navigate("/organizer/events")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Events
        </Button>
      </div>

      {/* Event Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{eventDetail.title}</h1>
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(eventDetail.start_date)}</span>
              <span className="mx-1">•</span>
              <MapPin className="h-4 w-4" />
              <span>{eventDetail.location}</span>
            </div>
          </div>
          <Badge className={`${getStatusColor(eventDetail.verification_status)} text-sm py-1 px-3`}>
            {eventDetail.verification_status.charAt(0).toUpperCase() + eventDetail.verification_status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Event Info */}
        <Card className="md:col-span-2 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="border-b border-gray-50 pb-6">
            <CardTitle className="text-xl font-semibold text-gray-800">Event Details</CardTitle>
            <CardDescription className="text-gray-500">Complete information about your event</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-6 bg-gray-50 p-1 rounded-lg">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  Event Details
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  Images
                </TabsTrigger>
                <TabsTrigger
                  value="stalls"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  Stalls
                </TabsTrigger>
              </TabsList>

              {/* Existing TabsContent for details */}
              <TabsContent value="details" className="space-y-8 mt-2">
                <div className="bg-gray-50/50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {eventDetail.description || "No description provided"}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Event Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Tag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Event Type</div>
                        <div className="text-gray-600 mt-1">
                          {eventDetail.event_type}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-green-50 p-2 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Price</div>
                        <div className="text-gray-600 mt-1">
                          ${parseFloat(eventDetail.price).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Date</div>
                        <div className="text-gray-600 mt-1">
                          {formatDate(eventDetail.start_date)} - {formatDate(eventDetail.end_date)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Time</div>
                        <div className="text-gray-600 mt-1">
                          {formatTime(eventDetail.start_date)} - {formatTime(eventDetail.end_date)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-amber-50 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Location</div>
                        <div className="text-gray-600 mt-1">{eventDetail.location}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Capacity</div>
                        <div className="text-gray-600 mt-1">
                          {eventDetail.max_capacity || "Unlimited"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6 bg-gray-100" />

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Address</h3>
                  <div className="bg-gray-50/50 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <Building className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="text-gray-600">
                        {eventDetail.address}, <br />
                        {eventDetail.city}, {eventDetail.state}, <br />
                        {eventDetail.country} {eventDetail.zip_code}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-6 mt-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Banner Image</h3>
                  {eventDetail.banner_image ? (
                    <div className="rounded-xl overflow-hidden h-64 bg-gray-100 shadow-sm">
                      <img
                        src={`http://localhost:3000/uploads/${eventDetail.banner_image}`}
                        alt="Event Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="text-center">
                        <Image className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-400">No banner image available</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Additional Images</h3>
                  <div className="flex items-center justify-center h-40 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-center">
                      <Image className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400">No additional images available</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              {/* New TabsContent for stalls */}
              <TabsContent value="stalls" className="space-y-6 mt-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Stalls Information</h3>

                  {eventDetail.stalls && eventDetail.stalls.length > 0 ? (
                    <div className="space-y-6">
                      {eventDetail.stalls.map((stall) => (
                        <Card key={stall.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg font-semibold text-gray-800">{stall.name}</CardTitle>
                              <Badge className={stall.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {stall.is_available ? "Available" : "Booked"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-start gap-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                  <Info className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-700">Description</div>
                                  <div className="text-gray-600 mt-1">
                                    {stall.description || "No description provided"}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <div className="bg-green-50 p-2 rounded-lg">
                                  <DollarSign className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-700">Registration Fees</div>
                                  <div className="text-gray-600 mt-1">
                                    ${parseFloat(stall.price).toFixed(2)}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <div className="bg-purple-50 p-2 rounded-lg">
                                  <MapPin className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-700">Location in Venue</div>
                                  <div className="text-gray-600 mt-1">
                                    {stall.location_in_venue || "Not specified"}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <div className="bg-amber-50 p-2 rounded-lg">
                                  <Tag className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-700">Size</div>
                                  <div className="text-gray-600 mt-1">
                                    {stall.size || "Not specified"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-xs text-gray-500 mt-4">
                              <div>Created: {formatDate(stall.created_at)}</div>
                              <div>Last Updated: {formatDate(stall.updated_at)}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <Building className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No Stalls Available</h3>
                      <p className="text-gray-500 text-center max-w-md">
                        This event doesn't have any stalls configured. You can add stalls when editing the event.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-6 border-gray-200 text-gray-700 hover:bg-gray-50"
                        onClick={() => navigate(`/organizer/events/edit/${eventDetail.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Event
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          {/* <CardFooter className="border-t border-gray-50 pt-6 flex justify-end gap-4">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={() => navigate(`/organizer/events/edit/${eventDetail.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => navigate(`/organizer/events/${eventDetail.id}/bookings`)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View Bookings
            </Button>
          </CardFooter> */}
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Status */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-lg font-semibold text-gray-800">Event Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Publication Status</span>
                  <Badge className={eventDetail.is_published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {eventDetail.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Verification</span>
                  <Badge className={getStatusColor(eventDetail.verification_status)}>
                    {eventDetail.verification_status.charAt(0).toUpperCase() + eventDetail.verification_status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created On</span>
                  <span className="text-gray-800 font-medium">{formatDate(eventDetail.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-800 font-medium">{formatDate(eventDetail.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Stats */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-lg font-semibold text-gray-800">Event Statistics</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Bookings</div>
                    <div className="text-xl font-bold text-gray-800">{eventDetail.stats.totalBookings || 0}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Tickets className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Tickets Sold</div>
                    <div className="text-xl font-bold text-gray-800">{eventDetail.stats.totalTicketSold || 0}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-50 p-3 rounded-full mr-4">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Revenue</div>
                    <div className="text-xl font-bold text-gray-800">${eventDetail.stats.totalRevenue || "0.00"}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-50 p-3 rounded-full mr-4">
                    <BarChart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Capacity Filled</div>
                    <div className="text-xl font-bold text-gray-800">
                      {eventDetail.current_capacity && eventDetail.max_capacity
                        ? `${Math.round((eventDetail.current_capacity / eventDetail.max_capacity) * 100)}%`
                        : "0%"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => navigate(`/organizer/events/edit/${eventDetail.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
                {/* <Button
                  variant="outline"
                  className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => navigate(`/organizer/events/${eventDetail.id}/bookings`)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Bookings
                </Button> */}
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Event
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Organizer Info */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-lg font-semibold text-gray-800">Organizer</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                  <span className="font-medium text-gray-700">
                    {eventDetail.organizer_name ? eventDetail.organizer_name.charAt(0).toUpperCase() : "O"}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">{eventDetail.organizer_name}</div>
                  <div className="text-sm text-gray-500">Event Organizer</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
};

export default EventDetail;