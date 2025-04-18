import React from "react";

const SaveWorkoutButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#FFEB3B",
        color: "black",
        fontSize: "16px",
        padding: "12px 24px",
        borderRadius: "8px",
        marginTop: "40px",
        display: "block",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "60px"
      }}
    >
      SAVE WORKOUT
    </button>
  );
};

export default SaveWorkoutButton;