import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Search, User, LogOut, Menu, X, Bell, Calendar, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthService, UserService } from "@/lib/api";


interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const Navbar = () => {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await AuthService.getCurrentUser();
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Error fetching current user:", error);
        // If we can't fetch the user, we'll assume they're not logged in
        setCurrentUser(null);
      } finally {
        setAuthChecked(true);
      }
    };

    fetchCurrentUser();
  }, [isAuthenticated]);

  // Update currentUser when auth context user changes
  useEffect(() => {
    if (user) {
      setCurrentUser({
        id: user.id,
        firstName: user.first_name || user.firstName,
        lastName: user.last_name || user.lastName,
        email: user.email,
        role: user.role
      });
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    setMobileMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Determine if user is authenticated by checking both context and local state
  const userAuthenticated = isAuthenticated || !!currentUser;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/80 backdrop-blur-xl shadow-sm"
        : "bg-white/60 backdrop-blur-md"
        } border-b border-gray-100`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-red-400 rounded-full opacity-90"></div>
                <span className="relative text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.form
              onSubmit={handleSearch}
              className="relative hidden md:block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 pr-4 h-9 rounded-full bg-gray-50/80 border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200"
                />
              </div>
            </motion.form>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-9 w-9 rounded-full hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-700" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-700" />
                )}
              </Button>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-3">
              {userAuthenticated ? (
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-full bg-gray-50 hover:bg-gray-100"
                  >
                    <Bell className="h-4 w-4 text-gray-600" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]">
                      3
                    </Badge>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="rounded-full p-3 h-9 hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8 border border-gray-200">
                            {/* <AvatarImage src={currentUser?.avatar} /> */}
                            <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white text-sm">
                              {currentUser ? getInitials(currentUser?.firstName + " " + currentUser?.lastName) : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-800 line-clamp-1">
                              {currentUser?.firstName + " " + currentUser?.lastName || "User"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {currentUser?.role === "admin"
                                ? "Admin"
                                : currentUser?.role === "event_organizer"
                                  ? "Organizer"
                                  : currentUser?.role === "stall_manager"
                                    ? "Manager"
                                    : "User"}
                            </span>
                          </div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 mt-1 bg-white/90 backdrop-blur-lg border border-gray-100 shadow-lg rounded-xl p-1"
                    >
                      <DropdownMenuLabel className="text-gray-500 text-xs font-normal px-3 pt-2 pb-1">
                        Account
                      </DropdownMenuLabel>
                      <Link
                        to={
                          currentUser?.role === "admin"
                            ? "/admin"
                            : currentUser?.role === "event_organizer"
                              ? "/organizer"
                              : currentUser?.role === "stall_manager"
                                ? "/stall-manager"
                                : "/dashboard"
                        }
                      >
                        <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 py-2">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/profile">
                        <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 py-2">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator className="my-1 bg-gray-100" />
                      <DropdownMenuItem
                        className="rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 hover:text-red-700 py-2"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="rounded-full px-5 h-9 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="rounded-full px-5 h-9 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-sm hover:shadow transition-all duration-200">
                      Sign Up
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 bg-white/90 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 h-10 rounded-full bg-gray-50/80 border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </form>

              <div className="space-y-1 pt-2">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start rounded-lg px-3 py-2 ${location.pathname === "/"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    <span>Home</span>
                  </Button>
                </Link>
                <Link to="/events" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start rounded-lg px-3 py-2 ${location.pathname.includes("/events")
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Events</span>
                  </Button>
                </Link>
              </div>

              {userAuthenticated ? (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-3 px-2 py-3">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarImage src={currentUser?.avatar || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                        {currentUser?.firstName ? getInitials(currentUser?.firstName + " " + currentUser?.lastName) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {currentUser?.firstName + " " + currentUser?.lastName || "User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {currentUser?.role === "stall_manager"
                          ? "Stall Manager"
                          : currentUser?.role === "event_organizer"
                            ? "Organizer"
                            : "User"}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={
                      currentUser?.role === "admin"
                        ? "/admin"
                        : currentUser?.role === "event_organizer"
                          ? "/organizer"
                          : currentUser?.role === "stall_manager"
                            ? "/stall-manager"
                            : "/dashboard"
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-lg px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-lg px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <span>Login</span>
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start rounded-lg px-3 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600">
                      <span>Sign Up</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
