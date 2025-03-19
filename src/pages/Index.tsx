import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Calendar, MapPin, Clock, ChevronRight, Tag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventService, StallService } from "../lib/api";
import { motion } from "framer-motion";
import debounce from "lodash.debounce"; // Import debounce from lodash

// Define the type for the event
interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  price: string;
  banner_image: string;
}

// Define the type for the stall event
interface StallEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  price: string;
  banner_image: string;
}

const Index = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [events, setEvents] = useState<Event[]>([]);
  const [stallEvents, setStallEvents] = useState<StallEvent[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const searchQuery = searchParams.get("search") || "";
  const eventsRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleExplore = () => {
    eventsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Memoize filtered events to avoid recalculating on every render
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesCategory = selectedCategory === "All" || event.event_type === selectedCategory;
      const matchesSearch = searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const filteredStallEvents = useMemo(() => {
    return stallEvents.filter(stallEvent => {
      const matchesSearch = searchQuery === "" ||
        stallEvent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stallEvent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stallEvent.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [stallEvents, searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        const response = await EventService.getAllEvents();
        const fetchedEvents = response.data.events;

        // Set the events state
        setEvents(fetchedEvents);

        // Update categories based on event_type
        const uniqueCategories = Array.from(new Set(fetchedEvents.map(event => event.event_type)));
        setCategories(["All", ...uniqueCategories]);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    // Fetch stall events from the API
    const fetchStallEvents = async () => {
      try {
        const response = await StallService.getAllStallEvents();
        const fetchedStallEvents = response.data.stallEvents;

        // Set the stall events state
        setStallEvents(fetchedStallEvents);
      } catch (error) {
        console.error("Error fetching stall events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
    fetchStallEvents();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory("All");
    }
  }, [searchQuery]);

  // Debounce the search input to optimize performance
  const debouncedSearch = useRef(debounce((query) => {
    // Handle search logic here if needed
  }, 300)).current;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[550px] bg-gradient-to-r from-primary/90 to-secondary/90 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-bg.svg')] opacity-10" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover <span className="text-white/90">Amazing</span> Events
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl text-white/80 leading-relaxed">
            Book tickets for the most exciting events happening around you
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              className="w-fit bg-white text-primary hover:bg-white/90 hover:text-primary/90 transition-all duration-300 rounded-full px-8 shadow-lg hover:shadow-xl"
              onClick={handleExplore}
            >
              Explore Events
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse by Category</h2>
          <div className="h-1 w-20 bg-primary rounded-full"></div>
        </motion.div>
        <motion.div
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {categories.map(category => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-6 py-2 transition-all duration-300 ${selectedCategory === category
                  ? "text-white shadow-md"
                  : "hover:border-primary/70 hover:text-primary"
                  }`}
              >
                <Tag className={`mr-2 h-4 w-4 ${selectedCategory === category ? "text-white" : "text-gray-500"}`} />
                {category}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Events Grid */}
      <section ref={eventsRef} className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Upcoming Events"}
            </h2>
            <p className="text-gray-500 mt-2">Discover and book your next experience</p>
          </div>
          {filteredEvents.length === 0 && searchQuery && (
            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
              className="rounded-full border-gray-300 hover:border-primary hover:text-primary transition-all duration-300"
            >
              <Search className="mr-2 h-4 w-4" />
              Clear Search
            </Button>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-50/50 rounded-2xl backdrop-blur-sm border border-gray-100"
          >
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No events found</p>
            <p className="text-gray-500">Try adjusting your search criteria or browse different categories</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  to={`/events/${event.id}`}
                  className="group block bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={`http://localhost:3000/uploads/${event.banner_image}`}
                      alt={event.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 " loading="lazy" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold text-primary shadow-sm">
                      ${event.price}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300 line-clamp-1">
                        {event.title}
                      </h3>
                      <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {event.event_type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{event.description}</p>
                    <div className="space-y-2 border-t border-gray-100 pt-4 mt-4">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                        <span className="text-sm">{new Date(event.start_date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-2 text-primary/70" />
                        <span className="text-sm">{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                        <span className="text-sm line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-0">
                    <Button
                      className="w-full rounded-full bg-gray-50 hover:bg-primary hover:text-white text-gray-700 transition-all duration-300"
                      variant="outline"
                    >
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Stall Events Grid */}
      <section className="container mx-auto px-4 py-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {searchQuery ? `Stall Results for "${searchQuery}"` : "Upcoming Stall Events"}
            </h2>
            <p className="text-gray-500 mt-2">Find the perfect stall for your business</p>
          </div>
          {filteredStallEvents.length === 0 && searchQuery && (
            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
              className="rounded-full border-gray-300 hover:border-primary hover:text-primary transition-all duration-300"
            >
              <Search className="mr-2 h-4 w-4" />
              Clear Search
            </Button>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredStallEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-50/50 rounded-2xl backdrop-blur-sm border border-gray-100"
          >
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No stall events found</p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStallEvents.map(stallEvent => (
              <motion.div
                key={stallEvent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  to={`/stalls/${stallEvent.id}`}
                  className="group block bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={`http://localhost:3000/uploads/${stallEvent.banner_image}`}
                      alt={stallEvent.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold text-primary shadow-sm">
                      ${stallEvent.price}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300 line-clamp-1 mb-2">
                      {stallEvent.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{stallEvent.description}</p>
                    <div className="space-y-2 border-t border-gray-100 pt-4 mt-4">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                        <span className="text-sm">{new Date(stallEvent.start_date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-2 text-primary/70" />
                        <span className="text-sm">{new Date(stallEvent.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                        <span className="text-sm line-clamp-1">{stallEvent.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-0">
                    <Button
                      className="w-full rounded-full bg-gray-50 hover:bg-primary hover:text-white text-gray-700 transition-all duration-300"
                      variant="outline"
                    >
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50/70 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">Subscribe to our newsletter to get the latest updates on events</p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="h-12 rounded-full bg-white border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
              <Button
                className="h-12 rounded-full px-8 text-white shadow-md hover:shadow-lg transition-all duration -200"
              >
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-white border-t border-gray-100 py-12">
                  <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">EventHub</h3>
                        <p className="text-gray-600 mb-4">Discover and book amazing events happening around you.</p>
                        <div className="flex space-x-4">
                          <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                          </a>
                          <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                          </a>
                          <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                          <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Home</a></li>
                          <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Events</a></li>
                          <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Stalls</a></li>
                          <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">About Us</a></li>
                          <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
                        <ul className="space-y-2">
                          {categories.slice(0, 5).map(category => (
                            <li key={category}>
                              <a 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedCategory(category);
                                  eventsRef.current?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="text-gray-600 hover:text-primary transition-colors"
                              >
                                {category}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Contact Us</h3>
                        <address className="not-italic">
                          <p className="text-gray-600 mb-2">123 Event Street</p>
                          <p className="text-gray-600 mb-2">San Francisco, CA 94103</p>
                          <p className="text-gray-600 mb-2">Email: info@eventhub.com</p>
                          <p className="text-gray-600">Phone: (123) 456-7890</p>
                        </address>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 mt-12 pt-8 text-center">
                      <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} EventHub. All rights reserved.
                      </p>
                    </div>
                  </div>
                </footer> */}
    </div>
  );
};

export default Index;