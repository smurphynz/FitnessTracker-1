import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

// Aggressively clear any existing service workers and prevent new registrations
if ('serviceWorker' in navigator) {
  // Unregister all existing service workers
  navigator.serviceWorker.getRegistrations()
    .then(regs => {
      regs.forEach(r => {
        r.unregister();
        console.log('Unregistered service worker:', r.scope);
      });
      console.log('All service workers cleared');
    })
    .catch(err => console.log('Error clearing service workers:', err));
  
  // Override register method to prevent new registrations
  const originalRegister = navigator.serviceWorker.register;
  navigator.serviceWorker.register = function() {
    console.log('Service worker registration blocked');
    return Promise.reject(new Error('Service worker registration disabled'));
  };
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <App />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
