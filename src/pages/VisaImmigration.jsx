import ServiceTemplate from '../components/ServiceTemplate.jsx';
import { getServiceDetail } from '../data/services.js';

export default function VisaImmigration() {
  return <ServiceTemplate detail={getServiceDetail('visa-immigration')} path="/visa-immigration" />;
}
