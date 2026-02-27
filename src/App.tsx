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
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
