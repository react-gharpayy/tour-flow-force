import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/app-context";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import HRTower from "./pages/HRTower";
import TeamPerformance from "./pages/TeamPerformance";
import ZonePerformance from "./pages/ZonePerformance";
import DraftTracker from "./pages/DraftTracker";
import AllTours from "./pages/AllTours";
import FlowOpsDashboard from "./pages/FlowOpsDashboard";
import ScheduleTour from "./pages/ScheduleTour";
import MYTLeadTracker from "./pages/MYTLeadTracker";
import TCMDashboard from "./pages/TCMDashboard";
import TCMActions from "./pages/TCMActions";
import TCMPerformance from "./pages/TCMPerformance";
import Bookings from "./pages/Bookings";
import Funnel from "./pages/Funnel";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-auto">
              <div className="pt-12 md:pt-0">
                <TopHeader />
              </div>
              <main className="flex-1 pb-16 md:pb-0 px-3 py-4 md:p-6">
                <Routes>
                  <Route path="/" element={<HRTower />} />
                  <Route path="/team" element={<TeamPerformance />} />
                  <Route path="/zones" element={<ZonePerformance />} />
                  <Route path="/drafts" element={<DraftTracker />} />
                  <Route path="/tours" element={<AllTours />} />
                  <Route path="/funnel" element={<Funnel />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/flow-ops" element={<FlowOpsDashboard />} />
                  <Route path="/schedule" element={<ScheduleTour />} />
                  <Route path="/leads" element={<MYTLeadTracker />} />
                  <Route path="/tcm" element={<TCMDashboard />} />
                  <Route path="/tcm/actions" element={<TCMActions />} />
                  <Route path="/tcm/performance" element={<TCMPerformance />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
