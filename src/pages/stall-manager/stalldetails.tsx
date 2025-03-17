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
  Store,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  ArrowLeft,
  Building,
  Tag,
  Info,
  BarChart
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StallService } from "@/lib/api";
import { format } from "date-fns";

// Define TypeScript interfaces for type safety
interface StallDetail {
  id: string;
  name: string;
  description: string;
  size: string;
  price: string;
  location_in_venue: string;
  stall_event_id: string;
  event_title: string;
  event_description: string;
  start_date: string;
  end_date: string;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  revenue: string;
  visitors: number;
}

const StallDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stallDetail, setStallDetail] = useState<StallDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStallDetail = async () => {
      try {
        const response = await StallService.getStallDetail(id!);
        setStallDetail(response.data.stallDetail);
      } catch (error) {
        console.error("Error fetching stall details:", error);
        toast({
          title: "Error",
          description: "Failed to load stall details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStallDetail();
    }
  }, [id, toast]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!stallDetail) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Stall Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The stall you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => navigate("/stall-manager/stalls")}>
                Back to My Stalls
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/stall-manager/stalls")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Stalls
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Stall Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Store className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>{stallDetail.name}</CardTitle>
                <CardDescription>Stall Details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Stall Details</TabsTrigger>
                <TabsTrigger value="event">Event Info</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Description</div>
                    <div className="text-sm text-muted-foreground">
                      {stallDetail.description || "No description provided"}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Size</div>
                        <div className="text-sm text-muted-foreground">{stallDetail.size}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Price</div>
                        <div className="text-sm text-muted-foreground">${stallDetail.price}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Location in Venue</div>
                        <div className="text-sm text-muted-foreground">
                          {stallDetail.location_in_venue || "Not specified"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="event" className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Event Title</div>
                  <div className="text-sm text-muted-foreground">{stallDetail.event_title}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Description</div>
                  <div className="text-sm text-muted-foreground">
                    {stallDetail.event_description || "No description provided"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Event Dates</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(stallDetail.start_date)} - {formatDate(stallDetail.end_date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">{stallDetail.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Address</div>
                      <div className="text-sm text-muted-foreground">
                        {stallDetail.address}, {stallDetail.city}, {stallDetail.state}, {stallDetail.country} {stallDetail.zip_code}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Organizer</div>
                      <div className="text-sm text-muted-foreground">{stallDetail.organizer_name}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Stall statistics and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <span className="text-xl font-bold">${stallDetail.revenue || "0.00"}</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Visitors</span>
                </div>
                <span className="text-xl font-bold">{stallDetail.visitors || 0}</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <BarChart className="h-4 w-4" />
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Organizer Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contact Organizer</CardTitle>
          <CardDescription>Get in touch with the event organizer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Name</div>
              <div className="text-sm text-muted-foreground">{stallDetail.organizer_name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Email</div>
              <div className="text-sm text-muted-foreground">{stallDetail.organizer_email}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Phone</div>
              <div className="text-sm text-muted-foreground">{stallDetail.organizer_phone}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StallDetails;