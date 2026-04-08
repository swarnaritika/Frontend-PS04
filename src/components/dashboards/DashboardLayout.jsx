import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, LogOut, Home, User, Bell } from "lucide-react";

const DashboardLayout = ({ title, icon, children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dashboard Navbar */}
      <header className="h-16  border-b border-black sticky top-0 z-40">
        <div className="container h-full mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#FFCC00] rounded-none flex items-center justify-center text-white shadow-">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-black hidden sm:block">GiveHope</span>
            </Link>
            <div className="h-6 w-px bg-white hidden sm:block" />
            <div className="flex items-center gap-2 text-foreground">
              {icon}
              <span className="font-semibold hidden sm:block">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="hover:">
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:block">Home</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative hover:">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-none" />
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5  rounded-none border-black">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium hidden sm:block">{user?.fullName || user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className=" hover:-translate-y-1 hover:shadow-none">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:block">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;