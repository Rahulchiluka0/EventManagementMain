import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import OrganizerLayout from "./components/organizer/OrganizerLayout";
import StallOrganizerLayout from "./components/stall-organizer/StallOrganizerLayout";
import Dashboard from "./components/admin/Dashboard";
import UsersVerification from "./components/admin/UsersVerification";
import EventVerification from "./components/admin/EventVerification";
import SalesTracking from "./components/admin/SalesTracking";
import EventForm from "./components/organizer/EventForm";
import EventList from "./components/organizer/EventList";
import OrganizerDashboard from "./components/organizer/OrganizerDashboard";
import BookingsManagementOrganizer from "./components/organizer/BookingsManagement";
import SalesOverview from "./components/organizer/SalesOverview";
import StallEventForm from "./components/organizer/StallEventForm";
import UserDashboard from "./components/user/UserDashboard";
import Index from "./pages/Index";
import EventDetails from "./pages/EventDetails";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import PaymentFailed from "./pages/PaymentFailed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Redirect from "./pages/Redirect";
import StallOrganizerDashboard from "./components/stall-organizer/StallOrganizerDashboard";
import StallEventsList from "./components/stall-organizer/StallEventsList";
import StallManagersList from "./components/stall-organizer/StallManagersList";
import RevenueOverview from "./components/stall-organizer/RevenueOverview";
import StallManagerLayout from "./components/stall-manager/StallManagerLayout";
import StallManagerDashboard from "./components/stall-manager/StallManagerDashboard";
import MyStalls from "./components/stall-manager/MyStalls";
import BookingsManagement from "./components/stall-manager/BookingsManagement";
import EarningsView from "./components/stall-manager/EarningsView";
import Settings from "./components/stall-manager/Settings";
import StallEventDetails from "./pages/StallEventDetails";
import StallEventVerification from "./components/admin/StallEventVerification";
import StallEventList from "./components/organizer/StallEventList";
import StallRequestList from "./components/organizer/StallRequestList";
// Add this import at the top of your file
import StallDetails from "./pages/stall-manager/StallDetails";
import EventDetail from "./pages/organizer/EventDetail";
import StallEventDetail from "./pages/organizer/StallEventDetail";
import EditEventForm from "./components/organizer/EditEventForm";
import EditStallEventForm from "./components/organizer/EditStallEventForm";
// Import the new component at the top of your file
import StallInventoryManagement from "@/components/stall-manager/StallInventoryManagement";
import BookingDetails from "./components/bookings/BookingDetails";
import LandingPage from "./components/landing/LandingPage";
import OrganizerSignup from "./pages/OrganizerSignup";
import VerificationPending from "./pages/VerificationPending";
import VerificationRejected from "./pages/VerificationRejected";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/landingPage" element={<LandingPage />} />
            <Route path="/organizer-signup" element={<OrganizerSignup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/stalls/:id" element={<StallEventDetails />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/bookings/:id" element={<BookingDetails />} />
              <Route path="/payment/:bookingId" element={<Payment />} />
              <Route path="/payment/failed/:bookingId" element={<PaymentFailed />} />
              <Route path="/confirmation/:bookingId" element={<Confirmation />} />
              <Route path="/redirect" element={<Redirect />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersVerification />} />
              <Route path="events" element={<EventVerification />} />
              <Route path="stall-events" element={<StallEventVerification />} />
              <Route path="sales" element={<SalesTracking />} />
              <Route path="settings" element={<div>Settings Content</div>} />
              <Route path="notifications" element={<div>Notifications Content</div>} />
            </Route>
            <Route path="/organizer" element={<OrganizerLayout />}>
              <Route index element={<OrganizerDashboard />} />
              <Route path="events" element={<EventList />} />
              <Route path="stall-events" element={<StallEventList />} />
              <Route path="stall-requests" element={<StallRequestList />} />
              <Route path="events/new" element={<EventForm />} />
              <Route path="events/edit/:id" element={<EditEventForm />} />
              <Route path="stall-events/new" element={<StallEventForm />} />
              <Route path="stall-events/edit/:id" element={<EditStallEventForm />} />
              <Route path="bookings" element={<BookingsManagementOrganizer />} />
              <Route path="sales" element={<SalesOverview />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="stall-events/:id" element={<StallEventDetail />} />
            </Route>


            <Route path="/stall-organizer" element={<StallOrganizerLayout />}>
              <Route index element={<StallOrganizerDashboard />} />
              <Route path="events" element={<StallEventsList />} />
              <Route path="events/new" element={<StallEventForm />} />
              <Route path="managers" element={<StallManagersList />} />
              <Route path="revenue" element={<RevenueOverview />} />
            </Route>
            <Route path="/stall-manager" element={<StallManagerLayout />}>
              <Route index element={<StallManagerDashboard />} />
              <Route path="stalls" element={<MyStalls />} />
              <Route path="bookings" element={<BookingsManagement />} />
              <Route path="earnings" element={<EarningsView />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            // Then add this route to your Routes component
            <Route path="/stall-manager/stalls/:id" element={<StallDetails />} />
            // Then add this route in your stall manager routes section
            <Route path="/stall-manager/inventory/:stallId" element={<StallInventoryManagement />} />
            // Add this to your routes
            <Route path="/verification-pending" element={<VerificationPending />} />
            <Route path="/verification-rejected" element={<VerificationRejected />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
