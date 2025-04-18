import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import SaveWorkoutButton from "@/components/SaveWorkoutButton";

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
      
      {/* The SaveWorkoutButton will be displayed on all routes */}
      <SaveWorkoutButton />
    </>
  );
}

function App() {
  return <Router />;
}

export default App;
