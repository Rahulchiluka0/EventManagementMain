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

// Inside the EventVerification component, we need to update the Dialog content
// to display stalls information similar to StallEventVerification.tsx

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
      setDetailsOpen(false)
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {viewEvent && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center">
                  {viewEvent.title}
                  <Badge variant="outline" className="ml-3 bg-amber-50 text-amber-700 border-amber-200">
                    {viewEvent.event_type}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Submitted by {viewEvent.organizer_name} on {formatDate(viewEvent.created_at)}
                </DialogDescription>
              </DialogHeader>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-gray-800">{viewEvent.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                    <p className="mt-1 text-gray-800 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                      {viewEvent.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h3>
                    <p className="mt-1 text-gray-800 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                      Start: {formatDate(viewEvent.start_date)}
                    </p>
                    {viewEvent.end_date && (
                      <p className="mt-1 text-gray-800 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-400" />
                        End: {formatDate(viewEvent.end_date)}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Organizer</h3>
                    <p className="mt-1 text-gray-800 flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-400" />
                      {viewEvent.organizer_name}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Capacity</h3>
                    <p className="mt-1 text-gray-800 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-400" />
                      {viewEvent.max_capacity} attendees
                    </p>
                  </div>
                </div>
              </div>

              {/* Stalls Information - Added similar to StallEventVerification.tsx */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <Store className="h-5 w-5 mr-2 text-blue-500" />
                  Stalls Information ({viewEvent.stalls?.length || 0})
                </h3>

                {viewEvent.stalls && viewEvent.stalls.length > 0 ? (
                  <div className="bg-blue-50/30 backdrop-blur-sm p-4 rounded-xl border border-blue-100/50">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-blue-50/50">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-blue-700">Name</th>
                            <th className="px-4 py-2 text-left font-medium text-blue-700">Description</th>
                            <th className="px-4 py-2 text-left font-medium text-blue-700">Size</th>
                            <th className="px-4 py-2 text-left font-medium text-blue-700">Location</th>
                            <th className="px-4 py-2 text-left font-medium text-blue-700">Price</th>
                            <th className="px-4 py-2 text-left font-medium text-blue-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewEvent.stalls.map((stall) => (
                            <tr key={stall.id} className="hover:bg-blue-50/30 transition-colors duration-200">
                              <td className="px-4 py-3 font-medium">{stall.name}</td>
                              <td className="px-4 py-3">{stall.description}</td>
                              <td className="px-4 py-3">{stall.size}</td>
                              <td className="px-4 py-3">{stall.location_in_venue || "Not specified"}</td>
                              <td className="px-4 py-3 font-medium">${parseFloat(stall.price).toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <Badge variant={stall.is_available ? "success" : "secondary"}>
                                  {stall.is_available ? "Available" : "Reserved"}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                    No stalls have been added to this event.
                  </div>
                )}
              </div>

              {/* Verification Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-gray-500" />
                  Verification Actions
                </h3>
                <Textarea
                  placeholder="Provide feedback to the organizer (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px] text-sm mb-6"
                />
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleVerification(viewEvent.id, "rejected")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Event
                  </Button>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleVerification(viewEvent.id, "approved")}
                  >
                    <Check className="h-4 w-4 mr-2" />
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