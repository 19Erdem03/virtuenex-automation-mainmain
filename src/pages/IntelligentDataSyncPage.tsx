import { services } from '../lib/services';
import ServicePageTemplate from '../components/ServicePageTemplate';

export default function IntelligentDataSyncPage() {
  return <ServicePageTemplate service={services[3]} />;
}
