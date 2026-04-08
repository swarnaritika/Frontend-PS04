import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, Plus, Clock, CheckCircle, Package, MapPin } from "lucide-react";
import { donationApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Food",
    quantity: 1,
    condition: "new",
    pickupAddress: "",
  });

  const categories = ["Food", "Clothing", "Medical Supplies", "Electronics", "Books", "Other"];
  const conditions = ["new", "good", "fair", "needs_repair"];

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await donationApi.getAll();
      // Filter for current user's donations
      const userDonations = response.data.filter(d => d.donorId === user.id || d.donorId?._id === user.id);
      setDonations(userDonations);
    } catch (error) {
      toast.error("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await donationApi.create({
        ...formData,
        donorId: user.id,
      });
      toast.success("Donation listing created!");
      setIsDialogOpen(false);
      fetchDonations();
      setFormData({
        title: "",
        description: "",
        category: "Food",
        quantity: 1,
        condition: "new",
        pickupAddress: "",
      });
    } catch (error) {
      toast.error("Failed to create donation");
    }
  };

  const stats = {
    total: donations.length,
    available: donations.filter(d => d.status === "available").length,
    claimed: donations.filter(d => d.status === "claimed").length,
    delivered: donations.filter(d => d.status === "delivered").length,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "available": return <Badge variant="default">Available</Badge>;
      case "claimed": return <Badge variant="secondary">Claimed</Badge>;
      case "delivered": return <Badge className="bg-green-500">Delivered</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout title="Donor Dashboard" icon={<Gift className="w-5 h-5" />}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-black hover:glass-strong transition-all">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gradient">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Listings</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-black hover:glass-strong transition-all">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gradient">{stats.available}</div>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-black hover:glass-strong transition-all">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gradient">{stats.claimed}</div>
              <p className="text-xs text-muted-foreground">Claimed</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-black hover:glass-strong transition-all">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gradient">{stats.delivered}</div>
              <p className="text-xs text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Donations</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                List New Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>List an Item for Donation</DialogTitle>
                <DialogDescription>Provide details about the item you'd like to donate.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Name</Label>
                  <Input 
                    id="title" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupAddress">Pickup Address</Label>
                  <Input 
                    id="pickupAddress" 
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">Create Listing</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><Clock className="animate-spin" /></div>
        ) : donations.length === 0 ? (
          <Card className="py-12 text-center glass-card border-black">
            <p className="text-muted-foreground">You haven't listed any items yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {donations.map((donation) => (
              <Card key={donation._id} className="glass-card border-black hover:glass-strong transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{donation.title}</CardTitle>
                      <CardDescription>{donation.category} • {donation.quantity} units</CardDescription>
                    </div>
                    {getStatusBadge(donation.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{donation.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {donation.pickupAddress}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DonorDashboard;