import { Routes, Route, useLocation } from 'react-router-dom';
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
import { Signup } from './pages/auth/Signup';
import { AdminDashboard } from './pages/auth/AdminDashboard';
import { Dashboard } from './pages/auth/Dashboard';
import { UserProfile } from './pages/auth/UserProfile';
import { Unauthorized } from './pages/auth/Unauthorized';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function BareLayout({ children }: { children: React.ReactNode }) {
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

function App() {
  return (
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

      {/* Auth and Dashboard Pages without Navbar/Footer */}
      <Route path="/login" element={<BareLayout><Login /></BareLayout>} />
      <Route path="/signup" element={<BareLayout><Signup /></BareLayout>} />

      <Route element={<BareLayout><ProtectedRoute requiredRole="Admin" /></BareLayout>}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route element={<BareLayout><ProtectedRoute /></BareLayout>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>

      <Route path="/unauthorized" element={<BareLayout><Unauthorized /></BareLayout>} />
    </Routes>
  );
}

export default App;
