import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, HandHeart, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-primary rounded-none blur-3xl animate-float" />
        <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-secondary/20 rounded-none blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] right-[10%] w-64 h-64 bg-accent/20 rounded-none blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none glass text-primary font-medium text-sm mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-none h-2 w-2 bg-primary"></span>
            </span>
            Impactful Giving Platform
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Donate Hope,{" "}
            <span className="text-gradient">Transform Lives</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Connect essential donations with those who need them most. From food and clothing to emergency relief—every contribution creates lasting change in our communities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/auth?role=donor">
              <Button size="lg" className="h-14 px-8 rounded-none text-lg bg-gradient-hero border-0 hover:opacity-90 shadow-glass group">
                Start Donating
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth?role=recipient">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-none text-lg glass hover:glass-strong">
                Request Assistance
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { label: "Active Donors", value: "8,000+", icon: Gift },
              { label: "Items Donated", value: "50,000+", icon: HandHeart },
              { label: "Lives Touched", value: "12,000+", icon: Gift },
              { label: "Active Drives", value: "500+", icon: HandHeart },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 hover:glass-strong transition-all duration-300 group">
                <stat.icon className="w-8 h-8 text-primary mb-3 mx-auto group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
