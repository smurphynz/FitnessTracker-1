import { Link } from "wouter";

export default function SaveWorkoutButton() {
  return (
    <>
      {/* Direct DOM style button instead of using Tailwind classes */}
      <div 
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          width: "100%",
          backgroundColor: "black",
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          zIndex: "9999999"
        }}
      >
        <Link href="/save">
          <a 
            style={{
              display: "block",
              width: "100%",
              padding: "16px 0",
              backgroundColor: "#FF0000",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              textTransform: "uppercase",
              border: "4px solid white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              textDecoration: "none"
            }}
          >
            Save Workout
          </a>
        </Link>
      </div>
      
      {/* Fallback button with onclick handler in case the Link doesn't work */}
      <div 
        style={{
          position: "fixed",
          bottom: "100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          zIndex: "9999999"
        }}
      >
        <button
          onClick={() => {
            // Navigate programmatically as backup
            window.location.href = "/save";
          }}
          style={{
            display: "block",
            width: "100%",
            padding: "16px",
            backgroundColor: "purple",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
            border: "4px solid yellow",
            borderRadius: "8px",
            boxShadow: "0 0 20px rgba(255, 255, 0, 0.5)",
            cursor: "pointer"
          }}
        >
          Alternate Save Button
        </button>
      </div>
      
      {/* Emergency link to the standalone page */}
      <div 
        style={{
          position: "fixed",
          bottom: "200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          zIndex: "9999999",
          textAlign: "center"
        }}
      >
        <a 
          href="/fallback-button.html"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "black",
            color: "yellow",
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            border: "3px solid yellow",
            borderRadius: "6px",
            boxShadow: "0 0 15px rgba(255, 255, 0, 0.5)",
            textDecoration: "none"
          }}
        >
          Emergency Save Page
        </a>
      </div>
    </>
  );
}