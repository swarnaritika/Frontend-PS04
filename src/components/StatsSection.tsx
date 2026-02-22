import { Card, CardContent } from "@/components/ui/card";
import { Package, Users, Truck, Heart } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: "50,000+",
    label: "Items Donated",
    description: "Essential supplies delivered",
  },
  {
    icon: Users,
    value: "12,000+",
    label: "Families Helped",
    description: "Lives transformed",
  },
  {
    icon: Truck,
    value: "500+",
    label: "Successful Drives",
    description: "Community campaigns",
  },
  {
    icon: Heart,
    value: "8,000+",
    label: "Active Donors",
    description: "Generous contributors",
  },
];

const StatsSection = () => {
  return (
    <section id="impact" className="py-20 bg-gradient-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Collective Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Together, we're making a measurable difference in communities across the nation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              variant="elevated"
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
