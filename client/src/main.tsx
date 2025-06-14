import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

// Completely eliminate service workers and WebSocket issues
if ('serviceWorker' in navigator) {
  // Aggressively unregister all existing service workers
  navigator.serviceWorker.getRegistrations()
    .then(async regs => {
      for (const reg of regs) {
        await reg.unregister();
        console.log('Force unregistered service worker:', reg.scope);
      }
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log('Deleted cache:', cacheName);
        }
      }
      console.log('All service workers and caches cleared');
    })
    .catch(err => console.log('Error clearing service workers:', err));
  
  // Block any future service worker registrations
  navigator.serviceWorker.register = function() {
    console.log('Service worker registration permanently blocked');
    return Promise.reject(new Error('Service worker registration disabled'));
  };
}

// Block problematic WebSocket connections
const originalWebSocket = window.WebSocket;
window.WebSocket = function(url, protocols) {
  if (url.includes('localhost:undefined') || url.includes('localhost') || url.includes('wss://localhost')) {
    console.log('Blocked problematic WebSocket connection:', url);
    throw new Error('WebSocket connection blocked');
  }
  return new originalWebSocket(url, protocols);
};

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
