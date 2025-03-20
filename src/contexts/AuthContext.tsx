import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "../lib/api"; // Updated import path

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  verificationStatus: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthRedirect = useCallback((role: string) => {
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "event_organizer":
        navigate("/organizer");
        break;
      case "stall_manager":
        navigate("/stall-manager");
        break;
      case "user":
        navigate("/");
        break;
      default:
        navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await AuthService.getCurrentUser();
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };


    // Only try to fetch user if there's a token
    if (localStorage.getItem('token')) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      setUser(response.data.user);
      setIsAuthenticated(true);

      // Store the token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      if (response.data.user.role === "event_organizer" && response.data.user.verificationStatus === "pending") {
        navigate("/verification-pending");
      }
      else if (response.data.user.role === "event_organizer" && response.data.user.verificationStatus === "rejected") {
        navigate("/verification-rejected");
      } else if (response.data.user.role === "event_organizer" && response.data.user.verificationStatus === "verified") {
        navigate("/organizer");
      } else if (response.data.user.role === "admin") {
        navigate("/admin");
      }
      else {
        navigate("/");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      const response = await AuthService.register(userData);

      // Store token if it was returned
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      setUser(response.data.user);
      handleAuthRedirect(response.data.user.role);
      toast({
        title: "Registration Successful!",
        description: "Your account has been created.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Registration failed",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      localStorage.removeItem('token');
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};