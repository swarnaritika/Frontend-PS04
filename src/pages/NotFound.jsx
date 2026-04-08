import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-primary rounded-none blur-3xl animate-float" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-secondary/20 rounded-none blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="text-center max-w-md  p-12 border-black">
        <h1 className="text-9xl font-black text-black">404</h1>
        <h2 className="text-3xl font-bold mt-[-2rem] mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Link to="/">
          <Button size="lg" className="rounded-none bg-[#FFCC00] border-0 hover:opacity-90 shadow-">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;