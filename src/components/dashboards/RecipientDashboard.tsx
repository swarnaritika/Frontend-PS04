import { useState, useEffect } from "react";
import { HandHeart, Plus, Package, Clock, CheckCircle, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "./DashboardLayout";
import { toast } from "sonner";

interface DonationRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: string;
  delivery_address: string;
  created_at: string;
}

interface AvailableDonation {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  condition: string;
  pickup_address: string;
}

const categories = ["Food", "Clothing", "Medical Supplies", "Household Items", "Electronics", "Books", "Other"];
const urgencyLevels = ["low", "normal", "high", "emergency"];

const RecipientDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [availableDonations, setAvailableDonations] = useState<AvailableDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    urgency: "normal",
    delivery_address: "",
  });

  useEffect(() => {
    fetchRequests();
    fetchAvailableDonations();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("donation_requests")
        .select("*")
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDonations = async () => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAvailableDonations(data || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from("donation_requests").insert({
        recipient_id: user.id,
        ...formData,
      });

      if (error) throw error;

      toast.success("Request submitted successfully!");
      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        urgency: "normal",
        delivery_address: "",
      });
      fetchRequests();
    } catch (error) {
      toast.error("Failed to submit request");
    }
  };

  const claimDonation = async (donationId: string) => {
    if (!user) return;

    try {
      // Create a request for this donation
      const { error } = await supabase.from("donation_requests").insert({
        recipient_id: user.id,
        donation_id: donationId,
        title: "Claimed from available donations",
        category: "Other",
        status: "approved",
        delivery_address: formData.delivery_address || "To be provided",
      });

      if (error) throw error;

      // Update donation status
      await supabase
        .from("donations")
        .update({ status: "claimed" })
        .eq("id", donationId);

      toast.success("Donation claimed successfully!");
      fetchAvailableDonations();
      fetchRequests();
    } catch (error) {
      toast.error("Failed to claim donation");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-500">In Transit</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return <Badge variant="destructive">Emergency</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "normal":
        return <Badge variant="secondary">Normal</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  const filteredDonations = availableDonations.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved" || r.status === "in_transit").length,
    delivered: requests.filter(r => r.status === "delivered").length,
  };

  return (
    <DashboardLayout title="Recipient Dashboard" icon={<HandHeart className="w-5 h-5" />}>
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <HandHeart className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Received</p>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="browse">Browse Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Requests</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Request Items</DialogTitle>
                    <DialogDescription>
                      Tell us what you need and we'll try to match you with donors
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">What do you need?</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Winter clothing for family"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Details</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your situation and needs..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Urgency</Label>
                        <Select
                          value={formData.urgency}
                          onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {urgencyLevels.map((level) => (
                              <SelectItem key={level} value={level} className="capitalize">
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address</Label>
                      <Input
                        id="address"
                        value={formData.delivery_address}
                        onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                        placeholder="Where should items be delivered?"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Submit Request</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {requests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <HandHeart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
                  <p className="text-muted-foreground mb-4">Submit a request or browse available donations</p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Request Items
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {requests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                          <CardDescription>{request.category}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {getUrgencyBadge(request.urgency)}
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {request.description || "No details provided"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="browse" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search available donations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredDonations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No donations available</h3>
                  <p className="text-muted-foreground">Check back later for new donations</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDonations.map((donation) => (
                  <Card key={donation.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{donation.title}</CardTitle>
                      <CardDescription>{donation.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {donation.description || "No description"}
                      </p>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-muted-foreground">Qty: {donation.quantity}</span>
                        <Badge variant="outline" className="capitalize">
                          {donation.condition?.replace("_", " ")}
                        </Badge>
                      </div>
                      <Button className="w-full" onClick={() => claimDonation(donation.id)}>
                        Claim This Item
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RecipientDashboard;
