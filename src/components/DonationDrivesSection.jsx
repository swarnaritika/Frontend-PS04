import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { driveApi } from "@/lib/api";

const DonationDrivesSection = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const response = await driveApi.getAll();
        setDrives(response.data || []);
      } catch (error) {
        console.error("Error fetching drives:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  if (loading) {
    return (
      <section id="drives" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p>Loading donation drives...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="drives" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3  px-4 py-2 rounded-none">
              Active Campaigns
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Current Donation Drives
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Join active campaigns making an immediate impact in communities
            </p>
          </div>
          <Link to="/auth?role=donor">
            <Button variant="outline" className="self-start md:ml-auto  hover:-translate-y-1 hover:shadow-none">
              View All Drives
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {drives.length === 0 ? (
          <div className="text-center py-12 ">
            <p className="text-muted-foreground italic">No active donation drives at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {drives.map((drive) => (
              <Card key={drive._id} className="overflow-hidden group  border-black hover:-translate-y-1 hover:shadow-none transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={drive.imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop"}
                    alt={drive.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="secondary" className="">
                      {drive.category}
                    </Badge>
                    {drive.status === "active" && (
                      <Badge className="bg-[#FFCC00] text-white border-0">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-black">{drive.title}</CardTitle>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(drive.endDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {drive.location}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {drive.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Progress</span>
                      <span>{Math.round((drive.currentAmount / drive.goalAmount) * 100)}%</span>
                    </div>
                    <Progress value={(drive.currentAmount / drive.goalAmount) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{drive.currentAmount} items</span>
                      <span>Goal: {drive.goalAmount}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Link to="/auth?role=donor" className="w-full">
                    <Button className="w-full bg-[#FFCC00] border-0 hover:opacity-90">Donate to this Drive</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DonationDrivesSection;