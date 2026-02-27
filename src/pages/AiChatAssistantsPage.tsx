import { services } from '../lib/services';
import ServicePageTemplate from '../components/ServicePageTemplate';

export default function AiChatAssistantsPage() {
  return <ServicePageTemplate service={services[0]} />;
}
