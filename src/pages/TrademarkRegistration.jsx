import ServiceTemplate from '../components/ServiceTemplate.jsx';
import { getServiceDetail } from '../data/services.js';

export default function TrademarkRegistration() {
  return (
    <ServiceTemplate
      detail={getServiceDetail('trademark-registration')}
      path="/services/trademark-registration"
    />
  );
}
