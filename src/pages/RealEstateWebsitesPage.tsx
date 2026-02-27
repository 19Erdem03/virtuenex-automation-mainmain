import { services } from '../lib/services';
import ServicePageTemplate from '../components/ServicePageTemplate';

export default function RealEstateWebsitesPage() {
  return <ServicePageTemplate service={services[2]} />;
}
