import ServiceTemplate from '../components/ServiceTemplate.jsx';
import { getServiceDetail } from '../data/services.js';

export default function Banking() {
  return (
    <ServiceTemplate
      detail={getServiceDetail('bank-account-assistance')}
      path="/services/bank-account-assistance"
    />
  );
}
