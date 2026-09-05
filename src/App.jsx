import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';
import CompanyFormation from './pages/CompanyFormation.jsx';
import USAFormation from './pages/USAFormation.jsx';
import UKFormation from './pages/UKFormation.jsx';
import UAEFormation from './pages/UAEFormation.jsx';
import SingaporeFormation from './pages/SingaporeFormation.jsx';
import HongKongFormation from './pages/HongKongFormation.jsx';
import EuropeFormation from './pages/EuropeFormation.jsx';
import VisaImmigration from './pages/VisaImmigration.jsx';
import TouristVisa from './pages/TouristVisa.jsx';
import BusinessVisa from './pages/BusinessVisa.jsx';
import ResidencyPermit from './pages/ResidencyPermit.jsx';
import Banking from './pages/Banking.jsx';
import Accounting from './pages/Accounting.jsx';
import VirtualOffice from './pages/VirtualOffice.jsx';
import BusinessExpansion from './pages/BusinessExpansion.jsx';
import Compliance from './pages/Compliance.jsx';
import TrademarkRegistration from './pages/TrademarkRegistration.jsx';
import BuyBusiness from './pages/BuyBusiness.jsx';
import Countries from './pages/Countries.jsx';
import CountryPage from './pages/CountryPage.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import FAQPage from './pages/FAQPage.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Terms from './pages/Terms.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />

          <Route path="company-formation" element={<CompanyFormation />} />
          <Route path="company-formation/usa" element={<USAFormation />} />
          <Route path="company-formation/uk" element={<UKFormation />} />
          <Route path="company-formation/uae" element={<UAEFormation />} />
          <Route path="company-formation/singapore" element={<SingaporeFormation />} />
          <Route path="company-formation/hong-kong" element={<HongKongFormation />} />
          <Route path="company-formation/europe" element={<EuropeFormation />} />

          <Route path="visa-immigration" element={<VisaImmigration />} />
          <Route path="visa-immigration/tourist-visa" element={<TouristVisa />} />
          <Route path="visa-immigration/business-visa" element={<BusinessVisa />} />
          <Route path="visa-immigration/residency-permit" element={<ResidencyPermit />} />
          <Route path="services/bank-account-assistance" element={<Banking />} />
          <Route path="services/accounting-tax" element={<Accounting />} />
          <Route path="services/virtual-office" element={<VirtualOffice />} />
          <Route path="services/business-expansion" element={<BusinessExpansion />} />
          <Route path="services/corporate-compliance" element={<Compliance />} />
          <Route path="services/trademark-registration" element={<TrademarkRegistration />} />
          <Route path="services/buy-a-business" element={<BuyBusiness />} />

          <Route path="countries" element={<Countries />} />
          <Route path="countries/:slug" element={<CountryPage />} />

          <Route path="resources" element={<Blog />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
