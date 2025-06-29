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
  return <Router />;
}

export default App;
