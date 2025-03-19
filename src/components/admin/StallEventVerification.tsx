import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, MessageSquare, Calendar, Store, Clock, User, MapPin, Users, AlertCircle, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StallService } from "../../lib/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface StallEvent {
    id: string;
    title: string;
    organizer_name: string;
    start_date: string;
    end_date: string;
    description: string;
    verification_status: string;
    created_at: string;
    available_stall_count: number;
    stall_count: number;
    location: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    banner_image: string;
    admin_feedback: string | null;
}

const StallEventVerification = () => {
    const { toast } = useToast();
    const [events, setEvents] = useState<StallEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [feedback, setFeedback] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedEventDetails, setSelectedEventDetails] = useState<StallEvent | null>(null);

    useEffect(() => {
        const fetchPendingEvents = async () => {
            try {
                const response = await StallService.getPendingEvents({ page: currentPage });
                setEvents(response.data.stallEvents);
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
            await StallService.verifyStallEvent(eventId, status, feedback);
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

    const handleViewDetails = async (event: StallEvent) => {
        try {
            // If you need to fetch more details, you can do it here
            // const response = await StallService.getStallEventDetails(event.id);
            // setSelectedEventDetails(response.data.stallEvent);

            // For now, we'll just use the event data we already have
            setSelectedEventDetails(event);
            setDetailsOpen(true);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load event details",
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-gray-500 text-sm font-medium">Loading stall events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8 ml-4">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Stall Event Verification</h1>
                <p className="text-gray-600">Review and approve stall event submissions from organizers.</p>
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
                            <CardTitle className="text-xl font-semibold text-gray-800">Pending Stall Events</CardTitle>
                            <CardDescription className="text-gray-500">
                                Stall events awaiting verification before they can be published
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
                                                                    <div className="p-3 rounded-lg bg-purple-50">
                                                                        <Store className="h-5 w-5 text-purple-600" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                                                                        <Badge className="mt-1 bg-purple-100 text-purple-800 hover:bg-purple-200">
                                                                            Stall Event
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                                                                    onClick={() => handleViewDetails(event)}
                                                                >
                                                                    <Eye className="h-4 w-4 mr-1" />
                                                                    View Details
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
                                                                    onClick={() => handleVerification(event.id, "verified")}
                                                                >
                                                                    <Check className="h-4 w-4 mr-1" />
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                                                                    onClick={() => setSelectedEvent(event.id)}
                                                                >
                                                                    <X className="h-4 w-4 mr-1" />
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Event Info */}
                                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                <User className="h-4 w-4 text-gray-400" />
                                                                <span>Organizer: {event.organizer_name}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span>Date: {formatDate(event.start_date)}</span>
                                                            </div>
                                                        </div>

                                                        {/* Rejection Form */}
                                                        {selectedEvent === event.id && (
                                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Provide Feedback for Rejection</h4>
                                                                <Textarea
                                                                    placeholder="Explain why this event is being rejected..."
                                                                    className="min-h-[100px] mb-3"
                                                                    value={feedback}
                                                                    onChange={(e) => setFeedback(e.target.value)}
                                                                />
                                                                <div className="flex justify-end space-x-2">
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
                                                                        Confirm Rejection
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-700 mb-2">No Pending Events</h3>
                                            <p className="text-gray-500 text-sm">There are no stall events waiting for verification.</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Other tabs content would go here */}
                <TabsContent value="approved">
                    <div className="text-center py-12">
                        <p className="text-gray-500">Approved events view will be implemented soon.</p>
                    </div>
                </TabsContent>

                <TabsContent value="rejected">
                    <div className="text-center py-12">
                        <p className="text-gray-500">Rejected events view will be implemented soon.</p>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Event Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center">
                            <Store className="h-5 w-5 mr-2 text-purple-600" />
                            {selectedEventDetails?.title}
                        </DialogTitle>
                        <DialogDescription>
                            Stall event details for verification
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEventDetails && (
                        <div className="space-y-6 py-4">
                            {/* Banner Image */}
                            {selectedEventDetails.banner_image && (
                                <div className="w-full h-48 rounded-lg overflow-hidden">
                                    <img
                                        src={`http://localhost:3000/uploads/${selectedEventDetails.banner_image}`}
                                        alt={selectedEventDetails.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Event Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                        <p className="mt-1 text-gray-800">{selectedEventDetails.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                                        <div className="mt-1 flex items-center space-x-1 text-gray-800">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span>{selectedEventDetails.location}</span>
                                            {selectedEventDetails.city && selectedEventDetails.country && (
                                                <span> - {selectedEventDetails.city}, {selectedEventDetails.country}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Event Dates</h3>
                                        <div className="mt-1 flex items-center space-x-1 text-gray-800">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span>{formatDate(selectedEventDetails.start_date)} - {formatDate(selectedEventDetails.end_date)}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Organizer</h3>
                                        <div className="mt-1 flex items-center space-x-1 text-gray-800">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span>{selectedEventDetails.organizer_name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Stall Information</h3>
                                        <div className="mt-1 flex items-center space-x-1 text-gray-800">
                                            <Store className="h-4 w-4 text-gray-400" />
                                            <span>
                                                {selectedEventDetails.stall_count || 0} stalls
                                                ({selectedEventDetails.available_stall_count || 0} available)
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Submission Date</h3>
                                        <div className="mt-1 flex items-center space-x-1 text-gray-800">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span>{formatDate(selectedEventDetails.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Full Address */}
                            {(selectedEventDetails.address || selectedEventDetails.city) && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-gray-500">Full Address</h3>
                                    <p className="mt-1 text-gray-800">
                                        {selectedEventDetails.address && `${selectedEventDetails.address}, `}
                                        {selectedEventDetails.city && `${selectedEventDetails.city}, `}
                                        {selectedEventDetails.state && `${selectedEventDetails.state}, `}
                                        {selectedEventDetails.country && `${selectedEventDetails.country} `}
                                        {selectedEventDetails.zip_code && selectedEventDetails.zip_code}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
                {/* <DialogFooter className="bg-gray-50 px-6 py-4">
                    <div className="flex justify-between w-full">
                        <Button
                            variant="outline"
                            onClick={() => setDetailsOpen(false)}
                        >
                            Close
                        </Button>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                className="bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
                                onClick={() => {
                                    handleVerification(selectedEventDetails!.id, "verified");
                                    setDetailsOpen(false);
                                }}
                            >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                                onClick={() => {
                                    setSelectedEvent(selectedEventDetails!.id);
                                    setDetailsOpen(false);
                                }}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                            </Button>
                        </div>
                    </div>
                </DialogFooter> */}
            </Dialog>
        </div>
    );
};

export default StallEventVerification;