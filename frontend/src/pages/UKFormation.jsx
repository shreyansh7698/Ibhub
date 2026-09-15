import FormationTemplate from '../components/FormationTemplate.jsx';
import { getCountry } from '../data/countries.js';

export default function UKFormation() {
  return <FormationTemplate country={getCountry('uk')} />;
}
