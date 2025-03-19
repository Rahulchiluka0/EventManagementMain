import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, MessageSquare, Calendar, Store, Clock, User, MapPin, Users, AlertCircle, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EventService } from "../../lib/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Event {
  id: string;
  title: string;
  organizer_name: string;
  event_type: string;
  start_date: string;
  description: string;
  max_capacity: number;
  verification_status: string;
  created_at: string;
  location?: string;
  end_date?: string;
  ticket_price?: number;
  image_url?: string;
  banner_image?: string;
  stalls?: Stall[];
}

interface Stall {
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
}

const EventVerification = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [viewEvent, setViewEvent] = useState<Event | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        const response = await EventService.getPendingEvents({ page: currentPage });
        setEvents(response.data.events);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load pending events",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingEvents();
  }, [currentPage, toast]);

  const handleVerification = async (eventId: string, status: string) => {
    try {
      await EventService.verifyEvent(eventId, status, feedback);
      toast({
        title: `Event ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `Event has been ${status} successfully`,
      });
      setEvents(prev => prev.filter(event => event.id !== eventId));
      setSelectedEvent(null);
      setFeedback("");
    } catch (error) {
      toast({
        title: "Operation Failed",
        description: `Failed to ${status} event`,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewDetails = (event: Event) => {
    setViewEvent(event);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-500 text-sm font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 ml-4">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Event Verification</h1>
        <p className="text-gray-600">Review and approve event submissions from organizers.</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="pending" className="text-sm">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
              Pending Review ({events.length})
            </div>
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-sm">
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Approved
            </div>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-sm">
            <div className="flex items-center">
              <X className="h-4 w-4 mr-2 text-red-500" />
              Rejected
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-xl font-semibold text-gray-800">Pending Events</CardTitle>
              <CardDescription className="text-gray-500">
                Events awaiting verification before they can be published
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <Card
                        key={event.id}
                        className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                    {event.event_type}
                                  </Badge>
                                </div>
                                {/* Inside the event card, add this to the flex-wrap gap-3 div with other event details */}
                                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                    {formatDate(event.start_date)}
                                  </div>
                                  <div className="flex items-center">
                                    <Store className="h-4 w-4 mr-1 text-gray-400" />
                                    {event.organizer_name}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                                    {event.max_capacity} attendees
                                  </div>
                                  {event.stalls && event.stalls.length > 0 && (
                                    <div className="flex items-center">
                                      <Store className="h-4 w-4 mr-1 text-blue-500" />
                                      <span className="text-blue-600">{event.stalls.length} stalls</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                  onClick={() => handleViewDetails(event)}
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </Button>
                              </div>
                            </div>

                            <Separator className="my-2" />

                            <div className="flex flex-col space-y-3">
                              <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>

                              {selectedEvent === event.id ? (
                                <div className="space-y-3 pt-2">
                                  <Textarea
                                    placeholder="Provide feedback to the organizer (optional)"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="min-h-[80px] text-sm"
                                  />
                                  <div className="flex justify-end space-x-2 pt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedEvent(null);
                                        setFeedback("");
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleVerification(event.id, "rejected")}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleVerification(event.id, "approved")}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-end space-x-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => setSelectedEvent(event.id)}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                    onClick={() => setSelectedEvent(event.id)}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-gray-50 p-3 mb-4">
                        <Check className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No pending events</h3>
                      <p className="text-gray-500 max-w-sm">
                        All events have been reviewed. Check back later for new submissions.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs content would go here */}
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Events</CardTitle>
              <CardDescription>Events that have been approved and published</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Approved events will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Events</CardTitle>
              <CardDescription>Events that have been rejected</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Rejected events will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{viewEvent?.title}</DialogTitle>
            <DialogDescription>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mt-2">
                {viewEvent?.event_type}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          {viewEvent && (
            <div className="space-y-6 py-4">
              {/* Event Image */}
              {viewEvent.image_url && (
                <div className="rounded-lg overflow-hidden h-64 w-full">
                  <img
                    src={viewEvent.image_url}
                    alt={viewEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Banner Image */}
              {viewEvent.banner_image && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Event Banner</h3>
                  <div className="rounded-lg overflow-hidden h-32 w-full">
                    <img
                      src={`http://localhost:3000/uploads/${viewEvent.banner_image}`}
                      alt={`${viewEvent.title} banner`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1 text-gray-800">{viewEvent.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Organizer</h3>
                    <p className="mt-1 text-gray-800 flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {viewEvent.organizer_name}
                    </p>
                  </div>

                  {viewEvent.location && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="mt-1 text-gray-800 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {viewEvent.location}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                    <p className="mt-1 text-gray-800 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(viewEvent.start_date)}
                    </p>
                    {viewEvent.end_date && (
                      <p className="mt-1 text-gray-800 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        End Date: {formatDate(viewEvent.end_date)}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                    <p className="mt-1 text-gray-800 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      {viewEvent.max_capacity} attendees
                    </p>
                  </div>

                  {viewEvent.ticket_price !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Ticket Price</h3>
                      <p className="mt-1 text-gray-800">
                        ${viewEvent.ticket_price.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stalls Information */}
              {viewEvent.stalls && viewEvent.stalls.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Stalls Information</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Registration Fee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewEvent.stalls.map((stall) => (
                        <TableRow key={stall.id}>
                          <TableCell className="font-medium">{stall.name}</TableCell>
                          <TableCell>{stall.description}</TableCell>
                          <TableCell>{stall.size}</TableCell>
                          <TableCell>{stall.location_in_venue || "Not specified"}</TableCell>
                          <TableCell>${parseFloat(stall.price).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Verification Actions */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Verification Actions</h3>
                <Textarea
                  placeholder="Provide feedback to the organizer (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[80px] text-sm mb-4"
                />
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => {
                      handleVerification(viewEvent.id, "rejected");
                      setDetailsOpen(false);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject Event
                  </Button>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => {
                      handleVerification(viewEvent.id, "approved");
                      setDetailsOpen(false);
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve Event
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventVerification;