import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Search, MapPin, Calendar, DollarSign, Plus, Filter, ArrowUpRight, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StallService } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define TypeScript interfaces for type safety
interface StallRequest {
  id: string;
  stall_name: string;
  event_title: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
  stall_id: string;
  revenue: string; // Assuming you want to display revenue
}

// Add interface for stall details
interface StallDetails {
  id: string;
  stall_event_id: string;
  name: string;
  description: string;
  price: string;
  size: string;
  status: string;
  location_in_venue: string | null;
  is_available: boolean;
  manager_id: string;
  created_at: string;
  updated_at: string;
  event_id: string | null;
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
  request_message?: string;
}

const MyStalls = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stallRequests, setStallRequests] = useState<StallRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStall, setSelectedStall] = useState<StallDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchStallRequests = async () => {
      try {
        const response = await StallService.getMyStallsRequests();
        setStallRequests(response.data.stallRequests);
      } catch (error) {
        console.error("Error fetching stall requests:", error);
        toast({
          title: "Error",
          description: "Failed to load stall requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStallRequests();
  }, [toast]);

  const handleViewDetails = async (stallId: string) => {
    try {
      setLoadingDetails(true);
      const response = await StallService.getStallDetail(stallId);
      setSelectedStall(response.data.stallDetail);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching stall details:", error);
      toast({
        title: "Error",
        description: "Failed to load stall details",
        variant: "destructive",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredStalls = stallRequests.filter(stall =>
    stall.stall_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stall.event_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stall.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-0 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0">
            Rejected
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your stalls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 ml-4">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Stalls</h1>
            <p className="text-gray-600">Manage and track all your stall requests across events</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Stall Requests</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search stalls..."
                  className="pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="bg-gray-100/80 p-1 rounded-lg">
              <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                All Stalls
              </TabsTrigger>
              <TabsTrigger value="verified" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                Verified
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                Pending
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="pt-6">
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {filteredStalls.length > 0 ? (
                  filteredStalls.map((stall) => (
                    <div
                      key={stall.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg flex-shrink-0 ${stall.status === "verified" ? "bg-green-50" :
                          stall.status === "pending" ? "bg-yellow-50" : "bg-red-50"
                          }`}>
                          <Store className={`h-6 w-6 ${stall.status === "verified" ? "text-green-600" :
                            stall.status === "pending" ? "text-yellow-600" : "text-red-600"
                            }`} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-800 text-lg">{stall.stall_name}</h3>
                            <div className="ml-3">
                              {getStatusIcon(stall.status)}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                              <span>{stall.event_title}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                              <span>{stall.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                              <span>{new Date(stall.start_date).toLocaleDateString()} - {new Date(stall.end_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mt-4 md:mt-0 space-x-3 md:ml-4">
                        {stall.status === "verified" && (
                          <div className="flex items-center mr-4">
                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                            <span className="font-medium text-gray-800">{stall.revenue || "$0"}</span>
                          </div>
                        )}
                        <Button
                          variant={stall.status === "verified" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleViewDetails(stall.stall_id)}
                          className={stall.status === "verified"
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"}
                        >
                          {stall.status === "verified" ? "View Details" : "View Request"}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                      <Store className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No stalls found</h3>
                    <p className="text-gray-500 max-w-md mb-6">
                      {searchQuery
                        ? "No stalls match your search criteria. Try a different search term."
                        : "You haven't requested any stalls yet. Create your first stall request to get started."}
                    </p>
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Request New Stall
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="verified" className="mt-0">
              <div className="space-y-4">
                {filteredStalls.filter(stall => stall.status === "verified").length > 0 ? (
                  filteredStalls
                    .filter(stall => stall.status === "verified")
                    .map((stall) => (
                      <div
                        key={stall.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="p-3 rounded-lg flex-shrink-0 bg-green-50">
                            <Store className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <h3 className="font-medium text-gray-800 text-lg">{stall.stall_name}</h3>
                              <div className="ml-3">
                                {getStatusIcon(stall.status)}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                <span>{stall.event_title}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                                <span>{stall.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                <span>{new Date(stall.start_date).toLocaleDateString()} - {new Date(stall.end_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-4 md:mt-0 space-x-3 md:ml-4">
                          <div className="flex items-center mr-4">
                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                            <span className="font-medium text-gray-800">{stall.revenue || "$0"}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(stall.stall_id)}
                            className="border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => navigate(`/stall-manager/inventory/${stall.stall_id}`)}
                            className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm"
                          >
                            Manage Inventory
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                      <Store className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No verified stalls</h3>
                    <p className="text-gray-500 max-w-md mb-6">
                      You don't have any verified stalls yet. Your stall requests will appear here once they're approved.
                    </p>
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Request New Stall
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <div className="space-y-4">
                {filteredStalls.filter(stall => stall.status === "pending").length > 0 ? (
                  filteredStalls
                    .filter(stall => stall.status === "pending")
                    .map((stall) => (
                      <div
                        key={stall.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="p-3 rounded-lg flex-shrink-0 bg-yellow-50">
                            <Store className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <h3 className="font-medium text-gray-800 text-lg">{stall.stall_name}</h3>
                              <div className="ml-3">
                                {getStatusIcon(stall.status)}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                <span>{stall.event_title}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                                <span>{stall.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                <span>{new Date(stall.start_date).toLocaleDateString()} - {new Date(stall.end_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-4 md:mt-0 space-x-3 md:ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(stall.stall_id)}
                            className="border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            View Request
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                      <Store className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No pending requests</h3>
                    <p className="text-gray-500 max-w-md mb-6">
                      You don't have any pending stall requests at the moment.
                    </p>
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Request New Stall
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-red-50 to-white border border-gray-100 shadow-sm mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">Tips for Successful Stall Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="bg-red-50 p-2 rounded-lg mr-3">
                  <Store className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-medium text-gray-800">Complete Information</h3>
              </div>
              <p className="text-sm text-gray-600">
                Provide detailed descriptions of your stall offerings and requirements to increase approval chances.
              </p>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800">Apply Early</h3>
              </div>
              <p className="text-sm text-gray-600">
                Submit your stall requests well in advance of the event date to secure your preferred location.
              </p>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="bg-green-50 p-2 rounded-lg mr-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-800">Pricing Strategy</h3>
              </div>
              <p className="text-sm text-gray-600">
                Set competitive pricing for your stall products to attract more customers and increase revenue.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200">
              <h3 className="font-medium text-gray-800 mb-2">How long does the stall approval process take?</h3>
              <p className="text-sm text-gray-600">
                Stall approval typically takes 2-3 business days. You'll receive an email notification once your request has been reviewed.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200">
              <h3 className="font-medium text-gray-800 mb-2">Can I modify my stall request after submission?</h3>
              <p className="text-sm text-gray-600">
                Yes, you can edit pending requests. Navigate to the stall details page and click the "Edit Request" button.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200">
              <h3 className="font-medium text-gray-800 mb-2">What happens if my stall request is rejected?</h3>
              <p className="text-sm text-gray-600">
                If your request is rejected, you'll receive feedback explaining why. You can address the issues and submit a new request.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      // Stall Details Dialog
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Stall Details</DialogTitle>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : selectedStall ? (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{selectedStall.name}</h3>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedStall.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">${selectedStall.price}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-medium">{selectedStall.size}</p>
                </div>
                {selectedStall.location_in_venue && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm text-gray-500">Location in Venue</p>
                    <p className="font-medium">{selectedStall.location_in_venue}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Event Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Event</p>
                      <p className="font-medium">{selectedStall.event_title}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{selectedStall.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center col-span-2">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Dates</p>
                      <p className="font-medium">
                        {new Date(selectedStall.start_date).toLocaleDateString()} - {new Date(selectedStall.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedStall.request_message && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">Your Request Message</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-md italic">
                      "{selectedStall.request_message}"
                    </p>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                {selectedStall.status === "verified" && (
                  <Button
                    onClick={() => {
                      setDialogOpen(false);
                      navigate(`/stall-manager/inventory/${selectedStall.id}`);
                    }}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                  >
                    Manage Inventory
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">
              No stall details available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default MyStalls;