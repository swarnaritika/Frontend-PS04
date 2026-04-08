import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#FFCC00] opacity-90 -z-10"></div>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 leading-relaxed">
            Join thousands of others who are already contributing to their communities. Whether you have items to give or need support, GiveHope is here to connect you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?role=donor">
              <Button size="lg" className="h-14 px-8 rounded-none text-lg group  hover:scale-105 transition-transform shadow-">
                Join as a Donor
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth?role=recipient">
              <Button size="lg" className="h-14 px-8 rounded-none text-lg  border-black hover:-translate-y-1 hover:shadow-none">
                Join as a Recipient
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;