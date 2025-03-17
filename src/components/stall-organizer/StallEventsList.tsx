import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Eye, Store, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { StallService } from "@/lib/api";
import { AxiosResponse } from "axios";

// TypeScript interface for type safety
interface StallEvent {
  id: string;
  title: string;
  start_date: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  is_published: boolean;
  stall_count: string;
  request_count: string;
  banner_image: string | null;
  end_date: string;
  location: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Define an interface for the API response
interface StallEventsResponse {
  events: StallEvent[];
  pagination?: PaginationInfo;
}

const StallEventsList = () => {
  const [stallEvents, setStallEvents] = useState<StallEvent[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStallEvents = async () => {
      try {
        // Type the response explicitly
        const response: AxiosResponse<StallEventsResponse> = await StallService.getAllMyStallEvents();

        console.log('Full API Response:', response.data); // Debug logging

        // Validate response structure
        if (!response.data || !response.data.events || !Array.isArray(response.data.events)) {
          throw new Error("Invalid response format");
        }

        setStallEvents(response.data.events);

        // Set pagination if available
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching stall events:", error);
        setError(error instanceof Error ? error.message : "Failed to load stall events");
        setStallEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStallEvents();
  }, []);

  // Determine badge color and style based on verification status
  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl">Loading stall events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            My Stall Events
            <span className="text-sm text-muted-foreground ml-2">
              (Total: {pagination.total})
            </span>
          </CardTitle>
          <Link to="/stall-organizer/events/new">
            <Button variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Create New Event
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {stallEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Store className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p>No stall events found</p>
              <p className="text-sm">Create your first stall event to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stallEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-all duration-300 hover:border-primary/50"
                >
                  {/* Event Image */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={event.banner_image
                        ? `http://localhost:3000/uploads/${event.banner_image}`
                        : '/placeholder-image.png'}
                      alt={event.title}
                      className="w-20 h-16 object-cover rounded-md"
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.src = '/placeholder-image.png'; // Fallback image
                      }}
                    />

                    {/* Event Details */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(event.start_date).toLocaleDateString()} - {' '}
                          {new Date(event.end_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Store className="h-4 w-4 mr-1" />
                          {event.stall_count} Stalls
                        </div>
                      </div>
                      <Badge
                        className={`${getVerificationBadge(event.verification_status)} text-xs px-2 py-1`}
                      >
                        {event.verification_status.charAt(0).toUpperCase() + event.verification_status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link to={`/stall-events/${event.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/stall-events/edit/${event.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StallEventsList;