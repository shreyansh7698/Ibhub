import FormationTemplate from '../components/FormationTemplate.jsx';
import { getCountry } from '../data/countries.js';

export default function USAFormation() {
  return <FormationTemplate country={getCountry('usa')} />;
}
