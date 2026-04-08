import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Gift, HandHeart, Truck } from "lucide-react";

const roles = [
  {
    title: "Donors",
    description: "Provide food, clothing, and supplies to those in need",
    icon: Gift,
    color: "text-primary",
    bg: "bg-primary",
  },
  {
    title: "Recipients",
    description: "Submit requests for essential items and receive support",
    icon: HandHeart,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    title: "Logistics",
    description: "Coordinate pickups and deliveries across the community",
    icon: Truck,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    title: "Administrators",
    description: "Manage campaigns and ensure platform transparency",
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary",
  },
];

const RolesSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            A Role for Everyone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform connects different community members to create a complete ecosystem of giving
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role, i) => (
            <Card key={i} className=" border-black hover:-translate-y-1 hover:shadow-none transition-all group">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 bg-[#FFCC00] rounded-none flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-black">{role.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">{role.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;