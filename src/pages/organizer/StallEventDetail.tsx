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
  Edit,
  BookOpen,
  Plus,
  Store,
  Layers,
  CheckCircle,
  XCircle,
  Download,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StallService } from "@/lib/api";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define TypeScript interface for stall event details
interface StallEventDetail {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  banner_image: string;
  organizer_id: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  stalls: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    size: string;
    location_in_venue: string;
    is_available: boolean;
  }>;
}

const StallEventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [eventDetail, setEventDetail] = useState<StallEventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await StallService.getOrganiserStallEventById(id!);
        console.log("API Response:", response); // Log the response
        if (response && response.data) {
          setEventDetail(response.data.stallEvent);
        } else {
          throw new Error("Invalid response structure");
        }
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
                The stall event you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button
                onClick={() => navigate("/organizer/stall-events")}
                className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                Back to My Stall Events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          onClick={() => navigate("/organizer/stall-events")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Stall Events
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
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0 text-sm py-1 px-3">
            Stall Event
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Event Info */}
        <Card className="md:col-span-2 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="border-b border-gray-50 pb-6">
            <CardTitle className="text-xl font-semibold text-gray-800">Event Details</CardTitle>
            <CardDescription className="text-gray-500">Complete information about your stall event</CardDescription>
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
                  value="stalls"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  Stalls
                </TabsTrigger>
              </TabsList>

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
                      <div className="bg-green-50 p-2 rounded-lg">
                        <Store className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Stalls</div>
                        <div className="text-gray-600 mt-1">
                          {eventDetail.stalls.length} stalls available
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

                <Separator className="my-6 bg-gray-100" />

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Organizer Information</h3>
                  <div className="bg-gray-50/50 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Name:</span>
                          <span className="text-gray-600 ml-2">{eventDetail.organizer_name}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Email:</span>
                          <span className="text-gray-600 ml-2">{eventDetail.organizer_email}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Phone:</span>
                          <span className="text-gray-600 ml-2">{eventDetail.organizer_phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stalls" className="space-y-6 mt-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">Available Stalls</h3>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() => navigate(`/organizer/stall-events/${eventDetail.id}/add-stall`)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stall
                  </Button>
                </div>

                {eventDetail.stalls.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {eventDetail.stalls.map((stall) => (
                      <Card key={stall.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="bg-gray-50 p-6 md:w-1/4 flex items-center justify-center">
                              <Store className="h-12 w-12 text-gray-400" />
                            </div>
                            <div className="p-6 md:w-3/4">
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-gray-800">{stall.name}</h3>
                                <Badge className={stall.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {stall.is_available ? "Available" : "Unavailable"}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-4">{stall.description}</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <div className="text-sm text-gray-500">Price</div>
                                  <div className="font-medium text-gray-800">${parseFloat(stall.price).toFixed(2)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Size</div>
                                  <div className="font-medium text-gray-800">{stall.size}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Location in Venue</div>
                                  <div className="font-medium text-gray-800">{stall.location_in_venue}</div>
                                </div>
                              </div>
                              <div className="flex justify-end gap-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                  onClick={() => navigate(`/organizer/stall-events/${eventDetail.id}/edit-stall/${stall.id}`)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  className={stall.is_available ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                                >
                                  {stall.is_available ? (
                                    <XCircle className="h-4 w-4 mr-2" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                  )}
                                  {stall.is_available ? "Mark as Unavailable" : "Mark as Available"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-gray-100">
                    <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Stalls Available</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      You haven't added any stalls to this event yet. Add your first stall to get started.
                    </p>
                    <Button
                      className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300"
                      onClick={() => navigate(`/organizer/stall-events/${eventDetail.id}/add-stall`)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Stall
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t border-gray-50 pt-6 flex justify-end gap-4">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={() => navigate(`/organizer/stall-events/edit/${eventDetail.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => navigate(`/organizer/stall-events/${eventDetail.id}/add-stall`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stall
            </Button>
          </CardFooter>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Banner */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-lg font-semibold text-gray-800">Event Banner</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {eventDetail.banner_image ? (
                <div className="rounded-xl overflow-hidden h-48 bg-gray-100">
                  <img
                    src={`http://localhost:3000/uploads/${eventDetail.banner_image}`}
                    alt="Event Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-center">
                    <Image className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400">No banner image available</p>
                  </div>
                </div>
              )}
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
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Stalls</div>
                    <div className="text-xl font-bold text-gray-800">{eventDetail.stalls.length}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-50 p-3 rounded-full mr-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Available Stalls</div>
                    <div className="text-xl font-bold text-gray-800">
                      {eventDetail.stalls.filter(stall => stall.is_available).length}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-50 p-3 rounded-full mr-4">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Average Price</div>
                    <div className="text-xl font-bold text-gray-800">
                      ${eventDetail.stalls.length > 0
                        ? (eventDetail.stalls.reduce((sum, stall) => sum + parseFloat(stall.price), 0) / eventDetail.stalls.length).toFixed(2)
                        : "0.00"}
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
                  onClick={() => navigate(`/organizer/stall-events/edit/${eventDetail.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => navigate(`/organizer/stall-events/${eventDetail.id}/add-stall`)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stall
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Stall Data
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

          {/* Event Date & Location */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-lg font-semibold text-gray-800">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
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
                  <div className="bg-amber-50 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Location</div>
                    <div className="text-gray-600 mt-1">{eventDetail.location}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StallEventDetail;