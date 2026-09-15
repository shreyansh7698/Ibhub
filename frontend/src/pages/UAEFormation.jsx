import FormationTemplate from '../components/FormationTemplate.jsx';
import { getCountry } from '../data/countries.js';

export default function UAEFormation() {
  return <FormationTemplate country={getCountry('uae')} />;
}
