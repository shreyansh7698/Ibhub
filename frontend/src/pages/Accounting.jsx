import ServiceTemplate from '../components/ServiceTemplate.jsx';
import { getServiceDetail } from '../data/services.js';

export default function Accounting() {
  return (
    <ServiceTemplate detail={getServiceDetail('accounting-tax')} path="/services/accounting-tax" />
  );
}
