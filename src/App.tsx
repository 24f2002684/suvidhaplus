import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { OfflineProvider } from "@/contexts/OfflineContext";
import Login from "./pages/Login";
import Index from "./pages/Index";
import BillPayment from "./pages/BillPayment";
import LodgeComplaint from "./pages/LodgeComplaint";
import TrackApplication from "./pages/TrackApplication";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthenticatedRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <OfflineProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/bill/:service" element={<BillPayment />} />
        <Route path="/complaint" element={<LodgeComplaint />} />
        <Route path="/track" element={<TrackApplication />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </OfflineProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthenticatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
