import FormationTemplate from '../components/FormationTemplate.jsx';
import { getCountry } from '../data/countries.js';

export default function SingaporeFormation() {
  return <FormationTemplate country={getCountry('singapore')} />;
}
