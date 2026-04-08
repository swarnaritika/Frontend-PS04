import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Gift, HandHeart, Truck, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "donor";
  
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, formData.fullName, role.toUpperCase());
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const roleIcons = {
    admin: Shield,
    donor: Gift,
    recipient: HandHeart,
    logistics: Truck,
  };

  const SelectedIcon = roleIcons[role] || Gift;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <Card className="w-full max-w-md border-none shadow-elevated">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary text-primary rounded-none flex items-center justify-center mx-auto mb-4">
            <SelectedIcon className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold">{isLogin ? "Sign In" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin 
              ? "Access your dashboard and manage your activities" 
              : `Join GiveHope as a ${role}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isLogin && (
            <div className="mb-6">
              <Label className="text-xs uppercase font-bold text-muted-foreground mb-3 block">I want to join as</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(roleIcons).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-none border text-sm transition-all ${
                      role === r 
                        ? "border-primary bg-primary text-primary ring-1 ring-primary" 
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {React.createElement(roleIcons[r], { className: "w-4 h-4" })}
                    <span className="capitalize">{r}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {isLogin && <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button className="w-full h-11" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLogin ? "Sign In" : "Register"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t p-6 bg-muted/10 rounded-b-xl">
          <p className="text-sm text-muted-foreground text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? "Create one now" : "Sign in here"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;