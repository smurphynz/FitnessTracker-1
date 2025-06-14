import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForceLogoutPage() {
  const { logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleForceLogout = () => {
    // Clear localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Call logout API
    logoutMutation.mutate();
    
    // Force redirect to auth page
    setTimeout(() => {
      window.location.href = '/auth';
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Force Logout</CardTitle>
          <CardDescription>
            Click below to completely clear your session and access the registration page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleForceLogout}
            className="w-full"
            variant="destructive"
          >
            Clear Session & Go to Registration
          </Button>
          <Button 
            onClick={() => setLocation("/")}
            className="w-full"
            variant="outline"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}