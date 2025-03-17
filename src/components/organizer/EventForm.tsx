import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { EventService } from "../../lib/api";
import { Calendar, Clock, MapPin, Users, DollarSign, Upload, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EventFormState {
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
}

const EventForm: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [eventImages, setEventImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<EventFormState>({
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
  });

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

  const validateForm = (): boolean => {
    const {
      title,
      description,
      eventType,
      startDate,
      endDate,
      location,
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

    if (!bannerImage) {
      toast({
        variant: "destructive",
        title: "Missing Banner",
        description: "Please upload a banner image.",
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
      const stringValue = typeof value === 'number' ? value.toString() : value;
      formDataToSend.append(key, stringValue);
    });

    // CRUCIAL: Explicitly append banner image 
    if (bannerImage) {
      // Use 'bannerImage' key to match server-side expectation
      formDataToSend.append('bannerImage', bannerImage, bannerImage.name);
    }

    // Append event images
    eventImages.forEach((image) => {
      formDataToSend.append('images', image, image.name);
    });

    // Detailed logging of FormData contents
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`FormData - ${key}:`, value);
    }

    try {
      setIsSubmitting(true);
      const response = await EventService.createEvent(formDataToSend);

      toast({
        title: "Event Created",
        description: "Your event has been created successfully and is pending review.",
      });

      // Reset form
      setFormData({
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
      });
      setBannerImage(null);
      setEventImages([]);

    } catch (error: any) {
      console.error("Event Creation Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create the event.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden max-w-4xl mx-auto">
      <CardHeader className="border-b border-gray-50 pb-6">
        <CardTitle className="text-2xl font-semibold text-gray-800">Create New Event</CardTitle>
        <CardDescription className="text-gray-500 mt-1">
          Fill in the details below to create your event
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
                  <select
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
                    required
                    className="w-full border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 rounded-lg pl-3 py-2 pr-10 appearance-none"
                  >
                    <option value="" disabled>Select event type</option>
                    <option value="concert">Concert</option>
                    <option value="festival">Festival</option>
                    <option value="competition">Competition</option>
                    <option value="workshop">Workshop</option>
                    <option value="conference">Conference</option>
                    <option value="exhibition">Exhibition</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
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
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;