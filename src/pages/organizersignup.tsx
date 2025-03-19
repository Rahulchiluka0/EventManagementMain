import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, Phone, User, UserCircle, Building, Globe, FileText, Calendar, Upload, CheckCircle, FileUp, CreditCard, AlertCircle, File } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthService } from "@/lib/api";
import { UserService } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { FileCheck, Eye } from "lucide-react";

const OrganizerSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReapplying, setIsReapplying] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Add file input refs
  const panCardRef = useRef<HTMLInputElement>(null);
  const canceledCheckRef = useRef<HTMLInputElement>(null);
  const agreementRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",

    // Organization Information
    organizationName: "",
    organizationType: "",
    website: "",
    description: "",

    // Additional Information
    pastExperience: "",
    eventTypes: [] as string[],
    taxId: "",

    // Document uploads
    panCard: null as File | null,
    canceledCheck: null as File | null,
    signedAgreement: null as File | null,

    // Document paths (for previously uploaded files)
    panCardPath: null as string | null,
    canceledCheckPath: null as string | null,
    agreementPath: null as string | null,

    // Terms and verification
    agreeToTerms: false,
    agreeToVerification: false
  });

  // Add file upload states
  const [fileErrors, setFileErrors] = useState({
    panCard: "",
    canceledCheck: "",
    signedAgreement: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [id]: checked }));
  };

  const handleEventTypeToggle = (type: string) => {
    setFormData(prev => {
      const currentTypes = [...prev.eventTypes];
      if (currentTypes.includes(type)) {
        return { ...prev, eventTypes: currentTypes.filter(t => t !== type) };
      } else {
        return { ...prev, eventTypes: [...currentTypes, type] };
      }
    });
  };

  // Add file handling functions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'panCard' | 'canceledCheck' | 'signedAgreement') => {
    const file = e.target.files?.[0] || null;
    console.log({ file });

    // Validate file
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setFileErrors(prev => ({
          ...prev,
          [fileType]: "File size exceeds 5MB limit"
        }));
        return;
      }

      // Check file type (PDF, JPG, PNG)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setFileErrors(prev => ({
          ...prev,
          [fileType]: "Only PDF, JPG, and PNG files are allowed"
        }));
        return;
      }

      // Clear any previous errors
      setFileErrors(prev => ({
        ...prev,
        [fileType]: ""
      }));
    }

    setFormData(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 3) {
      // Validate document uploads - check for either new uploads or existing paths
      const hasPanCard = formData.panCard || formData.panCardPath;
      const hasCanceledCheck = formData.canceledCheck || formData.canceledCheckPath;

      if (!hasPanCard || !hasCanceledCheck) {
        if (!hasPanCard) {
          setFileErrors(prev => ({
            ...prev,
            panCard: "PAN Card is required"
          }));
        }
        if (!hasCanceledCheck) {
          setFileErrors(prev => ({
            ...prev,
            canceledCheck: "Canceled Check is required"
          }));
        }
        return;
      }
    }

    if (step === 4) {
      // Validate agreement upload - check for either new upload or existing path
      const hasSignedAgreement = formData.signedAgreement || formData.agreementPath;
      if (!hasSignedAgreement) {
        setFileErrors(prev => ({
          ...prev,
          signedAgreement: "Signed Agreement is required"
        }));
        return;
      }
    }

    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  // Parse query parameters for reapplication
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reapply = queryParams.get('reapply');
    const userIdParam = queryParams.get('userId');

    if (reapply === 'true' && userIdParam) {
      setIsReapplying(true);
      setUserId(userIdParam);
      fetchExistingData(userIdParam);
    }
  }, [location]);

  // Function to fetch existing organizer data
  // Update the fetchExistingData function to handle document paths
  const fetchExistingData = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await UserService.getOrganizerProfile(userId);
      const userData = response.data;

      // Populate form with existing data
      setFormData(prev => ({
        ...prev,
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        organizationName: userData.organization_name || "",
        website: userData.website || "",
        description: userData.description || "",
        eventTypes: userData.event_types || [],
        taxId: userData.tax_id || "",
        // Store document paths instead of files
        panCardPath: userData.pan_card_path || null,
        canceledCheckPath: userData.canceled_check_path || null,
        agreementPath: userData.agreement_path || null,
      }));

      toast({
        title: "Data loaded",
        description: "Your previous application data has been loaded. Please update the necessary information.",
      });
    } catch (error) {
      console.error("Error fetching organizer data:", error);
      toast({
        title: "Error",
        description: "Failed to load your previous application data. Please fill in all fields.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log({ formData });

    try {
      // Create FormData for file uploads
      const formDataObj = new FormData();

      // Add all form fields to FormData
      formDataObj.append('firstName', formData.firstName);
      formDataObj.append('lastName', formData.lastName);
      formDataObj.append('email', formData.email);
      if (!isReapplying) {
        formDataObj.append('password', formData.password);
      }
      formDataObj.append('phone', formData.phone);
      formDataObj.append('organizationName', formData.organizationName);
      formDataObj.append('website', formData.website || '');
      formDataObj.append('description', formData.description);

      // Ensure eventTypes is a valid array before stringifying
      const eventTypesArray = Array.isArray(formData.eventTypes) ? formData.eventTypes : [];
      // Send as a properly formatted JSON string
      formDataObj.append('eventTypes', JSON.stringify(eventTypesArray));

      formDataObj.append('taxId', formData.taxId || '');

      // Log what files we have before appending
      console.log('Files to upload:', {
        panCard: formData.panCard,
        canceledCheck: formData.canceledCheck,
        signedAgreement: formData.signedAgreement
      });

      // Add files if they exist (new uploads)
      if (formData.panCard) {
        formDataObj.append('panCard', formData.panCard);
        console.log('Appending panCard file:', formData.panCard.name);
      } else if (formData.panCardPath) {
        // If using existing file, send the path as a string
        formDataObj.append('panCardPath', String(formData.panCardPath || ''));
      }

      if (formData.canceledCheck) {
        formDataObj.append('canceledCheck', formData.canceledCheck);
        console.log('Appending canceledCheck file:', formData.canceledCheck.name);
      } else if (formData.canceledCheckPath) {
        formDataObj.append('canceledCheckPath', String(formData.canceledCheckPath || ''));
      }

      if (formData.signedAgreement) {
        // Make sure this field name matches what the server expects
        formDataObj.append('agreement', formData.signedAgreement);
        console.log('Appending agreement file:', formData.signedAgreement.name);
      } else if (formData.agreementPath) {
        formDataObj.append('agreementPath', String(formData.agreementPath || ''));
      }

      // Log all form data entries to debug
      for (const pair of formDataObj.entries()) {
        console.log(
          pair[0],
          Object.prototype.toString.call(pair[1]) === "[object File]" ? `File: ${pair[1].name}` : pair[1]
        );
      }


      // Add reapplication flag and userId if reapplying
      if (isReapplying && userId) {
        formDataObj.append('isReapplying', 'true');
        formDataObj.append('userId', userId);

        // Call reapply API
        await UserService.reapplyOrganizer(formDataObj);

        toast({
          title: "Reapplication Submitted",
          description: "Your updated application has been submitted for review.",
        });

        navigate("/verification-pending");
      } else {
        // Regular registration for new users
        formDataObj.append('role', 'event_organizer');
        await AuthService.organizerRegister(formDataObj);
        navigate("/verification-pending");
      }
    } catch (error: any) {
      console.error("Organizer signup error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypeOptions = [
    "Concerts", "Conferences", "Workshops", "Sports",
    "Exhibitions", "Festivals", "Corporate", "Social"
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="absolute inset-0 bg-[url('/background-pattern.svg')] opacity-5 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl z-10 py-10"
      >
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl border border-gray-200 shadow-xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center"
            >
              <Calendar className="h-8 w-8 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isReapplying ? "Update Your Application" : "Event Organizer Registration"}
            </h2>
            <p className="text-gray-500 mt-1">
              {isReapplying
                ? "Please update the information that needs correction"
                : "Create and manage your own events on our platform"}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-blue-600">Loading your data...</p>
            </div>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex justify-between">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= i
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                          }`}
                      >
                        {step > i ? <CheckCircle className="h-5 w-5" /> : i}
                      </div>
                      <span className="text-xs mt-2 text-gray-600">
                        {i === 1 ? 'Personal' : i === 2 ? 'Organization' : i === 3 ? 'Documents' : 'Agreement'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Information - Unchanged */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                    {/* Existing personal information fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <div className="relative">
                          <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Organization Details - Unchanged */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Organization Details</h3>
                    {/* Existing organization fields */}
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="organizationName"
                          value={formData.organizationName}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="https://"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Organization Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="min-h-[100px]"
                        placeholder="Tell us about your organization..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Event Types You'll Organize</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {eventTypeOptions.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={formData.eventTypes.includes(type)}
                              onCheckedChange={() => handleEventTypeToggle(type)}
                            />
                            <label
                              htmlFor={`type-${type}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Document Uploads - New Step */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Verification</h3>

                    <div className="space-y-6">
                      {/* PAN Card Upload */}
                      <div className="space-y-3">
                        <Label htmlFor="panCard" className="text-gray-800">PAN Card</Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <input
                            type="file"
                            id="panCard"
                            ref={panCardRef}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'panCard')}
                          />
                          <div
                            className="flex flex-col items-center justify-center cursor-pointer"
                            onClick={() => triggerFileInput(panCardRef)}
                          >
                            {formData.panCard ? (
                              <div className="flex items-center space-x-2 text-blue-600">
                                <FileText className="h-6 w-6" />
                                <span className="font-medium">{formData.panCard.name}</span>
                              </div>
                            ) : formData.panCardPath ? (
                              <div className="flex flex-col items-center">
                                <div className="flex items-center space-x-2 text-green-600 mb-2">
                                  <FileCheck className="h-6 w-6" />
                                  <span className="font-medium">Previously uploaded</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center space-x-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewDocument(formData.panCardPath);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>View Document</span>
                                </Button>
                                <p className="text-xs text-gray-500 mt-2">Click to upload a new file if needed</p>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 text-center">
                                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 mt-1">PDF, JPG or PNG (max. 5MB)</p>
                              </>
                            )}
                          </div>
                        </div>
                        {fileErrors?.panCard && (
                          <p className="text-sm text-red-500 mt-1">{fileErrors.panCard}</p>
                        )}
                      </div>

                      {/* Canceled Check Upload */}
                      <div className="space-y-3">
                        <Label htmlFor="canceledCheck" className="text-gray-800">Canceled Check for Bank Details</Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <input
                            type="file"
                            id="canceledCheck"
                            ref={canceledCheckRef}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'canceledCheck')}
                          />
                          <div
                            className="flex flex-col items-center justify-center cursor-pointer"
                            onClick={() => triggerFileInput(canceledCheckRef)}
                          >
                            {formData.canceledCheck ? (
                              <div className="flex items-center space-x-2 text-blue-600">
                                <FileText className="h-6 w-6" />
                                <span className="font-medium">{formData.canceledCheck.name}</span>
                              </div>
                            ) : formData.canceledCheckPath ? (
                              <div className="flex flex-col items-center">
                                <div className="flex items-center space-x-2 text-green-600 mb-2">
                                  <FileCheck className="h-6 w-6" />
                                  <span className="font-medium">Previously uploaded</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center space-x-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewDocument(formData.canceledCheckPath);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>View Document</span>
                                </Button>
                                <p className="text-xs text-gray-500 mt-2">Click to upload a new file if needed</p>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 text-center">
                                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 mt-1">PDF, JPG or PNG (max. 5MB)</p>
                              </>
                            )}
                          </div>
                        </div>
                        {fileErrors?.canceledCheck && (
                          <p className="text-sm text-red-500 mt-1">{fileErrors.canceledCheck}</p>
                        )}
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Document Requirements</h3>
                            <div className="mt-2 text-sm text-blue-700">
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Documents must be clear and legible</li>
                                <li>All information should be clearly visible</li>
                                <li>Files must be less than 5MB in size</li>
                                <li>Accepted formats: PDF, JPG, PNG</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Agreement Upload - New Step */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Signed Agreement</h3>

                    <div className="space-y-6">
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 mb-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg className="h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800">Important</h3>
                            <div className="mt-2 text-sm text-amber-700">
                              <p>Please download the agreement document, sign it, and upload the signed copy below.</p>
                            </div>
                            <div className="mt-4">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
                                onClick={() => {
                                  // Logic to download agreement template
                                  alert("Agreement template download started");
                                }}
                              >
                                Download Agreement
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Signed Agreement Upload */}
                      <div className="space-y-3">
                        <Label htmlFor="signedAgreement" className="text-gray-800">Upload Signed Agreement</Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <input
                            type="file"
                            id="signedAgreement"
                            ref={agreementRef}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'signedAgreement')}
                          />
                          <div
                            className="flex flex-col items-center justify-center cursor-pointer"
                            onClick={() => triggerFileInput(agreementRef)}
                          >
                            {formData.signedAgreement ? (
                              <div className="flex items-center space-x-2 text-blue-600">
                                <FileText className="h-6 w-6" />
                                <span className="font-medium">{formData.signedAgreement.name}</span>
                              </div>
                            ) : formData.agreementPath ? (
                              <div className="flex flex-col items-center">
                                <div className="flex items-center space-x-2 text-green-600 mb-2">
                                  <FileCheck className="h-6 w-6" />
                                  <span className="font-medium">Previously uploaded</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center space-x-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewDocument(formData.agreementPath);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>View Document</span>
                                </Button>
                                <p className="text-xs text-gray-500 mt-2">Click to upload a new file if needed</p>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 text-center">
                                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 mt-1">PDF, JPG or PNG (max. 5MB)</p>
                              </>
                            )}
                          </div>
                        </div>
                        {fileErrors?.signedAgreement && (
                          <p className="text-sm text-red-500 mt-1">{fileErrors.signedAgreement}</p>
                        )}
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange('agreeToTerms', checked as boolean)
                            }
                            required
                          />
                          <label
                            htmlFor="agreeToTerms"
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            I confirm that I have read, understood, and signed the agreement
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between pt-6">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="px-6"
                    >
                      Back
                    </Button>
                  )}
                  {step < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="px-6 ml-auto"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="px-6 ml-auto bg-gradient-to-r from-blue-600 to-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : isReapplying
                          ? "Submit Updated Application"
                          : "Complete Registration"}
                    </Button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OrganizerSignup;

// Add a function to view documents
const viewDocument = (documentPath: string) => {
  // Create a full URL to the document
  const fullUrl = `http://localhost:3000/uploads/organizers/${documentPath}`;
  window.open(fullUrl, '_blank');
};