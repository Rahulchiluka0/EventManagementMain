import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { StallService } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Trash2, PlusCircle, Calendar, MapPin, DollarSign, Info, Upload, Layers, Tag, Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setStalls((pre) => [...pre, currentStall]);

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
      setIsSubmitting(true);
      const response = await StallService.createStallEvent(formData);

      toast({
        title: "Event Created",
        description: "Your stall event has been submitted for review.",
      });

      // Navigate to events list or event details
      navigate("/organizer/stall-events");
    } catch (error) {
      console.error("Error creating stall event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create stall event. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden max-w-4xl mx-auto">
        <CardHeader className="border-b border-gray-50 pb-6">
          <CardTitle className="text-2xl font-semibold text-gray-800">Create New Stall Event</CardTitle>
          <CardDescription className="text-gray-500 mt-1">
            Fill in the details below to create your stall event
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Basic Information</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700 font-medium">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 font-medium">Event Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="Event location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg resize-none min-h-[120px]"
                />
              </div>
            </div>

            <Separator className="my-6 bg-gray-100" />

            {/* Date and Time Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Date and Time</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-gray-700 font-medium">Start Date and Time</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-gray-700 font-medium">End Date and Time</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-gray-100" />

            {/* Location Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Location Details</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="address" className="text-gray-700 font-medium">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="Street address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-700 font-medium">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-700 font-medium">State/Province</Label>
                  <Input
                    id="state"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-gray-700 font-medium">Zip/Postal Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-700 font-medium">Country</Label>
                  <Input
                    id="country"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-gray-100" />

            {/* Banner Image Upload */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Upload className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Event Banner</h3>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">Drag and drop your banner image here</p>
                  <p className="text-xs text-gray-500 mb-4">PNG, JPG or JPEG (max. 5MB)</p>

                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="bannerImage"
                      className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-md cursor-pointer transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                      <Input
                        id="bannerImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setBannerImage(file);
                        }}
                        required
                        className="hidden"
                      />
                    </label>
                  </div>

                  {bannerImage && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p className="font-medium">Selected file:</p>
                      <p>{bannerImage.name} ({(bannerImage.size / (1024 * 1024)).toFixed(2)} MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-gray-100" />

            {/* Stalls Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Layers className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Stalls Information</h3>
              </div>

              {/* Current stalls list */}
              {stalls.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Added Stalls ({stalls.length})</h4>
                  <div className="space-y-3">
                    {stalls.map((stall, index) => (
                      <div
                        key={index}
                        className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                              <Store className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-800">{stall.name}</h5>
                              <div className="flex items-center flex-wrap gap-2 mt-1">
                                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0">
                                  {stall.size}
                                </Badge>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">
                                  ${stall.price}
                                </Badge>
                                {stall.locationInVenue && (
                                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {stall.locationInVenue}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveStall(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{stall.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add new stall form */}
              <div className="bg-gray-50/80 backdrop-blur-sm p-5 rounded-xl border border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Add New Stall</h4>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="stallName" className="text-gray-700 font-medium">Stall Name</Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="stallName"
                        placeholder="Enter stall name"
                        value={currentStall.name}
                        onChange={(e) => setCurrentStall({ ...currentStall, name: e.target.value })}
                        className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stallSize" className="text-gray-700 font-medium">Stall Size</Label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="stallSize"
                        placeholder="e.g. 10x10 ft, Small, Large"
                        value={currentStall.size}
                        onChange={(e) => setCurrentStall({ ...currentStall, size: e.target.value })}
                        className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="stallPrice" className="text-gray-700 font-medium">Price ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="stallPrice"
                        type="number"
                        placeholder="0.00"
                        value={currentStall.price || ""}
                        onChange={(e) => setCurrentStall({ ...currentStall, price: parseFloat(e.target.value) })}
                        className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stallLocation" className="text-gray-700 font-medium">Location in Venue (Optional)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="stallLocation"
                        placeholder="e.g. North Wing, Hall A"
                        value={currentStall.locationInVenue || ""}
                        onChange={(e) => setCurrentStall({ ...currentStall, locationInVenue: e.target.value })}
                        className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="stallDescription" className="text-gray-700 font-medium">Description</Label>
                  <Textarea
                    id="stallDescription"
                    placeholder="Describe this stall"
                    value={currentStall.description}
                    onChange={(e) => setCurrentStall({ ...currentStall, description: e.target.value })}
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg resize-none min-h-[100px]"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleAddStall}
                  className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Stall
                </Button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300 min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Stall Event"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StallEventForm;