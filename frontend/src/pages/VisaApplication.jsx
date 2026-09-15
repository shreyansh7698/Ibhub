import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import ApplicationLayout from '../components/application/ApplicationLayout.jsx';
import ApplicationWizard from '../components/application/ApplicationWizard.jsx';
import { getTouristVisa, getVisaType } from '../data/touristVisas.js';

export default function VisaApplication() {
  const { countrySlug } = useParams();
  const [params] = useSearchParams();
  const visa = getTouristVisa(countrySlug);

  if (!visa) return <Navigate to="/visa-immigration/tourist-visa" replace />;

  // The URL is only a hint for which visa type to pre-select — the backend
  // revalidates the type and its fee when creating the payment order.
  const requestedType = params.get('visaType');
  const initialVisaTypeId = getVisaType(countrySlug, requestedType)?.id || visa.visaTypes[0].id;

  return (
    <>
      <Seo
        title={`${visa.name} Tourist Visa Application`}
        description={`Apply for a ${visa.name} tourist visa.`}
        path={`/visa-application/${countrySlug}`}
        noindex
      />
      <ApplicationLayout
        title={`${visa.name} Tourist Visa Application`}
        subtitle="About 10 minutes · your progress is saved as you go"
        exitTo={`/visa-immigration/tourist-visa/${countrySlug}`}
      >
        <ApplicationWizard visa={visa} countrySlug={countrySlug} initialVisaTypeId={initialVisaTypeId} />
      </ApplicationLayout>
    </>
  );
}
