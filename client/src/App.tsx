import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Category from "@/pages/category";
import ServiceDetail from "@/pages/service-detail";
import SearchPage from "@/pages/search";
import Compare from "@/pages/compare";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import Consultation from "@/pages/consultation";
import AuthPage from "@/pages/auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PWAStatus from "@/components/pwa-status";
import { useEffect } from "react";

function Router() {
  const [location] = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Switch>
        {/* Admin routes without header/footer */}
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route path="/auth" component={AuthPage} />
        
        {/* Regular routes with header/footer */}
        <Route>
          <Header />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/home" component={Home} />
              <Route path="/category/:slug" component={Category} />
              <Route path="/service/:slug" component={ServiceDetail} />
              <Route path="/search" component={SearchPage} />
              <Route path="/compare" component={Compare} />
              <Route path="/admin" component={Admin} />
              <Route path="/consultation" component={Consultation} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <PWAStatus />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
