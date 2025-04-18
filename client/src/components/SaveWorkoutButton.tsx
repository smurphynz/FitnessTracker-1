import React, { useEffect } from "react";

const SaveWorkoutButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  // Force this component to be shown above all others
  useEffect(() => {
    // Create a style tag
    const style = document.createElement('style');
    style.innerHTML = `
      .save-workout-fixed-button {
        position: fixed !important;
        bottom: 20px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        background-color: #FFEB3B !important;
        color: #000 !important;
        padding: 12px 24px !important;
        font-size: 16px !important;
        border: none !important;
        border-radius: 8px !important;
        z-index: 99999 !important;
        cursor: pointer !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 5px rgba(255, 235, 59, 0.3) !important;
        font-weight: bold !important;
        min-width: 200px !important;
        text-align: center !important;
        animation: pulse-save-button 2s infinite !important;
      }
      
      @keyframes pulse-save-button {
        0% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.05); }
        100% { transform: translateX(-50%) scale(1); }
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <button 
      onClick={onClick}
      className="save-workout-fixed-button"
      id="save-workout-fixed-button"
    >
      SAVE WORKOUT
    </button>
  );
};

export default SaveWorkoutButton;