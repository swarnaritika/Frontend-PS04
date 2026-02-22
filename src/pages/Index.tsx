import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DonationDrivesSection from "@/components/DonationDrivesSection";
import RolesSection from "@/components/RolesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <DonationDrivesSection />
      <RolesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
