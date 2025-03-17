import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Minus, Plus, Ticket, ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { EventService, BookingService } from "@/lib/api";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch event data when component mounts
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await EventService.getEventById(id);

        if (!response.data || !response.data.event) {
          throw new Error("Event not found");
        }

        setEvent(response.data.event);
      } catch (error: any) {
        console.error("Error fetching event details:", error);
        setError("Failed to load event details. Please try again.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, toast]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create booking
      const bookingData = {
        eventId: id,
        quantity: quantity,
        notes: "Looking forward to this event!"
      };
      
      const response = await BookingService.createBooking(bookingData);
      
      // Redirect to payment page
      if (response.data && response.data.paymentUrl) {
        navigate(response.data.paymentUrl);
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.response?.data?.message || "Failed to create booking. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The event you're looking for doesn't exist or has been removed."}</p>
          <Button onClick={() => navigate("/events")} className="bg-primary text-white">
            Browse Events
          </Button>
        </div>
      </div>
    );
  }

  // Calculate available tickets
  const availableTickets = event.max_capacity - event.current_capacity;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Event Summary */}
            <div className="md:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-gray-100 sticky top-8 transition-all duration-300 hover:shadow-md">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.banner_image ? `http://localhost:3000/uploads/${event.banner_image}` : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h2 className="text-xl font-bold line-clamp-2">{event.title}</h2>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                    <span className="text-sm">{new Date(event.start_date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-primary/70" />
                    <span className="text-sm">{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                    <span className="text-sm line-clamp-1">{event.location}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Price per ticket</span>
                      <span className="text-lg font-bold text-primary">${parseFloat(event.price).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Available tickets</span>
                      <span className="text-lg font-bold text-gray-800">{availableTickets}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="md:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Tickets</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Ticket Quantity */}
                    <div>
                      <Label htmlFor="quantity" className="text-gray-700 font-medium mb-2 block">
                        Number of Tickets
                      </Label>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                          className="h-10 w-10 rounded-l-lg border-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="h-10 px-4 flex items-center justify-center border-y border-gray-200 bg-white min-w-[60px]">
                          <span className="font-medium">{quantity}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= 10 || quantity >= availableTickets}
                          className="h-10 w-10 rounded-r-lg border-gray-200"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {availableTickets > 0
                          ? `${availableTickets} tickets available`
                          : "No tickets available"}
                      </p>
                    </div>

                    {/* Total Price */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Price per ticket</span>
                        <span className="font-medium">${parseFloat(event.price).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Quantity</span>
                        <span className="font-medium">x {quantity}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                        <span className="text-lg font-bold text-gray-800">Total</span>
                        <span className="text-xl font-bold text-primary">
                          ${(parseFloat(event.price) * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-colors"
                      disabled={isLoading || availableTickets === 0}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Ticket className="mr-2 h-5 w-5" />
                          <span>Proceed to Payment</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;