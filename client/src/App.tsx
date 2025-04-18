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
    <div>
      <Router />
      <button
        onClick={() => alert("Save clicked")}
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FF0000",
          color: "#FFFFFF",
          fontSize: "24px",
          fontWeight: "bold",
          padding: "16px 32px",
          borderRadius: "10px",
          zIndex: 10000,
          border: "4px solid white",
          boxShadow: "0px 0px 20px 5px rgba(255,255,255,0.8)"
        }}
      >
        SAVE WORKOUT (TEST)
      </button>
    </div>
  );
}

export default App;
