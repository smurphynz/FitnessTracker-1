import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Home from "@/pages/Home";
import AuthPage from "@/pages/auth-page";
import SettingsPage from "@/pages/settings-page";
import NotFound from "@/pages/not-found";
import SavePage from "@/pages/SavePage";
import ForceLogoutPage from "@/pages/force-logout";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/save" component={SavePage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/login" component={() => { window.location.href = '/direct-login'; return null; }} />
      <Route path="/force-logout" component={ForceLogoutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
