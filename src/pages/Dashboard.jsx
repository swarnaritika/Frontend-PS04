import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import DonorDashboard from "@/components/dashboards/DonorDashboard";
import RecipientDashboard from "@/components/dashboards/RecipientDashboard";
import LogisticsDashboard from "@/components/dashboards/LogisticsDashboard";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  switch (userRole?.toLowerCase()) {
    case "admin":
      return <AdminDashboard />;
    case "donor":
      return <DonorDashboard />;
    case "recipient":
      return <RecipientDashboard />;
    case "logistics":
      return <LogisticsDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Role Not Recognized</h1>
            <p className="text-muted-foreground">Please contact support if you think this is an error.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;