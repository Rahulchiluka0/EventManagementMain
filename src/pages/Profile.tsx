import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, User } from "lucide-react";
import { AuthService, UserService } from "@/lib/api";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await UserService.getUserProfile();
        const userData = response.data.user;
        setProfile(userData);
        setFormData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Call the API to update the user profile
      await UserService.updateUserProfile(formData);

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });

      // Refresh the profile data
      const response = await AuthService.getCurrentUser();
      setProfile(response.data.user);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col items-center backdrop-blur-sm bg-white/30 p-10 rounded-2xl shadow-sm">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary mb-6"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-6 border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-800">Edit Profile</CardTitle>
            <CardDescription className="text-gray-600">
              Update your personal information
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="pt-8 space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center mb-4 shadow-inner border-4 border-white">
                  <User className="h-12 w-12 text-gray-500" />
                </div>
                <p className="text-sm text-gray-500">Profile photo coming soon</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-gray-700">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-gray-700">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="number" className="text-gray-700">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Account Type</Label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 font-medium capitalize">{profile?.role || "User"}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end border-t border-gray-100 pt-6">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 py-2.5 shadow-md transition-all duration-300"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;