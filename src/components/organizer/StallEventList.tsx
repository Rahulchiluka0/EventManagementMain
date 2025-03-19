import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Eye, MapPin, Users, MessageSquare, Plus, Filter, Search, Clock, ArrowRight, AlertTriangle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { StallService } from "../../lib/api";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define proper TypeScript interface for the event data
interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  banner_image: string;
  organizer_id: string;
  verification_status: "pending" | "verified" | "rejected";
  is_published: boolean;
  created_at: string;
  updated_at: string;
  stall_count: string;
  request_count: string;
  admin_feedback: string | null;
}

interface ApiResponse {
  events: Event[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const StallEventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await StallService.getAllMyStallEvents();
        const data = response.data as ApiResponse;
        setEvents(data.events);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time to display in a more readable format
  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Get duration of event in hours
  const getEventDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end.getTime() - start.getTime();
    const durationHours = Math.round(durationMs / (1000 * 60 * 60));
    return `${durationHours} ${durationHours === 1 ? 'hour' : 'hours'}`;
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your stall events...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-gray-50">
        <div>
          <CardTitle className="text-2xl font-semibold text-gray-800">My Stall Events</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            You have {pagination.total} stall event{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/organizer/stall-events/new">
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            Create New Stall Event
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stall events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
            />
          </div>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/50 rounded-lg border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No stall events found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Try adjusting your search term" : "Create your first stall event to get started"}
            </p>
            {!searchTerm && (
              <Link to="/organizer/stall-events/new">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Stall Event
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                      <Badge
                        className={`px-2 py-1 text-xs font-medium ${event.verification_status === "verified"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : event.verification_status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                      >
                        {event.verification_status.charAt(0).toUpperCase() + event.verification_status.slice(1)}
                      </Badge>
                      {!event.is_published && (
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0">
                          Draft
                        </Badge>
                      )}
                    </div>

                    {/* Admin Feedback Alert for Rejected Events */}
                    {event.verification_status === "rejected" && event.admin_feedback && (
                      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800 mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="text-red-800 font-medium">Rejection Feedback</AlertTitle>
                        <AlertDescription className="text-red-700">
                          {event.admin_feedback}
                          <div className="mt-2 text-sm">
                            <p className="font-medium">Please make the necessary changes and resubmit your event for verification.</p>
                          </div>
                        </AlertDescription>
                        <div className="mt-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-white border-red-300 text-red-700 hover:bg-red-50"
                            asChild
                          >
                            <Link to={`/organizer/stall-events/edit/${event.id}`} className="flex items-center">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit & Resubmit
                            </Link>
                          </Button>
                        </div>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary/70" />
                        <span>{formatDate(event.start_date)}</span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary/70" />
                        <span>{formatTime(event.start_date)} ({getEventDuration(event.start_date, event.end_date)})</span>
                      </div>

                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                        <span>{event.location}, {event.city}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-blue-500/70" />
                          <span>{event.stall_count} Stall{parseInt(event.stall_count) !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1 text-green-500/70" />
                          <span>{event.request_count} Request{parseInt(event.request_count) !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 md:flex-nowrap md:self-center">
                    {event.verification_status === "rejected" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 transition-colors w-full md:w-auto"
                      >
                        <Link to={`/organizer/stall-events/edit/${event.id}`} className="flex items-center justify-center gap-1">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Update & Resubmit
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full md:w-auto"
                        >
                          <Link to={`/organizer/stall-events/edit/${event.id}`} className="flex items-center justify-center gap-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Event
                          </Link>
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300 w-full md:w-auto"
                    >
                      <Link to={`/organizer/stall-events/${event.id}`} className="flex items-center justify-center gap-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredEvents.length > 0 && pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{pagination.page}</span> of{" "}
              <span className="font-medium">{pagination.totalPages}</span> pages
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StallEventList;