import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, MessageSquare, Calendar, User, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StallService } from "../../lib/api";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Define TypeScript interfaces for type safety
interface StallRequest {
    id: string;
    requester_id: string;
    stall_event_id: string;
    stall_id: string;
    organizer_id: string;
    request_message: string | null;
    status: string;
    response_message: string | null;
    created_at: string;
    updated_at: string;
    stall_name: string;
    event_title: string;
    requester_name: string;
}

const StallRequestList = () => {
    const { toast } = useToast();
    const [stallRequests, setStallRequests] = useState<StallRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchStallRequests = async () => {
            try {
                const response = await StallService.getStallsRequests();
                setStallRequests(response.data.stallRequests);
            } catch (error) {
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

    const handleVerification = async (requestId: string, status: string) => {
        try {
            await StallService.verifyStallRequest(requestId, status, feedbackMessage);
            toast({
                title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                description: `Request has been ${status} successfully`,
            });
            setStallRequests(prev => prev.filter(request => request.id !== requestId));
            setSelectedRequestId(null);
            setFeedbackMessage("");
        } catch (error) {
            toast({
                title: "Operation Failed",
                description: `Failed to ${status} request`,
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

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const toggleRequestExpansion = (requestId: string) => {
        const newExpandedRequests = new Set(expandedRequests);
        if (newExpandedRequests.has(requestId)) {
            newExpandedRequests.delete(requestId);
        } else {
            newExpandedRequests.add(requestId);
        }
        setExpandedRequests(newExpandedRequests);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-500 text-sm">Loading stall requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-gray-50">
                    <div>
                        <CardTitle className="text-2xl font-semibold text-gray-800">Stall Requests</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            You have {stallRequests.length} request{stallRequests.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Badge
                        className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 border-0"
                    >
                        {stallRequests.length} Request{stallRequests.length !== 1 ? 's' : ''}
                    </Badge>
                </CardHeader>
                <CardContent className="pt-6">
                    <ScrollArea className="h-[600px] pr-4">
                        {stallRequests.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50/50 rounded-lg border border-gray-100">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">No stall requests</h3>
                                <p className="text-gray-500 mb-6">
                                    You don't have any stall requests at the moment
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stallRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
                                    >
                                        <div className="flex flex-col space-y-4">
                                            {/* Request Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <h3 className="font-semibold text-lg text-gray-800">{request.stall_name}</h3>
                                                        <Badge
                                                            className={`px-2 py-1 text-xs font-medium ${request.status === "verified"
                                                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                                : request.status === "pending"
                                                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                                                }`}
                                                        >
                                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                                        <div className="flex items-center">
                                                            <User className="h-4 w-4 mr-2 text-primary/70" />
                                                            <span>Requested by: <span className="font-medium">{request.requester_name}</span></span>
                                                        </div>

                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-2 text-primary/70" />
                                                            <span>{formatDate(request.created_at)}</span>
                                                        </div>

                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 mr-2 text-primary/70" />
                                                            <span>{formatTime(request.created_at)}</span>
                                                        </div>

                                                        <div className="flex items-center">
                                                            <MessageSquare className="h-4 w-4 mr-2 text-primary/70" />
                                                            <span>{request.request_message ? "Has message" : "No message"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-0 h-auto"
                                                            onClick={() => toggleRequestExpansion(request.id)}
                                                        >
                                                            <span className="flex items-center">
                                                                {expandedRequests.has(request.id) ? (
                                                                    <>
                                                                        <ChevronUp className="h-4 w-4 mr-1" />
                                                                        Hide details
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <ChevronDown className="h-4 w-4 mr-1" />
                                                                        View details
                                                                    </>
                                                                )}
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </div>

                                                {request.status === "pending" && (
                                                    <div className="flex flex-col space-y-2 ml-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                                                            onClick={() => {
                                                                setSelectedRequestId(request.id);
                                                                setFeedbackMessage("");
                                                            }}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                                            onClick={() => {
                                                                setSelectedRequestId(request.id);
                                                                setFeedbackMessage("");
                                                            }}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Expanded Details */}
                                            {expandedRequests.has(request.id) && (
                                                <div className="mt-2 pt-4 border-t border-gray-100">
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Event Details</h4>
                                                        <p className="text-sm text-gray-600">{request.event_title}</p>
                                                    </div>

                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Request Message</h4>
                                                        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                                                            {request.request_message || "No additional message provided."}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Feedback Form */}
                                            {selectedRequestId === request.id && (
                                                <div className="mt-2 pt-4 border-t border-gray-100 space-y-4">
                                                    <h4 className="text-sm font-medium text-gray-700">Provide Feedback</h4>
                                                    <Textarea
                                                        placeholder="Enter your feedback message here..."
                                                        value={feedbackMessage}
                                                        onChange={(e) => setFeedbackMessage(e.target.value)}
                                                        className="min-h-[100px] border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                                                    />
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all duration-300"
                                                            onClick={() => handleVerification(request.id, "verified")}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" />
                                                            Submit Approval
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md transition-all duration-300"
                                                            onClick={() => handleVerification(request.id, "rejected")}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Submit Rejection
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                            onClick={() => {
                                                                setSelectedRequestId(null);
                                                                setFeedbackMessage("");
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default StallRequestList;