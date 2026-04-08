import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "How it Works", href: "/#how-it-works" },
    { name: "Donation Drives", href: "/#drives" },
    { name: "Our Impact", href: "/#impact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? " py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#FFCC00] rounded-none flex items-center justify-center text-white shadow- group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-black tracking-tight">GiveHope</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFCC00] group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button className="bg-[#FFCC00] border-0 hover:opacity-90">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" className="hover:bg-white">Sign In</Button>
              </Link>
              <Link to="/auth?role=donor">
                <Button className="bg-[#FFCC00] border-0 hover:opacity-90">Start Donating</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0  border-t border-black p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg font-medium py-2 border-b border-black"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            {user ? (
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-[#FFCC00] border-0">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full ">Sign In</Button>
                </Link>
                <Link to="/auth?role=donor" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-[#FFCC00] border-0">Start Donating</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
