
import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { logout, user } = useAuth();

  return (
    <header className="h-16 border-b bg-white/75 backdrop-blur-md sticky top-0 z-50">
      <div className="h-full flex items-center justify-between px-4 lg:px-8">
        <div className="lg:hidden">
          {/* Mobile logo */}
          <span className="text-xl font-bold text-primary">EH</span>
        </div>

        <div className="hidden md:flex items-center flex-1 px-4 lg:px-8">
          <div className="w-full max-w-xl">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
          </Button>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span className="hidden md:inline-block">
                {user?.name || "Admin"}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
