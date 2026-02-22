import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";

const drives = [
  {
    id: 1,
    title: "Winter Clothing Drive",
    location: "Chicago, IL",
    date: "Jan 15 - Feb 28",
    category: "Clothing",
    urgent: false,
    goal: 1000,
    current: 720,
    participants: 156,
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Emergency Food Relief",
    location: "Houston, TX",
    date: "Ongoing",
    category: "Food",
    urgent: true,
    goal: 5000,
    current: 3200,
    participants: 423,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "School Supplies for Kids",
    location: "Los Angeles, CA",
    date: "Jan 20 - Mar 15",
    category: "Education",
    urgent: false,
    goal: 2000,
    current: 890,
    participants: 234,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
  },
];

const DonationDrivesSection = () => {
  return (
    <section id="drives" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Active Campaigns
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Current Donation Drives
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Join active campaigns making an immediate impact in communities
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto">
            View All Drives
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drives.map((drive) => (
            <Card key={drive.id} variant="elevated" className="overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={drive.image}
                  alt={drive.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                    {drive.category}
                  </Badge>
                  {drive.urgent && (
                    <Badge className="bg-accent text-accent-foreground">
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{drive.title}</CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {drive.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {drive.date}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-foreground">
                      {drive.current.toLocaleString()} / {drive.goal.toLocaleString()} items
                    </span>
                  </div>
                  <Progress value={(drive.current / drive.goal) * 100} className="h-2" />
                </div>
              </CardContent>

              <CardFooter className="pt-0 justify-between">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {drive.participants} donors
                </span>
                <Button size="sm">Contribute</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonationDrivesSection;
