import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Calendar as CalendarIcon, Lock, ArrowLeft } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { BookingService, PaymentService } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Load Stripe outside of component to avoid recreating it on renders
// Replace with your own publishable key
const stripePromise = loadStripe("pk_test_51QrbBzP4c6g7ge3A6mY2ldpvZVeTI1pm5U1A0DQlehljTNWNMBpUKwq78X108w7zQnb2STDhMuyTnwJeAbATiYDO00mjM8hTTk");

// Stripe Payment Form Component
const CheckoutForm = ({ bookingId, bookingDetails }: { bookingId: string, bookingDetails: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setIsProcessing(true);
    setCardError("");

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw error;
      }

      // Process payment with backend
      const paymentData = {
        paymentMethod: "credit_card",
        transactionId: paymentMethod.id
      };

      const response = await PaymentService.processPayment(bookingId, paymentData);

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });

      // Redirect to confirmation page
      if (response.data && response.data.redirectUrl) {
        navigate(response.data.redirectUrl);
      } else {
        navigate(`/confirmation/${bookingId}`);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setCardError(error.message || "An error occurred during payment processing");
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="card-element" className="text-gray-700 font-medium">Card Details</Label>
          <div className="mt-1 p-3 border border-gray-200 rounded-lg focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          {cardError && <p className="text-sm text-red-500 mt-1">{cardError}</p>}
          <p className="text-xs text-gray-500 mt-2">
            Test card: 4242 4242 4242 4242 | Exp: Any future date | CVV: Any 3 digits
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-colors"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            <span>Processing Payment...</span>
          </div>
        ) : (
          <span>Pay ${bookingDetails?.total_price ? parseFloat(bookingDetails.total_price).toFixed(2) : '0.00'}</span>
        )}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <p>Your payment information is secure and encrypted</p>
      </div>
    </form>
  );
};

// Main Payment Component
const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;

      try {
        setIsLoading(true);
        const response = await BookingService.getBookingById(bookingId);

        if (!response.data || !response.data.booking) {
          throw new Error("Booking not found");
        }

        setBookingDetails(response.data.booking);
      } catch (error: any) {
        console.error("Error fetching booking details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load booking details. Please try again.",
        });
        navigate("/events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/events")} className="bg-primary text-white">
            Browse Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 sticky top-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-gray-800">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium text-gray-800">{bookingId?.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Event:</span>
                  <span className="font-medium text-gray-800">{bookingDetails.event_title || "Event"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium text-gray-800">{bookingDetails.quantity} tickets</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Amount</span>
                  <span className="text-xl font-bold text-primary">${parseFloat(bookingDetails.total_price).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div className="md:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-gray-800">Payment Details</CardTitle>
              <CardDescription className="text-gray-500">
                Enter your card information to complete the payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <CheckoutForm bookingId={bookingId || ""} bookingDetails={bookingDetails} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;