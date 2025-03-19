import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { EventService } from "../../lib/api";
import { Calendar, Clock, MapPin, Users, DollarSign, Upload, Info, Store, Tag, Layers, PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useNavigate } from "react-router-dom";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";

// Update the interface to include hasStalls
interface EditEventFormState {
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  maxCapacity: number;
  price: number;
  hasStalls: boolean; // Add hasStalls property
}

// Add Stall interface
interface Stall {
  id?: string;
  type: string;
  description: string;
  price: number;
  size: string;
  locationInVenue?: string;
  is_available?: boolean;
  event_id?: string;
}

const EditEventForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id: eventId } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [eventImages, setEventImages] = useState<File[]>([]);
  const [currentBannerUrl, setCurrentBannerUrl] = useState<string>("");
  const [currentEventImageUrls, setCurrentEventImageUrls] = useState<string[]>([]);
  
  // Add stalls state
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [currentStall, setCurrentStall] = useState<Stall>({
    type: "",
    description: "",
    price: 0,
    size: "",
    locationInVenue: ""
  });
  
  const [formData, setFormData] = useState<EditEventFormState>({
    title: "",
    description: "",
    eventType: "",
    startDate: "",
    endDate: "",
    location: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    maxCapacity: 0,
    price: 0,
    hasStalls: false, // Initialize hasStalls
  });

  // Update the useEffect to fetch stalls
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;

      try {
        setIsLoading(true);
        const response = await EventService.getOrganiserEventById(eventId);
        const event = response.data.event;

        // Format dates for datetime-local input
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
        };

        setFormData({
          title: event.title || "",
          description: event.description || "",
          eventType: event.event_type || "",
          startDate: formatDate(event.start_date),
          endDate: formatDate(event.end_date),
          location: event.location || "",
          address: event.address || "",
          city: event.city || "",
          state: event.state || "",
          country: event.country || "",
          zipCode: event.zip_code || "",
          maxCapacity: event.max_capacity || 0,
          price: event.price || 0,
          hasStalls: event.stalls && event.stalls.length > 0, // Set hasStalls based on existing stalls
        });

        // Set current image URLs
        if (event.banner_image) {
          setCurrentBannerUrl(`/uploads/${event.banner_image}`);
        }

        if (event.images && event.images.length > 0) {
          setCurrentEventImageUrls(event.images.map((img: any) => `/uploads/${img.image_url}`));
        }
        
        // Set stalls if they exist
        if (event.stalls && event.stalls.length > 0) {
          setStalls(event.stalls.map((stall: any) => ({
            id: stall.id,
            type: stall.type || stall.name, // Handle both type and name fields
            description: stall.description,
            price: parseFloat(stall.price),
            size: stall.size,
            locationInVenue: stall.location_in_venue,
            is_available: stall.is_available,
            event_id: stall.event_id
          })));
        }

      } catch (error: any) {
        console.error("Error fetching event details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event details. Please try again.",
        });
        navigate("/organizer/events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, navigate, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileValidation = (file: File, maxSizeMB: number = 5): boolean => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: `File must be less than ${maxSizeMB}MB.`,
      });
      return false;
    }
    return true;
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && handleFileValidation(file)) {
      setBannerImage(file);
      console.log('Banner Image Selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  };

  const handleEventImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(handleFileValidation);
      setEventImages(validFiles);
    }
  };

  // Add these function implementations that are missing
  
  // Add stall-related handlers
  const handleStallChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentStall(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleAddStall = () => {
    // Validate current stall
    if (!currentStall.type || !currentStall.description || !currentStall.price || !currentStall.size) {
      toast({
        variant: "destructive",
        title: "Incomplete Stall Information",
        description: "Please fill in all required stall details."
      });
      return;
    }
  
    // Add stall to list
    setStalls(prev => [...prev, currentStall]);
  
    // Reset current stall
    setCurrentStall({
      type: "",
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
  
  const toggleHasStalls = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasStalls: checked
    }));
  };
  
  // Fix the validateForm function to use formData.hasStalls instead of hasStalls
  const validateForm = (): boolean => {
    const {
      title,
      description,
      eventType,
      startDate,
      endDate,
      location,
      hasStalls
    } = formData;
  
    if (!title || !description || !eventType || !startDate || !endDate || !location) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return false;
    }
  
    if (new Date(startDate) > new Date(endDate)) {
      toast({
        variant: "destructive",
        title: "Invalid Dates",
        description: "End date must be after start date.",
      });
      return false;
    }
  
    // Validate stalls if hasStalls is true
    if (hasStalls && stalls.length === 0) {
      toast({
        variant: "destructive",
        title: "No Stalls",
        description: "Please add at least one stall to the event.",
      });
      return false;
    }
  
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (isSubmitting) return;

    // Create FormData explicitly
    const formDataToSend = new FormData();

    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      // Convert numbers to strings
      const stringValue = typeof value === 'number' ? value.toString() : 
        typeof value === 'boolean' ? value.toString() : value;
      formDataToSend.append(key, stringValue);
    });

    // CRUCIAL: Explicitly append banner image only if a new one is selected
    if (bannerImage) {
      formDataToSend.append('bannerImage', bannerImage, bannerImage.name);
    }

    // Append event images only if new ones are selected
    eventImages.forEach((image) => {
      formDataToSend.append('images', image, image.name);
    });
    
    // Append stalls if hasStalls is true
    if (formData.hasStalls) {
      formDataToSend.append('stalls', JSON.stringify(stalls));
    }

    try {
      setIsSubmitting(true);
      await EventService.updateEvent(eventId!, formDataToSend);

      toast({
        title: "Event Updated",
        description: "Your event has been updated successfully.",
      });

      // Navigate back to events list
      navigate("/organizer/events");

    } catch (error: any) {
      console.error("Event Update Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update the event.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm max-w-4xl mx-auto">
        <CardContent className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="ml-4 text-gray-600">Loading event details...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden max-w-4xl mx-auto">
      <CardHeader className="border-b border-gray-50 pb-6">
        <CardTitle className="text-2xl font-semibold text-gray-800">Edit Event</CardTitle>
        <CardDescription className="text-gray-500 mt-1">
          Update the details of your event
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
                <div className="relative">
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    required
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-gray-700 font-medium">Event Type</Label>
                <div className="relative">
                  <Input
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    placeholder="Conference, Workshop, etc."
                    required
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-3"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of your event"
                required
                rows={4}
                className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg resize-none"
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
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-gray-700 font-medium">End Date and Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={handleChange}
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

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700 font-medium">Venue Name</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Venue name"
                  required
                  className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700 font-medium">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-700 font-medium">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-gray-700 font-medium">State/Province</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State/Province"
                  className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-700 font-medium">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-gray-700 font-medium">Zip/Postal Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Zip/Postal Code"
                  className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-gray-100" />

          {/* Capacity and Pricing Section */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-lg font-medium text-gray-800">Capacity and Pricing</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxCapacity" className="text-gray-700 font-medium">Maximum Capacity</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="maxCapacity"
                    name="maxCapacity"
                    type="number"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                    placeholder="Maximum number of attendees"
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-700 font-medium">Ticket Price ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-gray-100" />

          {/* Stalls Toggle Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Store className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Stalls Management</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="hasStalls" className="text-sm text-gray-600">Enable Stalls</Label>
                <Switch
                  id="hasStalls"
                  checked={formData.hasStalls}
                  onCheckedChange={toggleHasStalls}
                />
              </div>
            </div>

            {formData.hasStalls && (
              <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                {/* Stall Form */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Add New Stall</h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stallName" className="text-gray-700 text-sm">Stall Type</Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="stallType"
                          name="type"
                          value={currentStall.type}
                          onChange={handleStallChange}
                          placeholder="Stall type"
                          className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stallSize" className="text-gray-700 text-sm">Size</Label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="stallSize"
                          name="size"
                          value={currentStall.size}
                          onChange={handleStallChange}
                          placeholder="e.g. 10x10 ft"
                          className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stallPrice" className="text-gray-700 text-sm">Registration fees ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="stallPrice"
                          name="price"
                          type="number"
                          step="0.01"
                          value={currentStall.price}
                          onChange={handleStallChange}
                          placeholder="0.00"
                          className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locationInVenue" className="text-gray-700 text-sm">Location in Venue</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="locationInVenue"
                          name="locationInVenue"
                          value={currentStall.locationInVenue}
                          onChange={handleStallChange}
                          placeholder="e.g. North Wing, Section A"
                          className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stallDescription" className="text-gray-700 text-sm">Description</Label>
                    <Textarea
                      id="stallDescription"
                      name="description"
                      value={currentStall.description}
                      onChange={handleStallChange}
                      placeholder="Describe the stall"
                      className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg resize-none min-h-[80px]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleAddStall}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Stall
                    </Button>
                  </div>
                </div>

                {/* Stalls List */}
                {stalls.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <h4 className="font-medium text-gray-700">Added Stalls ({stalls.length})</h4>
                    <div className="space-y-3">
                      {stalls.map((stall, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-800">{stall.type}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {stall.size}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  ${stall.price}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{stall.description}</p>
                              {stall.locationInVenue && (
                                <p className="text-xs text-gray-500 mt-1">
                                  <span className="font-medium">Location:</span> {stall.locationInVenue}
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveStall(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator className="my-6 bg-gray-100" />

          {/* Images Section */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <Upload className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-lg font-medium text-gray-800">Event Images</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bannerImage" className="text-gray-700 font-medium">Banner Image</Label>
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
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleBannerImageChange}
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

              <div className="space-y-2">
                <Label htmlFor="eventImages" className="text-gray-700 font-medium">Additional Event Images</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">Drag and drop additional event images here</p>
                    <p className="text-xs text-gray-500 mb-4">PNG, JPG or JPEG (max. 5MB each)</p>

                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="eventImages"
                        className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-md cursor-pointer transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Browse Files
                        <Input
                          id="eventImages"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          multiple
                          onChange={handleEventImagesChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {eventImages.length > 0 && (
                      <div className="mt-4 text-sm text-gray-600">
                        <p className="font-medium">Selected files: {eventImages.length}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {eventImages.map((image, index) => (
                            <div key={index} className="text-xs bg-gray-100 rounded-md px-2 py-1">
                              {image.name.length > 15 ? `${image.name.substring(0, 15)}...` : image.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/organizer/events")}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
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
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Event"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditEventForm;