import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Package, Truck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "List or Request",
    description: "Donors list available items while recipients submit requests for essential needs",
    color: "bg-primary",
  },
  {
    icon: Package,
    title: "Match & Connect",
    description: "Our platform matches donations with requests based on location and urgency",
    color: "bg-secondary",
  },
  {
    icon: Truck,
    title: "Coordinate Delivery",
    description: "Logistics coordinators arrange pickup and delivery to ensure safe transfer",
    color: "bg-accent",
  },
  {
    icon: CheckCircle,
    title: "Impact & Feedback",
    description: "Recipients confirm delivery and donors see the real impact of their contribution",
    color: "bg-primary",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How GiveHope Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A seamless process connecting donors with recipients through transparent, efficient coordination
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-border" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card variant="ghost" className="text-center h-full">
                <CardHeader className="pb-4">
                  {/* Step Number */}
                  <div className="relative mx-auto mb-4">
                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-soft`}>
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-background border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
