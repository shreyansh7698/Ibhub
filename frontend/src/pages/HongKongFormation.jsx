import FormationTemplate from '../components/FormationTemplate.jsx';
import { getCountry } from '../data/countries.js';

export default function HongKongFormation() {
  return <FormationTemplate country={getCountry('hong-kong')} />;
}
