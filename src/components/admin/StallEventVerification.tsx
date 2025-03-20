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

interface Stall {
    id: string;
    stall_event_id: string;
    name: string;
    description: string;
    price: string;
    size: string;
    location_in_venue: string;
    is_available: boolean;
    manager_id: string | null;
    created_at: string;
    updated_at: string;
    event_id: string | null;
}

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
    stalls: Stall[]; // Added stalls array
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

    const handleViewDetails = (event: StallEvent) => {
        setSelectedEventDetails(event);
        setDetailsOpen(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

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
            setDetailsOpen(false);
        } catch (error) {
            toast({
                title: "Operation Failed",
                description: `Failed to ${status} event`,
                variant: "destructive",
            });
        }
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
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedEventDetails && (
                        <div className="space-y-6">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold flex items-center">
                                    {selectedEventDetails.title}
                                    <Badge variant="outline" className="ml-3 bg-amber-50 text-amber-700 border-amber-200">
                                        Pending
                                    </Badge>
                                </DialogTitle>
                                <DialogDescription>
                                    Submitted by {selectedEventDetails.organizer_name} on {formatDate(selectedEventDetails.created_at)}
                                </DialogDescription>
                            </DialogHeader>

                            {/* Event Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                                        <p className="text-gray-800">{selectedEventDetails.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                                        <p className="mt-1 text-gray-800 flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                                            {selectedEventDetails.location}
                                        </p>
                                        <p className="mt-1 text-gray-600 text-sm">
                                            {selectedEventDetails.address}, {selectedEventDetails.city}, {selectedEventDetails.state}, {selectedEventDetails.country} {selectedEventDetails.zip_code}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h3>
                                        <p className="mt-1 text-gray-800 flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                                            Start: {formatDate(selectedEventDetails.start_date)}
                                        </p>
                                        <p className="mt-1 text-gray-800 flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-blue-400" />
                                            End: {formatDate(selectedEventDetails.end_date)}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Organizer</h3>
                                        <p className="mt-1 text-gray-800 flex items-center">
                                            <User className="h-4 w-4 mr-2 text-blue-400" />
                                            {selectedEventDetails.organizer_name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stalls Information */}
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                    <Store className="h-5 w-5 mr-2 text-blue-500" />
                                    Stalls Information ({selectedEventDetails.stalls?.length || 0})
                                </h3>

                                {selectedEventDetails.stalls && selectedEventDetails.stalls.length > 0 ? (
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
                                                    {selectedEventDetails.stalls.map((stall) => (
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
                                        onClick={() => handleVerification(selectedEventDetails.id, "rejected")}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Reject Event
                                    </Button>
                                    <Button
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                        onClick={() => handleVerification(selectedEventDetails.id, "verified")}
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

export default StallEventVerification;