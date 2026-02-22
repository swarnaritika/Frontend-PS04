import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Gift, HandHeart, Truck, ArrowRight } from "lucide-react";

const roles = [
  {
    icon: Shield,
    title: "Admin",
    description: "Oversee platform operations, manage donation drives, and ensure transparency across all activities.",
    actions: ["Manage campaigns", "Monitor analytics", "Verify users"],
    buttonText: "Apply as Admin",
    color: "bg-primary",
  },
  {
    icon: Gift,
    title: "Donor",
    description: "List items for donation, track your contributions, and participate in emergency relief drives.",
    actions: ["List donations", "Join drives", "Track impact"],
    buttonText: "Start Donating",
    color: "bg-secondary",
  },
  {
    icon: HandHeart,
    title: "Recipient",
    description: "Request necessary items, track delivery status, and provide feedback on received donations.",
    actions: ["Request items", "Track delivery", "Give feedback"],
    buttonText: "Request Help",
    color: "bg-accent",
  },
  {
    icon: Truck,
    title: "Logistics Coordinator",
    description: "Organize transportation, manage inventory, and ensure timely delivery of donations.",
    actions: ["Coordinate pickup", "Manage routes", "Confirm delivery"],
    buttonText: "Join as Coordinator",
    color: "bg-primary",
  },
];

const RolesSection = () => {
  return (
    <section id="roles" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Get Involved
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Role
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everyone has a part to play in building a more caring community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role, index) => (
            <Card key={index} variant="featured" className="group">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${role.color} rounded-xl flex items-center justify-center shrink-0 shadow-soft`}>
                    <role.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">{role.title}</CardTitle>
                    <CardDescription className="text-base">{role.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-sm font-semibold text-foreground mb-3">Key Actions:</div>
                  <ul className="flex flex-wrap gap-2">
                    {role.actions.map((action, actionIndex) => (
                      <li
                        key={actionIndex}
                        className="text-sm bg-muted px-3 py-1.5 rounded-full text-muted-foreground"
                      >
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                  {role.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
