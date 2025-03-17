import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, MessageSquare, Calendar, Store, Clock, User, MapPin, Users, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StallService } from "../../lib/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StallEvent {
    id: string;
    title: string;
    organizer_name: string;
    start_date: string;
    description: string;
    verification_status: string;
    created_at: string;
    available_stall_count: number;
    stall_count: number;
}

const StallEventVerification = () => {
    const { toast } = useToast();
    const [events, setEvents] = useState<StallEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

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
            await StallService.verifyStallEvent(eventId, status, feedbackMessage);
            toast({
                title: `Event ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                description: `Event has been ${status} successfully`,
            });
            setEvents(prev => prev.filter(event => event.id !== eventId));
            setSelectedEvent(null);
            setFeedbackMessage("");
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
                                                                    onClick={() => handleVerification(event.id, "rejected")}
                                                                >
                                                                    <X className="h-4 w-4 mr-1" />
                                                                    Reject
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-colors"
                                                                    onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                                                                >
                                                                    <MessageSquare className="h-4 w-4 mr-1" />
                                                                    {selectedEvent === event.id ? "Cancel" : "Request Changes"}
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <Separator className="bg-gray-100" />

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                                                                    <p className="text-gray-700">{event.description}</p>
                                                                </div>

                                                                <div className="flex items-start space-x-6">
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Organizer</h4>
                                                                        <div className="flex items-center">
                                                                            <User className="h-4 w-4 text-gray-400 mr-1" />
                                                                            <span className="text-gray-700">{event.organizer_name}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Date</h4>
                                                                        <div className="flex items-center">
                                                                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                                                            <span className="text-gray-700">{formatDate(event.start_date)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Stall Capacity</h4>
                                                                    <div className="flex items-center">
                                                                        <Store className="h-4 w-4 text-gray-400 mr-1" />
                                                                        <span className="text-gray-700">{event.stall_count} total stalls</span>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Available Stalls</h4>
                                                                    <div className="flex items-center">
                                                                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                                                                        <span className="text-gray-700">{event.available_stall_count} available</span>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Submission Date</h4>
                                                                    <div className="flex items-center">
                                                                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                                                        <span className="text-gray-700">{formatDate(event.created_at)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {selectedEvent === event.id && (
                                                            <div className="mt-4 space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                                                <h4 className="text-sm font-medium text-gray-700">Request Modifications</h4>
                                                                <Textarea
                                                                    placeholder="Enter feedback for the organizer..."
                                                                    value={feedbackMessage}
                                                                    onChange={(e) => setFeedbackMessage(e.target.value)}
                                                                    className="min-h-[100px] bg-white border-gray-200 focus:border-primary"
                                                                />
                                                                <div className="flex justify-end space-x-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                                        onClick={() => {
                                                                            setSelectedEvent(null);
                                                                            setFeedbackMessage("");
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-primary hover:bg-primary/90 text-white"
                                                                        onClick={() => handleVerification(event.id, "pending")}
                                                                    >
                                                                        Submit Feedback
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                <Check className="h-10 w-10 text-gray-300" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-1">All Caught Up!</h3>
                                            <p className="text-gray-500 max-w-md">
                                                There are no pending stall events that require verification at this time.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <Button
                                            key={i + 1}
                                            variant={currentPage === i + 1 ? "default" : "outline"}
                                            size="sm"
                                            className={currentPage === i + 1
                                                ? "bg-primary text-white hover:bg-primary/90"
                                                : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="approved">
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                        <CardHeader className="pb-4 border-b border-gray-50">
                            <CardTitle className="text-xl font-semibold text-gray-800">Approved Stall Events</CardTitle>
                            <CardDescription className="text-gray-500">
                                Stall events that have been verified and published
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="bg-green-50 p-4 rounded-full mb-4">
                                    <Check className="h-10 w-10 text-green-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-1">Approved Stall Events</h3>
                                <p className="text-gray-500 max-w-md mb-6">
                                    View all stall events that have been approved and are now live on the platform.
                                </p>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    View Approved Stall Events
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rejected">
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                        <CardHeader className="pb-4 border-b border-gray-50">
                            <CardTitle className="text-xl font-semibold text-gray-800">Rejected Stall Events</CardTitle>
                            <CardDescription className="text-gray-500">
                                Stall events that did not meet platform guidelines
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="bg-red-50 p-4 rounded-full mb-4">
                                    <X className="h-10 w-10 text-red-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-1">Rejected Stall Events</h3>
                                <p className="text-gray-500 max-w-md mb-6">
                                    View all stall events that have been rejected with feedback provided to organizers.
                                </p>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    View Rejected Stall Events
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Stall Event Verification Guidelines */}
            <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mt-8">
                <CardHeader className="pb-4 border-b border-gray-50">
                    <CardTitle className="text-xl font-semibold text-gray-800">Stall Verification Guidelines</CardTitle>
                    <CardDescription className="text-gray-500">
                        Reference these guidelines when reviewing stall event submissions
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <Check className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="font-medium text-gray-800">Content Guidelines</h3>
                            </div>
                            <ul className="space-y-2 pl-10 text-gray-600 text-sm">
                                <li className="list-disc">Clear stall descriptions</li>
                                <li className="list-disc">Appropriate vendor categories</li>
                                <li className="list-disc">Accurate pricing information</li>
                                <li className="list-disc">Complete organizer details</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="bg-purple-50 p-2 rounded-lg">
                                    <Store className="h-5 w-5 text-purple-600" />
                                </div>
                                <h3 className="font-medium text-gray-800">Stall Requirements</h3>
                            </div>
                            <ul className="space-y-2 pl-10 text-gray-600 text-sm">
                                <li className="list-disc">Reasonable stall capacity</li>
                                <li className="list-disc">Appropriate stall dimensions</li>
                                <li className="list-disc">Clear vendor guidelines</li>
                                <li className="list-disc">Proper venue facilities</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="bg-amber-50 p-2 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-amber-600" />
                                </div>
                                <h3 className="font-medium text-gray-800">Rejection Reasons</h3>
                            </div>
                            <ul className="space-y-2 pl-10 text-gray-600 text-sm">
                                <li className="list-disc">Incomplete stall information</li>
                                <li className="list-disc">Unreasonable pricing</li>
                                <li className="list-disc">Inadequate vendor support</li>
                                <li className="list-disc">Venue safety concerns</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-purple-50 border border-purple-100">
                        <div className="flex items-start">
                            <div className="p-2 rounded-lg bg-purple-100 mr-4">
                                <MessageSquare className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-purple-800 mb-1">Stall Event Feedback Tips</h3>
                                <p className="text-purple-700 text-sm">
                                    When reviewing stall events, focus on the organizer's ability to support vendors. Ensure the venue has adequate facilities, clear setup/teardown times, and reasonable stall allocation. Provide specific feedback about any issues with stall dimensions, pricing structure, or vendor policies.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <CardHeader className="pb-4 border-b border-gray-50">
                        <CardTitle className="text-xl font-semibold text-gray-800">Verification Checklist</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full border-2 border-gray-200 flex items-center justify-center mr-3">
                                    <Check className="h-3 w-3 text-gray-400" />
                                </div>
                                <span className="text-gray-700">Verify organizer credentials and history</span>
                            </div>
                            <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full border-2 border-gray-200 flex items-center justify-center mr-3">
                                    <Check className="h-3 w-3 text-gray-400" />
                                </div>
                                <span className="text-gray-700">Check stall dimensions and capacity</span>
                            </div>
                            <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full border-2 border-gray-200 flex items-center justify-center mr-3">
                                    <Check className="h-3 w-3 text-gray-400" />
                                </div>
                                <span className="text-gray-700">Review pricing structure for vendors</span>
                            </div>
                            <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full border-2 border-gray-200 flex items-center justify-center mr-3">
                                    <Check className="h-3 w-3 text-gray-400" />
                                </div>
                                <span className="text-gray-700">Confirm venue facilities and amenities</span>
                            </div>
                            <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full border-2 border-gray-200 flex items-center justify-center mr-3">
                                    <Check className="h-3 w-3 text-gray-400" />
                                </div>
                                <span className="text-gray-700">Validate setup and teardown schedule</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <CardHeader className="pb-4 border-b border-gray-50">
                        <CardTitle className="text-xl font-semibold text-gray-800">Verification Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Pending</h3>
                                <div className="text-2xl font-bold text-gray-800">{events.length}</div>
                                <div className="text-xs text-gray-500 mt-1">stall events</div>
                            </div>
                            <div className="p-4 rounded-xl bg-green-50/50 border border-green-100">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Approved Today</h3>
                                <div className="text-2xl font-bold text-gray-800">0</div>
                                <div className="text-xs text-gray-500 mt-1">stall events</div>
                            </div>
                            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Rejected Today</h3>
                                <div className="text-2xl font-bold text-gray-800">0</div>
                                <div className="text-xs text-gray-500 mt-1">stall events</div>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Response Time</h3>
                                <div className="text-2xl font-bold text-gray-800">4.2h</div>
                                <div className="text-xs text-gray-500 mt-1">per verification</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StallEventVerification;