import ServiceTemplate from '../components/ServiceTemplate.jsx';
import { getServiceDetail } from '../data/services.js';

export default function BusinessExpansion() {
  return (
    <ServiceTemplate
      detail={getServiceDetail('business-expansion')}
      path="/services/business-expansion"
    />
  );
}
