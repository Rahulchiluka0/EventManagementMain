import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Calendar,
  DollarSign,
  Settings,
  ChevronRight,
  LogOut,
  HelpCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  {
    name: "Dashboard",
    href: "/stall-manager",
    icon: LayoutDashboard,
  },
  {
    name: "My Stalls",
    href: "/stall-manager/stalls",
    icon: Store,
  },
  {
    name: "Bookings",
    href: "/stall-manager/bookings",
    icon: Calendar,
  },
  {
    name: "Earnings",
    href: "/stall-manager/earnings",
    icon: DollarSign,
  },
  {
    name: "Settings",
    href: "/stall-manager/settings",
    icon: Settings,
  },
];

const StallManagerSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div
      className={cn(
        "fixed left-0 top-0 bottom-0 z-20 flex flex-col transition-all duration-300 ease-in-out",
        "bg-white/80 backdrop-blur-md border-r border-gray-100 shadow-sm",
        isCollapsed ? "w-20" : "w-64 lg:w-72"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex items-center p-6",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <Link to="/stall-manager" className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-sm">
            <Store className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800">EventHub</span>
              <span className="text-xs font-medium text-gray-500">Stall Manager</span>
            </div>
          )}
        </Link>

        {/* {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Collapse</span>
          </Button>
        )} */}

        {/* {isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute -right-3 top-6 h-6 w-6 p-0 rounded-full bg-white border border-gray-100 shadow-sm text-gray-500 hover:text-gray-900"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronRight className="h-3 w-3 rotate-180" />
            <span className="sr-only">Expand</span>
          </Button>
        )} */}
      </div>

      <Separator className="bg-gray-100" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className={cn(
          "space-y-1",
          isCollapsed && "flex flex-col items-center"
        )}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block w-full",
                  isCollapsed && "flex justify-center"
                )}
              >
                <div
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-red-600",
                    isCollapsed ? "mx-auto" : "mr-3"
                  )} />

                  {!isCollapsed && (
                    <span className={cn(
                      "font-medium text-sm",
                      isActive ? "text-white" : "text-gray-700 group-hover:text-gray-900"
                    )}>
                      {item.name}
                    </span>
                  )}

                  {!isCollapsed && isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-white/70"></div>
                  )}
                </div>

                {isCollapsed && (
                  <div className={cn(
                    "absolute left-full ml-2 rounded-md px-2 py-1 bg-gray-900 text-xs font-medium text-white invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200",
                    "whitespace-nowrap z-50"
                  )}>
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Support Section */}
        {!isCollapsed && (
          <>
            <div className="mt-8 mb-2 px-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Support
              </h3>
            </div>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl"
              >
                <HelpCircle className="h-5 w-5 text-gray-500 mr-3" />
                <span className="font-medium text-sm">Help & Resources</span>
              </Button>
            </div>
          </>
        )}

        {isCollapsed && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            >
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help & Resources</span>
            </Button>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4">
        <Separator className="bg-gray-100 mb-4" />

        <div className={cn(
          "flex items-center rounded-xl p-3 bg-gray-50/80",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Stall Manager</p>
                <p className="text-xs text-gray-500">manager@eventhub.com</p>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50",
              isCollapsed && "ml-0"
            )}
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StallManagerSidebar;