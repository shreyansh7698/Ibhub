import ServiceTemplate from '../components/ServiceTemplate.jsx';
import { getServiceDetail } from '../data/services.js';

export default function Compliance() {
  return (
    <ServiceTemplate
      detail={getServiceDetail('corporate-compliance')}
      path="/services/corporate-compliance"
    />
  );
}
