import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Share2, Tent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { StallService } from "../lib/api";

// Define TypeScript interfaces for type safety
interface Stall {
    id: string;
    name: string;
    description: string;
    price: string;
    size: string;
    location_in_venue: string | null;
    is_available: boolean;
}

interface StallEvent {
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
    organizer_name: string;
    price: string;
    stalls: Stall[];
}

const StallEventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [stallEvent, setStallEvent] = useState<StallEvent | null>(null);

    useEffect(() => {
        const fetchStallEvent = async () => {
            try {
                const response = await StallService.getStallEventById(id!);
                setStallEvent(response.data.stallEvent);
            } catch (error) {
                console.error("Error fetching stall event:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load stall event details.",
                });
            }
        };

        fetchStallEvent();
    }, [id, toast]);

    const handleBookNow = () => {
        navigate(`/booking/${id}`);
    };

    const handleShare = async () => {
        if (!stallEvent) return;

        const shareData = {
            title: stallEvent.title,
            text: stallEvent.description,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast({
                    title: "Shared successfully",
                    description: "The stall event has been shared.",
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast({
                    title: "Link copied",
                    description: "Stall event link has been copied to clipboard.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to share the stall event.",
            });
        }
    };

    const handleRegisterStall = async (stallId: string) => {
        if (!stallEvent) return;

        try {
            await StallService.requestStall(stallId, stallEvent.id);
            toast({
                title: "Stall Registered",
                description: "You have successfully registered for the stall.",
            });
        } catch (error) {
            console.error("Error registering stall:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to register for the stall. Please try again.",
            });
        }
    };

    if (!stallEvent) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-pulse text-xl">Loading event details...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Event Banner Section */}
                    <div className="relative h-[400px]">
                        <img
                            src={`http://localhost:3000/uploads/${stallEvent.banner_image}`}
                            alt={stallEvent.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h1 className="text-4xl font-bold mb-2">{stallEvent.title}</h1>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span>{new Date(stallEvent.start_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-5 h-5 mr-2" />
                                    <span>{new Date(stallEvent.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    <span>{stallEvent.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-grow">
                                {/* Event Description */}
                                <h2 className="text-2xl font-semibold mb-4">About This Stall Event</h2>
                                <p className="text-gray-600 mb-6">{stallEvent.description || "No additional details available."}</p>

                                {/* Venue Information */}
                                <h3 className="text-xl font-semibold mb-3">Venue Information</h3>
                                <p className="text-gray-600 mb-6">
                                    Located at {stallEvent.address}, {stallEvent.city}, {stallEvent.state}, {stallEvent.country} - Zip Code: {stallEvent.zip_code}.
                                </p>

                                {/* Organizer Information */}
                                <h3 className="text-xl font-semibold mb-3">Organizer Information</h3>
                                <p className="text-gray-600 mb-6">
                                    Organized by: {stallEvent.organizer_name}
                                </p>

                                {/* Stalls Section with Card Layout */}
                                <h3 className="text-xl font-semibold mb-3">Available Stalls</h3>
                                {stallEvent.stalls.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {stallEvent.stalls.map(stall => (
                                            <div
                                                key={stall.id}
                                                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-center mb-4">
                                                        <Tent className="w-8 h-8 text-primary mr-3" />
                                                        <h4 className="text-xl font-bold">{stall.name}</h4>
                                                    </div>
                                                    <p className="text-gray-600 mb-3">{stall.description}</p>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div className="flex items-center">
                                                            <span className="font-semibold mr-2">Price:</span>
                                                            <span className="text-primary">${stall.price}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="font-semibold mr-2">Size:</span>
                                                            <span>{stall.size}</span>
                                                        </div>
                                                        {stall.location_in_venue && (
                                                            <div className="col-span-2 flex items-center">
                                                                <span className="font-semibold mr-2">Location:</span>
                                                                <span>{stall.location_in_venue}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-4">
                                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                            {stall.is_available ? 'Available' : 'Booked'}
                                                        </span>
                                                    </div>
                                                    {stall.is_available && (
                                                        <Button
                                                            className="mt-4 w-full"
                                                            onClick={() => handleRegisterStall(stall.id)}
                                                        >
                                                            Register Stall
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No stalls available for this event.</p>
                                )}
                            </div>

                            {/* Booking Section */}
                            <div className="md:w-80">
                                <div className="bg-neutral p-6 rounded-lg">

                                    <Button
                                        variant="outline"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share Stall Event
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StallEventDetails;