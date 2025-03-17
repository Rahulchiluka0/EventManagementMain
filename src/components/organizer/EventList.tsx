import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Eye, Plus, MapPin, Clock, Tag, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { EventService } from "../../lib/api"; // Import the EventService
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const EventList = () => {
  const [events, setEvents] = useState<any[]>([]); // State to hold events
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search functionality

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await EventService.getOrganizerEvents(); // Fetch events from the API
        setEvents(response.data.events); // Set the events in state
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-gray-50">
        <div>
          <CardTitle className="text-2xl font-semibold text-gray-800">My Events</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Manage and track all your events</p>
        </div>
        <Link to="/organizer/events/new">
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            Create New Event
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
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

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/50 rounded-lg border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Try adjusting your search term" : "Create your first event to get started"}
            </p>
            {!searchTerm && (
              <Link to="/organizer/events/new">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Event
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
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
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0">
                        {event.event_type || "Event"}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary/70" />
                        <span>{new Date(event.start_date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary/70" />
                        <span>{new Date(event.start_date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>

                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      {event.price && (
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-primary/70" />
                          <span>${event.price}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 md:flex-nowrap">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full md:w-auto"
                    >
                      <Link to={`/organizer/events/${event.id}`} className="flex items-center justify-center gap-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button> */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full md:w-auto"
                    ><Link to={`/organizer/events/edit/${event.id}`} className="flex items-center justify-center gap-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Event
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300 w-full md:w-auto"
                    >
                      <Link to={`/organizer/events/${event.id}`} className="flex items-center justify-center gap-1">
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

        {/* Pagination (if needed) */}
        {filteredEvents.length > 0 && (
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredEvents.length}</span> of{" "}
              <span className="font-medium">{events.length}</span> events
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-200 text-gray-400"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
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

export default EventList;