import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { StallService } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Trash2, PlusCircle } from "lucide-react";

// Stall interface for type safety
interface Stall {
  name: string;
  description: string;
  price: number;
  size: string;
  locationInVenue?: string;
}

const StallEventForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [stalls, setStalls] = useState<Stall[]>([]);

  // Stall form state
  const [currentStall, setCurrentStall] = useState<Stall>({
    name: "",
    description: "",
    price: 0,
    size: "",
    locationInVenue: ""
  });

  const handleAddStall = () => {
    // Validate current stall
    if (!currentStall.name || !currentStall.description || !currentStall.price || !currentStall.size) {
      toast({
        variant: "destructive",
        title: "Incomplete Stall Information",
        description: "Please fill in all required stall details."
      });
      return;
    }

    // Add stall to list
    setStalls([...stalls, currentStall]);

    // Reset current stall
    setCurrentStall({
      name: "",
      description: "",
      price: 0,
      size: "",
      locationInVenue: ""
    });
  };

  const handleRemoveStall = (index: number) => {
    const updatedStalls = stalls.filter((_, i) => i !== index);
    setStalls(updatedStalls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (stalls.length === 0) {
      toast({
        variant: "destructive",
        title: "No Stalls",
        description: "Please add at least one stall to the event."
      });
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startDate", new Date(startDate).toISOString());
    formData.append("endDate", new Date(endDate).toISOString());
    formData.append("location", location);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("zipCode", zipCode);

    // Append banner image
    if (bannerImage) {
      formData.append("bannerImage", bannerImage);
    }

    // Append stalls
    formData.append("stalls", JSON.stringify(stalls));

    try {
      const response = await StallService.createStallEvent(formData);

      toast({
        title: "Event Created",
        description: "Your stall event has been submitted for review.",
      });

      // Navigate to events list or event details
      navigate("/stall-organizer/events");
    } catch (error) {
      console.error("Error creating stall event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create stall event. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Stall Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Details Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Event Location</Label>
                <Input
                  id="location"
                  placeholder="Event location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your event"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Date and Time Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Street address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  placeholder="Zip Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Banner Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="bannerImage">Banner Image</Label>
              <Input
                id="bannerImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setBannerImage(file);
                }}
                required
              />
            </div>

            {/* Stalls Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stalls</h3>

              {/* Current Stalls List */}
              {stalls.map((stall, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{stall.name}</p>
                    <p className="text-sm text-muted-foreground">{stall.description}</p>
                    <div className="text-sm">
                      Price: ${stall.price} | Size: {stall.size}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveStall(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Add Stall Form */}
              <div className="border p-4 rounded-lg space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stallName">Stall Name</Label>
                    <Input
                      id="stallName"
                      placeholder="Enter stall name"
                      value={currentStall.name}
                      onChange={(e) => setCurrentStall({ ...currentStall, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stallSize">Stall Size</Label>
                    <Input
                      id="stallSize"
                      placeholder="Stall size (e.g. 10x10)"
                      value={currentStall.size}
                      onChange={(e) => setCurrentStall({ ...currentStall, size: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stallDescription">Stall Description</Label>
                  <Input
                    id="stallDescription"
                    placeholder="Describe the stall"
                    value={currentStall.description}
                    onChange={(e) => setCurrentStall({ ...currentStall, description: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stallPrice">Stall Price</Label>
                    <Input
                      id="stallPrice"
                      type="number"
                      placeholder="Price"
                      value={currentStall.price}
                      onChange={(e) => setCurrentStall({ ...currentStall, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stallLocation">Location in Venue</Label>
                    <Input
                      id="stallLocation"
                      placeholder="Location in venue"
                      value={currentStall.locationInVenue}
                      onChange={(e) => setCurrentStall({ ...currentStall, locationInVenue: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddStall}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Stall
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Submit Event for Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StallEventForm;