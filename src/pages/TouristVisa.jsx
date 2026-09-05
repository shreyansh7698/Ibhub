import ServiceTemplate from '../components/ServiceTemplate.jsx';
import { getServiceDetail } from '../data/services.js';

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Visa & Immigration', to: '/visa-immigration' },
  { label: 'Tourist Visa' }
];

export default function TouristVisa() {
  return (
    <ServiceTemplate
      detail={getServiceDetail('tourist-visa')}
      path="/visa-immigration/tourist-visa"
      breadcrumbs={breadcrumbs}
    />
  );
}
