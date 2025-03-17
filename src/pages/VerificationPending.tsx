import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const VerificationPending = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="absolute inset-0 bg-[url('/background-pattern.svg')] opacity-5 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl z-10 py-10"
      >
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl border border-gray-200 shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Clock className="h-10 w-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Pending</h1>
            <p className="text-gray-600">
              Your organizer account is currently under review by our team.
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-6 border border-amber-100 mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="ml-3 text-left">
                <h3 className="font-medium text-amber-800">Verification in Progress</h3>
                <p className="mt-2 text-amber-700 text-sm">
                  We're currently reviewing your submitted documents. This process typically takes 2-3 business days to complete.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium">1</span>
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-medium text-gray-800">Document Review</h3>
                <p className="text-gray-600 text-sm">Our team is reviewing your submitted documents</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium">2</span>
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-medium text-gray-800">Background Check</h3>
                <p className="text-gray-600 text-sm">Verifying your organization details</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium">3</span>
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-medium text-gray-800">Final Approval</h3>
                <p className="text-gray-600 text-sm">Once approved, you'll receive an email notification</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-8">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="ml-3 text-left">
                <h3 className="font-medium text-blue-800">What's Next?</h3>
                <p className="mt-2 text-blue-700 text-sm">
                  You'll receive an email notification once your account is verified. After verification, you'll be able to create and manage events on our platform.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button variant="outline" onClick={() => logout()}>
              <p>Sign out</p>
            </Button>

            <p className="text-sm text-gray-500">
              Have questions? <a href="mailto:support@eventmanagement.com" className="text-blue-600 hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationPending;