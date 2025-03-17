import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, LogIn, Mail, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response: any = await login(email, password);

      // Check user role and verification status
      if (response?.user?.role === "event_organizer") {
        const status = response?.user?.verificationStatus;
        console.log("status", status);

        if (status === "pending") {
          navigate("/verification-pending");
        }
        else if (status === "rejected") {
          // Store rejection reason and navigate to rejection page
          const rejectionReason = response.rejectionReason || "No specific reason provided.";
          navigate("/verification-rejected", {
            state: {
              reason: rejectionReason
            }
          });

        } else if (status === "verified") {
          navigate("/organizer");
        }
      } else {
        // For other users, navigate to the dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to login. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
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
              className="mx-auto mb-2 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <LogIn className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="mb-6 border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 font-medium text-base text-white shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline transition-all duration-200">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="text-center mt-6 text-gray-500 text-sm">
          © {new Date().getFullYear()} Event Management. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

export default Login;