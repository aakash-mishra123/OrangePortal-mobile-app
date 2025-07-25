import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import ServiceDetail from '@/pages/service-detail';
import AuthPage from '@/pages/AuthPage';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Router>
            <Switch>
              <Route path="/" component={AuthPage} />
              <Route path="/home" component={HomePage} />
              <Route path="/category/:categoryId" component={CategoryPage} />
              <Route path="/service/:slug" component={ServiceDetail} />
              <Route path="/admin/login" component={AdminLogin} />
              <Route path="/admin/dashboard" component={AdminDashboard} />
              <Route component={NotFound} />
            </Switch>
          </Router>
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;