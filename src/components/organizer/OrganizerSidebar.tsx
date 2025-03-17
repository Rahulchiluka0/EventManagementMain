import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  Store,
  ClipboardList,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  {
    name: "Dashboard",
    href: "/organizer",
    icon: LayoutDashboard,
  },
  {
    name: "My Events",
    href: "/organizer/events",
    icon: Calendar,
  },
  {
    name: "My Stall Events",
    href: "/organizer/stall-events",
    icon: Store,
  },
  {
    name: "Stall Requests",
    href: "/organizer/stall-requests",
    icon: ClipboardList,
  },
  {
    name: "Bookings",
    href: "/organizer/bookings",
    icon: Users,
  },
  {
    name: "Sales",
    href: "/organizer/sales",
    icon: DollarSign,
  },
];

const OrganizerSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toggle button for mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
          <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
            <span className={`block h-0.5 w-5 bg-gray-600 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-5 bg-gray-600 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-5 bg-gray-600 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      )}

      <div
        className={cn(
          "h-screen flex-col bg-white/90 backdrop-blur-sm border-r border-gray-100 shadow-sm transition-all duration-300 ease-in-out z-40",
          isMobile ? "fixed left-0 top-0 bottom-0" : "hidden lg:flex fixed left-0 top-0 bottom-0",
          isCollapsed && !isMobile ? "w-20" : "w-64",
          isMobile && (isOpen ? "translate-x-0" : "-translate-x-full")
        )}
      >
        <div className={cn(
          "p-6 flex items-center",
          isCollapsed && !isMobile ? "justify-center" : "justify-between"
        )}>
          <Link to="/organizer" className="flex items-center space-x-2 overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <span className="text-xl font-bold text-primary">E</span>
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-800 leading-tight">EventHub</span>
                <span className="text-xs font-medium text-gray-500">Organizer Portal</span>
              </div>
            )}
          </Link>

          {/* {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <ChevronRight className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-300",
                isCollapsed ? "" : "rotate-180"
              )} />
            </button>
          )} */}
        </div>

        <div className="px-4 py-2">
          <div className={cn(
            "h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent",
            isCollapsed && !isMobile ? "w-10 mx-auto" : ""
          )} />
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <ul className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link to={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full transition-all duration-200 group",
                        isCollapsed && !isMobile ? "justify-center px-2" : "justify-start",
                        isActive
                          ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                          : "text-gray-600 hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-all",
                        isActive ? "text-white" : "text-gray-500 group-hover:text-primary",
                        isCollapsed && !isMobile ? "" : "mr-3"
                      )} />
                      {(!isCollapsed || isMobile) && (
                        <span className={cn(
                          "font-medium",
                          isActive ? "" : "group-hover:translate-x-1 transition-transform duration-200"
                        )}>
                          {item.name}
                        </span>
                      )}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          <div className={cn(
            "h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4",
            isCollapsed && !isMobile ? "w-10 mx-auto" : ""
          )} />

          <Button
            variant="ghost"
            className={cn(
              "w-full transition-all duration-200 text-gray-600 hover:text-red-500 hover:bg-red-50 group",
              isCollapsed && !isMobile ? "justify-center px-2" : "justify-start"
            )}
            onClick={logout}
          >
            <LogOut className={cn(
              "h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors",
              isCollapsed && !isMobile ? "" : "mr-3"
            )} />
            {(!isCollapsed || isMobile) && (
              <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                Logout
              </span>
            )}
          </Button>

          {(!isCollapsed || isMobile) && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} EventHub
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrganizerSidebar;