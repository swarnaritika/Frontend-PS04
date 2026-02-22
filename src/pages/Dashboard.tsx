import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import DonorDashboard from "@/components/dashboards/DonorDashboard";
import RecipientDashboard from "@/components/dashboards/RecipientDashboard";
import LogisticsDashboard from "@/components/dashboards/LogisticsDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Render dashboard based on user role
  switch (userRole) {
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
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;
