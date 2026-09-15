import FormationTemplate from '../components/FormationTemplate.jsx';
import { getCountry } from '../data/countries.js';

export default function EuropeFormation() {
  return <FormationTemplate country={getCountry('europe')} />;
}
