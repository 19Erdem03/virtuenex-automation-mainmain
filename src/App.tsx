import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
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
import { ClientDashboard } from './pages/auth/ClientDashboard';
import { UserProfile } from './pages/auth/UserProfile';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
function App() {
  return (
    <>
      <Routes>
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

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute requiredRole="Admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Add more admin routes here */}
          </Route>

          <Route element={<ProtectedRoute requiredRole="Client" />}>
            <Route path="/client" element={<ClientDashboard />} />
            {/* Add more client routes here */}
          </Route>

          <Route element={<ProtectedRoute requiredRole="Lead" />}>
            <Route path="/profile" element={<UserProfile />} />
            {/* Add more lead routes here */}
          </Route>

          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
