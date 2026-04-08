import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HandHeart, Plus, Clock, Package, Search, MapPin, AlertCircle } from "lucide-react";
import { requestApi, donationApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const RecipientDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [availableDonations, setAvailableDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Food",
    urgency: "normal",
    deliveryAddress: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, donRes] = await Promise.all([
        requestApi.getAll(),
        donationApi.getAll(),
      ]);
      setRequests(reqRes.data.filter(r => r.recipientId === user.id || r.recipientId?._id === user.id));
      setAvailableDonations(donRes.data.filter(d => d.status === "available"));
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      await requestApi.create({
        ...formData,
        recipientId: user.id,
      });
      toast.success("Support request submitted!");
      setIsDialogOpen(false);
      fetchData();
      setFormData({
        title: "",
        description: "",
        category: "Food",
        urgency: "normal",
        deliveryAddress: "",
      });
    } catch (error) {
      toast.error("Failed to submit request");
    }
  };

  const handleClaimDonation = async (donationId) => {
    try {
      await requestApi.create({
        recipientId: user.id,
        donationId,
        title: "Claimed Donation",
        category: "Claimed",
        urgency: "normal",
        deliveryAddress: "User Profile Address", // Simplified
      });
      toast.success("Donation claimed! A coordinator will contact you.");
      fetchData();
    } catch (error) {
      toast.error("Failed to claim donation");
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case "emergency": return <Badge variant="destructive">Emergency</Badge>;
      case "high": return <Badge className="bg-orange-500">High</Badge>;
      default: return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <DashboardLayout title="Recipient Dashboard" icon={<HandHeart className="w-5 h-5" />}>
      <div className="space-y-8">
        <Tabs defaultValue="requests" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="requests">Your Requests</TabsTrigger>
              <TabsTrigger value="browse">Browse Donations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="mt-0">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search donations..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="requests" className="mt-0">
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </TabsContent>
          </div>

          <TabsContent value="requests" className="space-y-6 mt-0">
            {loading ? (
              <div className="py-12 flex justify-center"><Clock className="animate-spin" /></div>
            ) : requests.length === 0 ? (
              <Card className="py-12 text-center glass-card border-black">
                <p className="text-muted-foreground">You haven't made any requests yet.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {requests.map((request) => (
                  <Card key={request._id} className="glass-card border-black hover:glass-strong transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                          <CardDescription>{request.category} • {new Date(request.createdAt).toLocaleDateString()}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {getUrgencyBadge(request.urgency)}
                          <Badge variant="outline">{request.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="browse" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableDonations
                .filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((donation) => (
                <Card key={donation._id} className="glass-card border-black hover:glass-strong transition-all overflow-hidden">
                  <div className="h-32 bg-primary flex items-center justify-center">
                    <Package className="w-12 h-12 text-primary/20" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{donation.title}</CardTitle>
                    <Badge variant="secondary" className="w-fit">{donation.category}</Badge>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{donation.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {donation.pickupAddress}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleClaimDonation(donation._id)}>
                      Claim this Item
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Support</DialogTitle>
              <DialogDescription>Tell us what you need and how urgent it is.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitRequest} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="req-title">What do you need?</Label>
                <Input 
                  id="req-title" 
                  placeholder="e.g. Baby Food and Diapers"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="req-desc">Details</Label>
                <Textarea 
                  id="req-desc" 
                  placeholder="Explain your situation..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <select 
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-none text-sm"
                    value={formData.urgency}
                    onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select 
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-none text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Food</option>
                    <option>Clothing</option>
                    <option>Medical</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="req-addr">Delivery Address</Label>
                <Input 
                  id="req-addr" 
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                  required 
                />
              </div>
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default RecipientDashboard;