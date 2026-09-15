import ServiceTemplate from '../components/ServiceTemplate.jsx';
import { getServiceDetail } from '../data/services.js';

export default function BuyBusiness() {
  return (
    <ServiceTemplate detail={getServiceDetail('buy-a-business')} path="/services/buy-a-business" />
  );
}
