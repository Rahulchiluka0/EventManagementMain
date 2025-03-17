import { useLocation, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const VerificationRejected = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const reason = location.state?.reason || "No specific reason provided.";

  const handleReapply = () => {
    if (user && user.id) {
      // Navigate to organizer signup with userId as a query parameter
      navigate(`/organizer-signup?reapply=true&userId=${user.id}`);
    } else {
      // Fallback if user data is not available
      navigate('/organizer-signup');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="absolute inset-0 bg-[url('/background-pattern.svg')] opacity-5 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="backdrop-blur-sm bg-white/90 border border-gray-200 shadow-xl">
          <CardHeader className="space-y-1">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mx-auto mb-2 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
            >
              <XCircle className="h-8 w-8 text-red-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-center">Verification Rejected</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Your account verification has been rejected by our team.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Reason for Rejection</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{reason}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-center mt-4">
              Please address the issues mentioned above and resubmit your application with corrected information.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button 
              className="w-full" 
              variant="outline" 
              onClick={handleReapply}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reapply with Corrections
            </Button>
            <Button className="w-full" variant="default" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerificationRejected;