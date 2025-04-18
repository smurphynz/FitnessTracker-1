import React from "react";

const SaveWorkoutButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#FFEB3B",
        color: "#000",
        padding: "12px 24px",
        fontSize: "16px",
        border: "none",
        borderRadius: "8px",
        zIndex: 1000,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      SAVE WORKOUT
    </button>
  );
};

export default SaveWorkoutButton;