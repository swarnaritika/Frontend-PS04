import React from "react";
import { Link } from "react-router-dom";
import { Heart, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="relative pt-16 pb-8 border-t border-black mt-20">
      <div className="absolute inset-0 glass-strong -z-10"></div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-hero rounded-none flex items-center justify-center text-white">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gradient">GiveHope</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Making community giving transparent, efficient, and impactful. Connecting donors with those who need it most.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-none hover:glass-strong">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-none hover:glass-strong">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-none hover:glass-strong">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-gradient">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="/#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="/#drives" className="text-muted-foreground hover:text-primary transition-colors">Donation Drives</a></li>
              <li><a href="/#impact" className="text-muted-foreground hover:text-primary transition-colors">Our Impact</a></li>
              <li><Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-gradient">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Donor Guide</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Recipient FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Logistics Partners</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Safety Guidelines</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-gradient">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Stay updated with latest drives and impact stories.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="glass rounded-none px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary border-0"
              />
              <Button size="sm" className="bg-gradient-hero border-0">Join</Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-black flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 GiveHope Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
