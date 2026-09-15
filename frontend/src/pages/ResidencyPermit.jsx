import ServiceTemplate from '../components/ServiceTemplate.jsx';
import { getServiceDetail } from '../data/services.js';

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Visa & Immigration', to: '/visa-immigration' },
  { label: 'Residency Permit' }
];

export default function ResidencyPermit() {
  return (
    <ServiceTemplate
      detail={getServiceDetail('residency-permit')}
      path="/visa-immigration/residency-permit"
      breadcrumbs={breadcrumbs}
    />
  );
}
