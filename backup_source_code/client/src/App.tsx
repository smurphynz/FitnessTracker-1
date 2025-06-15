import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import SavePage from "@/pages/SavePage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/save" component={SavePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      
      {/* Special utility class overriding any Tailwind issues */}
      <div className="emergency-visible" style={{
        position: "fixed",
        top: "100px",
        right: "10px"
      }}>
        <a 
          href="/bare_minimum.html" 
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px 15px",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
            display: "block",
            border: "2px solid white"
          }}
        >
          VISIT SAVE PAGE
        </a>
      </div>
      
      {/* Direct DOM button with maximum z-index */}
      <button
        onClick={() => {
          alert("Save clicked");
          // Basic workout data
          const workout = {
            date: new Date().toISOString().split('T')[0],
            weight: "70",
            mobility: { day: 1, completion: "full-session" },
            handstand: { exercises: [] },
            strength: { day: 1, exercises: [] }
          };
          
          // Send to API
          fetch('/api/workouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(workout)
          })
          .then(response => {
            if (response.ok) {
              alert("SUCCESS: Workout saved!");
            } else {
              alert("Failed to save workout");
            }
          })
          .catch(error => {
            alert("Error: " + error.message);
          });
        }}
        className="emergency-visible"
        style={{
          position: "fixed",
          bottom: "100px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FF0000",
          color: "#FFFFFF",
          fontSize: "24px",
          fontWeight: "bold",
          padding: "16px 32px",
          borderRadius: "10px",
          border: "4px solid white",
          boxShadow: "0px 0px 20px 5px rgba(255,255,255,0.8)",
          width: "80%",
          textAlign: "center"
        }}
      >
        SAVE WORKOUT NOW
      </button>
    </>
  );
}

export default App;
