import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

// Only start React if we found the root element
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

// Add a non-React emergency button if one doesn't already exist
function addEmergencyButton() {
  // Check if we already have an emergency button in the DOM
  if (!document.getElementById('extra-emergency-button')) {
    const button = document.createElement('button');
    button.id = 'extra-emergency-button';
    button.textContent = 'EXTRA EMERGENCY SAVE';
    button.style.cssText = `
      position: fixed !important;
      top: 160px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background-color: black !important;
      color: yellow !important;
      padding: 15px 20px !important;
      font-size: 18px !important;
      font-weight: bold !important;
      border: 3px solid yellow !important;
      border-radius: 8px !important;
      z-index: 2147483647 !important;
      box-shadow: 0 0 20px 5px rgba(255, 255, 0, 0.5) !important;
      cursor: pointer !important;
    `;
    
    button.onclick = function() {
      alert('Extra emergency button clicked!');
      const workout = {
        date: new Date().toISOString().split('T')[0],
        weight: '70',
        mobility: { completion: 'full-session' },
        handstand: { exercises: [] },
        strength: { exercises: [] }
      };
      
      fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout)
      })
      .then(response => {
        if (response.ok) {
          alert('SUCCESS: Workout saved!');
        } else {
          alert('ERROR: Failed to save workout');
        }
      })
      .catch(error => {
        alert('ERROR: ' + error.message);
      });
    };
    
    document.body.appendChild(button);
  }
}

// Run this after a short delay to ensure DOM is ready
setTimeout(addEmergencyButton, 500);
