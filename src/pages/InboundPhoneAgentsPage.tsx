import { services } from '../lib/services';
import ServicePageTemplate from '../components/ServicePageTemplate';

export default function InboundPhoneAgentsPage() {
  return <ServicePageTemplate service={services[1]} />;
}
