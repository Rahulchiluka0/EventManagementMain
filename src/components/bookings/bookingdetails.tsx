import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BookingService } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Ticket, ArrowLeft, Download, Activity, User, ChevronRight, Share2, CheckCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/components/ui/use-toast";

interface BookingDetails {
  id: string;
  event_id: string;
  event_title: string;
  event_image: string;
  booking_date: string;
  status: string;
  ticket_type?: string;
  quantity?: number;
  total_price: number;
  event_location?: string;
  event_start_date?: string;
  end_date?: string;
  organizer_name?: string;
  attendee_name?: string;
  attendee_email?: string;
  payment_status?: string;
  booking_reference?: string;
  is_used?: boolean;
  scanned_at?: string;
}

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
    ticket?: any;
  } | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await BookingService.getBookingById(id as string);
        console.log(response.data.booking);

        setBooking(response.data.booking);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // New function to validate ticket
  const validateTicket = async () => {
    if (!booking || !booking.id) return;

    try {
      setValidating(true);
      const response = await BookingService.validateTicket(booking.id);

      setValidationResult(response.data);

      // Update booking with validation result
      if (response.data.success) {
        setBooking(prev => prev ? {
          ...prev,
          is_used: true,
          scanned_at: response.data.ticket.scannedAt
        } : null);

        toast({
          title: "Ticket Validated",
          description: "This ticket has been successfully validated and marked as used.",
          variant: "default",
        });
      } else {
        toast({
          title: "Validation Failed",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Error validating ticket:", err);
      setValidationResult({
        success: false,
        message: err.response?.data?.message || "Failed to validate ticket"
      });

      toast({
        title: "Validation Error",
        description: err.response?.data?.message || "Failed to validate ticket",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  // Generate QR code data
  const generateQRData = () => {
    if (!booking) return "";

    // Include the validation endpoint in the QR data
    const qrData = {
      bookingId: booking.id,
      eventTitle: booking.event_title,
      ticketType: booking.ticket_type || "Standard",
      quantity: booking.quantity || 1,
      attendeeName: booking.attendee_name,
      bookingReference: booking.booking_reference || booking.id,
      status: booking.status,
      validationUrl: `${window.location.origin}/api/bookings/validate-ticket/${booking.id}`
    };

    return JSON.stringify(qrData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col items-center backdrop-blur-sm bg-white/30 p-10 rounded-2xl shadow-sm">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary mb-6"></div>
          <p className="text-gray-600 font-medium">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center h-[80vh] bg-gradient-to-b from-gray-50 to-white">
        <div className="backdrop-blur-sm bg-white/70 p-10 rounded-2xl shadow-sm max-w-md">
          <div className="bg-red-50 p-5 rounded-full mb-6 mx-auto w-20 h-20 flex items-center justify-center">
            <Ticket className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-3">Error Loading Booking</h3>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md transition-all duration-300 px-6 py-2.5 rounded-lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center h-[80vh] bg-gradient-to-b from-gray-50 to-white">
        <div className="backdrop-blur-sm bg-white/70 p-10 rounded-2xl shadow-sm max-w-md">
          <div className="bg-gray-100 p-5 rounded-full mb-6 mx-auto w-20 h-20 flex items-center justify-center">
            <Ticket className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-3">Booking Not Found</h3>
          <p className="text-gray-600 mb-8">
            We couldn't find the booking you're looking for. It may have been removed or you may have followed an invalid link.
          </p>
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-300 px-6 py-2.5 rounded-lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content - BookMyShow style ticket */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="overflow-hidden backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg rounded-xl">
              {/* Ticket Header with tear effect */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 relative">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">E-Ticket</h2>
                  <Badge className={`${booking.status === 'confirmed' ? 'bg-green-500 text-white' :
                    booking.status === 'cancelled' ? 'bg-red-500 text-white' :
                      'bg-yellow-500 text-white'
                    } px-3 py-1 text-sm font-medium uppercase tracking-wider`}>
                    {booking.status}
                  </Badge>
                </div>
                {/* Zigzag tear effect */}
                <div className="absolute bottom-0 left-0 right-0 h-2 overflow-hidden">
                  <div className="flex w-full">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className="h-2 w-2 bg-white rounded-full mx-1"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ticket Content - Side by side layout */}
              <div className="flex flex-col md:flex-row">
                {/* Event Image - Smaller */}
                <div className="md:w-1/3 p-4">
                  <div className="rounded-lg overflow-hidden shadow-md h-full">
                    {booking.event_image ? (
                      <img
                        src={`http://localhost:3000/uploads/${booking.event_image}`}
                        alt={booking.event_title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[200px] bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <Ticket className="h-12 w-12 text-white/80" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Details - Larger */}
                <div className="md:w-2/3 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{booking.event_title}</h2>

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {booking.event_location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-sm">{booking.event_location}</span>
                      </div>
                    )}

                    {booking.event_start_date && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-sm">{formatDate(booking.event_start_date)}</span>
                      </div>
                    )}

                    {booking.event_start_date && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-sm">{formatTime(booking.event_start_date)}</span>
                      </div>
                    )}
                  </div>

                  {/* BookMyShow style ticket details */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Ticket Type</p>
                      <p className="font-medium text-gray-800">{booking.ticket_type || "Standard"}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Quantity</p>
                      <p className="font-medium text-gray-800">{booking.quantity || 1}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Total Price</p>
                      <p className="font-medium text-gray-800">${booking.total_price}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Payment Status</p>
                      <p className="font-medium text-gray-800">{booking.status || "Paid"}</p>
                    </div>
                  </div>

                  {/* Attendee section */}
                  <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Attendee Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {booking.attendee_name && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="font-medium text-gray-800">{booking.attendee_name}</p>
                        </div>
                      )}

                      {booking.attendee_email && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium text-gray-800">{booking.attendee_email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Footer */}
              <div className="border-t border-dashed border-gray-200 p-4 bg-gray-50/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booking Reference</p>
                    <p className="font-mono text-sm font-medium text-gray-800">{booking.booking_reference || booking.id}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {booking.event_id && (
                      <Link to={`/events/${booking.event_id}`}>
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-300 rounded-lg px-4 py-2 text-sm">
                          View Event
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    )}

                    {booking.status === 'confirmed' && (
                      <>
                        <Button
                          variant="outline"
                          className="border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-300 rounded-lg px-4 py-2 text-sm"
                          onClick={() => window.print()}
                        >
                          <Download className="mr-1 h-4 w-4" />
                          Download
                        </Button>

                        <Button
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md transition-all duration-300 rounded-lg px-4 py-2 text-sm"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: `Ticket for ${booking.event_title}`,
                                text: `Check out my ticket for ${booking.event_title}!`,
                                url: window.location.href,
                              }).catch(err => console.error('Error sharing:', err));
                            } else {
                              navigator.clipboard.writeText(window.location.href);
                              alert('Link copied to clipboard!');
                            }
                          }}
                        >
                          <Share2 className="mr-1 h-4 w-4" />
                          Share Ticket
                        </Button>
                      </>
                    )}

                    {booking.status === 'pending' && (
                      <Button className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md transition-all duration-300 rounded-lg px-4 py-2 text-sm">
                        Complete Payment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Event Information Card */}
            <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-md rounded-xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">Event Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Please arrive at least 30 minutes before the event starts. Have your ticket QR code ready for scanning at the entrance.
                </p>

                {booking.organizer_name && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Organizer</p>
                    <p className="font-medium text-gray-800">{booking.organizer_name}</p>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Booking made on {formatDate(booking.booking_date)} • Ticket ID: {booking.id.substring(0, 8)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code Column */}
          <div className="lg:col-span-4">
            <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden sticky top-8">
              <CardHeader className="pb-2 border-b border-gray-50">
                <CardTitle className="text-lg font-semibold text-gray-800">Ticket QR Code</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center">
                  {booking?.status === 'confirmed' ? (
                    <>
                      <div className={`bg-white p-5 rounded-xl shadow-md border ${booking.is_used ? 'border-green-200 bg-green-50' : 'border-gray-100'} mb-6 transition-all duration-300 hover:shadow-lg relative`}>
                        {booking.is_used && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                            <div className="text-center">
                              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
                              <p className="font-medium text-green-700">Ticket Used</p>
                              {booking.scanned_at && (
                                <p className="text-xs text-green-600 mt-1">
                                  {new Date(booking.scanned_at).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        <QRCodeSVG
                          value={generateQRData()}
                          size={200}
                          level="H"
                          includeMargin={true}
                        />
                        {/* QR CODE WITH IMAGE */}

                        {/* <QRCodeCanvas
                          value={generateQRData()}
                          size={200}
                          level="H"
                          includeMargin={true}
                          imageSettings={{
                            src: "../../../public/favicon.ico",
                            x: undefined,
                            y: undefined,
                            height: 30,
                            width: 30,
                            excavate: true,
                          }}
                        /> */}
                      </div>
                      <p className="text-sm text-gray-600 text-center mb-6 max-w-xs">
                        Present this QR code at the event entrance for quick check-in
                      </p>

                      <div className="flex flex-col w-full gap-3">
                        <Button
                          variant="outline"
                          className="border-gray-200 text-gray-700 hover:bg-gray-50 w-full transition-all duration-300 rounded-lg"
                          onClick={() => window.print()}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Print Ticket
                        </Button>

                        {/* Validate Ticket Button - For testing purposes */}
                        <Button
                          className={`w-full transition-all duration-300 rounded-lg ${booking.is_used
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                            }`}
                          onClick={validateTicket}
                          disabled={booking.is_used || validating}
                        >
                          {validating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              Validating...
                            </>
                          ) : booking.is_used ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Ticket Used
                            </>
                          ) : (
                            <>
                              <Ticket className="mr-2 h-4 w-4" />
                              Validate Ticket
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  ) : booking?.status === 'pending' ? (
                    <div className="text-center py-8">
                      <div className="bg-yellow-50 p-6 rounded-full mb-6 mx-auto w-20 h-20 flex items-center justify-center shadow-inner">
                        <Clock className="h-10 w-10 text-yellow-500" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-3">Payment Pending</h3>
                      <p className="text-sm text-gray-600 mb-8 max-w-xs mx-auto">
                        Complete your payment to receive your ticket QR code
                      </p>
                      <Button className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md transition-all duration-300 rounded-lg px-6 py-2.5">
                        Complete Payment
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-red-50 p-6 rounded-full mb-6 mx-auto w-20 h-20 flex items-center justify-center shadow-inner">
                        <Ticket className="h-10 w-10 text-red-500" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-3">Booking {booking.status}</h3>
                      <p className="text-sm text-gray-600 mb-6 max-w-xs mx-auto">
                        This booking is no longer valid
                      </p>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="mt-8 pt-6 border-t border-gray-100 w-full">
                      <div className="text-center">
                        <h4 className="font-medium text-gray-800 mb-3">Booking Reference</h4>
                        <p className="font-mono text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 tracking-wider">
                          {booking.booking_reference || booking.id}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;