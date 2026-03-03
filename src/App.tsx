import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './layouts/Layout';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AiChatAssistantsPage from './pages/AiChatAssistantsPage';
import InboundPhoneAgentsPage from './pages/InboundPhoneAgentsPage';
import RealEstateWebsitesPage from './pages/RealEstateWebsitesPage';
import IntelligentDataSyncPage from './pages/IntelligentDataSyncPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PricingPage from './pages/PricingPage';
import { Login } from './pages/auth/Login';
import { AdminDashboard } from './pages/auth/AdminDashboard';
import { AdminClients } from './pages/admin/AdminClients';
import { AdminSessions } from './pages/admin/AdminSessions';
import { AdminBookings } from './pages/admin/AdminBookings';
import { Dashboard } from './pages/auth/Dashboard';
import { UserProfile } from './pages/auth/UserProfile';
import { Unauthorized } from './pages/auth/Unauthorized';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { ClientLayout } from './layouts/ClientLayout';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { ClientBookingsPage } from './pages/client/ClientBookingsPage';
import { ClientNotificationsPage } from './pages/client/ClientNotificationsPage';
import { ClientSettings } from './pages/client/ClientSettings';
import { ClientBookingPage } from './pages/client/ClientBookingPage';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <div className="hex-grid" />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <div className="hex-grid" />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Pages with Navbar & Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services/ai-chat-assistants" element={<AiChatAssistantsPage />} />
          <Route path="/services/inbound-phone-agents" element={<InboundPhoneAgentsPage />} />
          <Route path="/services/real-estate-websites" element={<RealEstateWebsitesPage />} />
          <Route path="/services/intelligent-data-sync" element={<IntelligentDataSyncPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>

        {/* Auth Pages with Navbar but no Footer */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />

        {/* Admin Pages with Sidebar Layout */}
        <Route element={<AdminLayout />}>
          <Route element={<ProtectedRoute requiredRole="Admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/clients" element={<AdminClients />} />
            <Route path="/admin/deployments" element={<AdminSessions />} />
            <Route path="/admin/system-types" element={<AdminSessions />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route element={<ClientLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/bookings" element={<ClientBookingsPage />} />
            <Route path="/dashboard/notifications" element={<ClientNotificationsPage />} />
            <Route path="/dashboard/settings" element={<ClientSettings />} />
            <Route path="/dashboard/book" element={<ClientBookingPage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<DashboardLayout><Unauthorized /></DashboardLayout>} />
      </Routes>
    </>
  );
}

export default App;
