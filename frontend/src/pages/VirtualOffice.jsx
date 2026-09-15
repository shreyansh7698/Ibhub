import ServiceTemplate from '../components/ServiceTemplate.jsx';
import { getServiceDetail } from '../data/services.js';

export default function VirtualOffice() {
  return (
    <ServiceTemplate detail={getServiceDetail('virtual-office')} path="/services/virtual-office" />
  );
}
