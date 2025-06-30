
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import SetupPassword from "./pages/SetupPassword";
import { OrganizationProvider } from "@/contexts/OrganizationContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrganizationProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route path="/setup-password" element={<SetupPassword />} />
          </Routes>
        </BrowserRouter>
      </OrganizationProvider>
    </QueryClientProvider>
  );
}

export default App;
