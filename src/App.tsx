import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { AuthDebug } from "./components/auth/AuthDebug";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota inicial - Dashboard sem proteção */}
      <Route path="/" element={<Dashboard />} />
      
      {/* Rotas de autenticação (acessíveis por todos) */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      
      {/* Dashboard também acessível diretamente */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
        {/* Componente de debug para desenvolvimento */}
        <AuthDebug />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;