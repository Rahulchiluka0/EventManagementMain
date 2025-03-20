import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Share2, ArrowLeft, Tag, Users, Tent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { AuthService, EventService, StallService } from "../lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Add interface for Stall
interface Stall {
  id: string;
  name: string;
  description: string;
  price: string;
  size: string;
  location_in_venue: string | null;
  is_available: boolean;
}

// User interface
interface User {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
}

// Update Event interface to include stalls
interface Event {
  id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  country: string;
  max_capacity: number;
  current_capacity: number;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  price: string;
  banner_image: string;
  stalls?: Stall[];
}

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [requestMessage, setRequestMessage] = useState("");

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setUserLoading(true);
      try {
        const response = await AuthService.getCurrentUser();
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Error fetching current user:", error);
        // If we can't fetch the user, we'll assume they're not logged in
        setCurrentUser(null);
      } finally {
        setUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const response = await EventService.getEventById(id!);
        setEvent(response.data.event);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event details.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, toast]);

  // Calculate available tickets
  const availableTickets = event?.max_capacity - event?.current_capacity;


  const handleBookNow = () => {
    navigate(`/booking/${id}`);
  };

  const handleShare = async () => {
    const shareData = {
      title: event?.title,
      text: event?.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "The event has been shared.",
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Event link has been copied to clipboard.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share the event.",
      });
    }
  };


  const openRequestDialog = (stall: Stall) => {
    setSelectedStall(stall);
    setRequestMessage("I would like to book this stall for the event.");
    setDialogOpen(true);
  };

  const handleRequestSubmit = async () => {
    if (!event || !selectedStall) return;

    try {
      await StallService.requestStall({
        stallId: selectedStall.id,
        eventId: event.id,
        requestMessage: requestMessage
      });

      toast({
        title: "Stall Request Submitted",
        description: "Your stall request has been submitted successfully.",
      });
      setDialogOpen(false);
    } catch (error) {
      console.error("Error requesting stall:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit stall request. Please try again.",
      });
    }
  };

  const handleRegisterStall = async (stallId: string) => {
    if (!event) return;

    try {
      // Updated payload structure to match what the backend expects
      await StallService.requestStall({
        stallId: stallId,
        eventId: event.id,
        requestMessage: "I would like to book this stall for the event."
      });

      toast({
        title: "Stall Request Submitted",
        description: "Your stall request has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error requesting stall:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit stall request. Please try again.",
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6 opacity-90 hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300">
          {/* Event Image */}
          <div className="relative h-[450px]">
            <img
              src={`http://localhost:3000/uploads/${event.banner_image}`}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute top-4 right-4">
              <div className="transition-transform duration-200 hover:scale-105">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="inline-block px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                {event.event_type}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{event.title}</h1>
              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-light" />
                  <span>{new Date(event.start_date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-light" />
                  <span>{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-light" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-grow">
                <div className="transition-all duration-300">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">About This Event</h2>
                  <div className="prose prose-lg max-w-none text-gray-600 mb-8">
                    <p>{event.description || "No additional details available."}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
                    <div className="bg-gray-50/70 backdrop-blur-sm p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-primary" />
                        Venue Information
                      </h3>
                      <p className="text-gray-600">
                        Located in {event.city || "the city"}, {event.state || "state"}, {event.country || "country"}, {event.location} provides the perfect backdrop for this amazing experience.
                      </p>
                    </div>

                    <div className="bg-gray-50/70 backdrop-blur-sm p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-primary" />
                        Event Details
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex justify-between">
                          <span>Event Type:</span>
                          <span className="font-medium">{event.event_type}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">
                            {new Date(event.end_date).getTime() - new Date(event.start_date).getTime() > 86400000
                              ? `${Math.ceil((new Date(event.end_date).getTime() - new Date(event.start_date).getTime()) / 86400000)} days`
                              : `${Math.ceil((new Date(event.end_date).getTime() - new Date(event.start_date).getTime()) / 3600000)} hours`
                            }
                          </span>
                        </li>
                        {currentUser.role === 'user' && (
                          <li className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-medium">${event.price}</span>
                          </li>
                        )}
                        {currentUser.role === 'user' && (
                          <li className="flex justify-between">
                            <span>Available Tickets:</span>
                            <span className="font-medium">{availableTickets}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Section */}
              {currentUser.role === 'user' && (
                <div
                  className="lg:w-96 transition-all duration-300"
                  style={{ alignContent: 'end', marginBottom: '20px' }}
                >
                  <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-gray-100 sticky top-8 hover:shadow-md transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Reserve Your Spot</h3>

                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                      <div>
                        <p className="text-gray-600 mb-1">Price per ticket</p>
                        <div className="text-3xl font-bold text-gray-800">${event.price}</div>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Date</span>
                        <span className="font-medium">{new Date(event.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Time</span>
                        <span className="font-medium">{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="transition-transform duration-200 hover:scale-[1.02]">
                      <Button
                        className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={handleBookNow}
                      >
                        Book Now
                      </Button>
                    </div>

                    <p className="text-center text-gray-500 text-sm mt-4">
                      Secure your spot now. Limited tickets available.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Stalls Section - Only show if stalls are available */}
            {event?.stalls && event.stalls.length > 0 && currentUser?.role === 'stall_manager' && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Tent className="w-6 h-6 mr-2 text-primary" />
                  Available Stalls
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {event.stalls.map(stall => (
                    <div
                      key={stall.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <Tent className="w-8 h-8 text-primary mr-3" />
                          <h4 className="text-xl font-bold">{stall.name}</h4>
                        </div>
                        <p className="text-gray-600 mb-3">{stall.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">Price:</span>
                            <span className="text-primary">${stall.price}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">Size:</span>
                            <span>{stall.size}</span>
                          </div>
                          {stall.location_in_venue && (
                            <div className="col-span-2 flex items-center">
                              <span className="font-semibold mr-2">Location:</span>
                              <span>{stall.location_in_venue}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                          <Button
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => openRequestDialog(stall)}
                            disabled={!stall.is_available}
                          >
                            {stall.is_available ? "Book This Stall" : "Stall Unavailable"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stall Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Stall</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="request-message">Request Message (Optional)</Label>
              <Textarea
                id="request-message"
                placeholder="Enter your request message here..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestSubmit}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetails;