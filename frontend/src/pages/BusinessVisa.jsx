import ServiceTemplate from '../components/ServiceTemplate.jsx';
import { getServiceDetail } from '../data/services.js';

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Visa & Immigration', to: '/visa-immigration' },
  { label: 'Business Visa' }
];

export default function BusinessVisa() {
  return (
    <ServiceTemplate
      detail={getServiceDetail('business-visa')}
      path="/visa-immigration/business-visa"
      breadcrumbs={breadcrumbs}
    />
  );
}
