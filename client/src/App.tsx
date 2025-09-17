import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Clients from "./pages/Clients";
import Design from "./pages/Design";
import Teams from "./pages/TeamsPage";
import Garage from "./pages/Garage";
import Members from "./pages/Members";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProjectDashboardPage from "./pages/ProjectDashboardPage";
import Login from "./pages/Login";
import NotFound from "@/pages/not-found";

// Design Pages
import NewProjects from "./pages/design/NewProjects";
import DesignReview from "./pages/design/DesignReview";
import InRevision from "./pages/design/InRevision";
import HoldProjects from "./pages/design/HoldProjects";
import InDesigning from "./pages/design/InDesigning";
import Completed from "./pages/design/Completed";
import Canceled from "./pages/design/Canceled";

// Garage Pages
import Electrical from "./pages/garage/Electrical";
import Structural from "./pages/garage/Structural";
import Requirements from "./pages/garage/Requirements";

function Router() {
  return (
    <Switch>
      {/* Login route - no layout */}
      <Route path="/login" component={Login} />
      
      {/* All other routes - with layout and protection */}
      <Route>
        <ProtectedRoute>
          <Layout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/employees" component={Employees} />
              <Route path="/clients" component={Clients} />
              <Route path="/design" component={Design} />
              <Route path="/teams" component={Teams} />
              <Route path="/garage" component={Garage} />
              <Route path="/members" component={Members} />
              <Route path="/profile" component={Profile} />
              <Route path="/settings" component={Settings} />
              <Route path="/project-dashboard/:id" component={ProjectDashboardPage} />

              {/* Design Routes */}
              <Route path="/design/new-projects">
                <NewProjects tableType="new" pageTitle="New Projects" />
              </Route>
              <Route path="/design/design-review">
                <DesignReview tableType="design-review" pageTitle="Design Review" />
              </Route>
              <Route path="/design/in-revision">
                <InRevision tableType="in-revision" pageTitle="In Revision" />
              </Route>
              <Route path="/design/hold-projects">
                <HoldProjects tableType="hold" pageTitle="Hold Projects" />
              </Route>
              <Route path="/design/in-designing">
                <InDesigning tableType="in-designing" pageTitle="In Designing" />
              </Route>
              <Route path="/design/completed">
                <Completed tableType="completed" pageTitle="Completed Projects" />
              </Route>
              <Route path="/design/canceled">
                <Canceled tableType="canceled" pageTitle="Canceled Projects" />
              </Route>
              
              {/* Garage Routes */}
              <Route path="/garage/electrical">
                <Electrical currentCategory="electrical" currentTableType="electrical" />
              </Route>
              <Route path="/garage/structural">
                <Structural currentTableType="structural" />
              </Route>
              <Route path="/garage/requirements">
                <Requirements currentTableType="requirements" />
              </Route>

              {/* NotFound Route should be last */}
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;