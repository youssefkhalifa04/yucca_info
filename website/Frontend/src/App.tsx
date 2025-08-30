import { useContext, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { EggTypeProvider } from "./contexts/EggTypeContext";
import { ControlModeProvider } from './contexts/ControlModeContext';
import { SettingsProvider } from './contexts/SettingsContext';



const queryClient = new QueryClient();

const App = () => {
  
 
  return (
    <QueryClientProvider client={queryClient}>
      <EggTypeProvider>
        <ControlModeProvider>
          <SettingsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </SettingsProvider>
        </ControlModeProvider>
      </EggTypeProvider>
    </QueryClientProvider>
  );
};

export default App;
