import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Visa application flow + admin — code-split, kept off the marketing bundle.
import RequireAdmin from './components/admin/RequireAdmin.jsx';
import RequireUser from './components/auth/RequireUser.jsx';
const TouristVisaCountry = lazy(() => import('./pages/TouristVisaCountry.jsx'));
const VisaApplication = lazy(() => import('./pages/VisaApplication.jsx'));
const ApplicationConfirmation = lazy(() => import('./pages/ApplicationConfirmation.jsx'));
const ApplicationStatusPage = lazy(() => import('./pages/ApplicationStatusPage.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));
const AdminLogin = lazy(() => import('./admin/AdminLogin.jsx'));
const AdminForgotPassword = lazy(() => import('./admin/AdminForgotPassword.jsx'));
const AdminResetPassword = lazy(() => import('./admin/AdminResetPassword.jsx'));
const AdminLayout = lazy(() => import('./admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard.jsx'));
const AdminApplications = lazy(() => import('./admin/AdminApplications.jsx'));
const AdminApplicationDetails = lazy(() => import('./admin/AdminApplicationDetails.jsx'));

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
          <Route
            path="visa-immigration/tourist-visa/:countrySlug"
            element={
              <Suspense fallback={<div className="route-fallback" />}>
                <TouristVisaCountry />
              </Suspense>
            }
          />
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

        {/* User auth — gates the application flow below, own minimal chrome */}
        <Route
          path="/login"
          element={
            <Suspense fallback={<div className="route-fallback" />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<div className="route-fallback" />}>
              <Signup />
            </Suspense>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<div className="route-fallback" />}>
              <ForgotPassword />
            </Suspense>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Suspense fallback={<div className="route-fallback" />}>
              <ResetPassword />
            </Suspense>
          }
        />

        {/* Visa application flow — own minimal chrome, no marketing nav. Requires login. */}
        <Route
          path="/visa-application/:countrySlug"
          element={
            <RequireUser>
              <Suspense fallback={<div className="route-fallback" />}>
                <VisaApplication />
              </Suspense>
            </RequireUser>
          }
        />
        <Route
          path="/visa-application/:countrySlug/confirmation"
          element={
            <RequireUser>
              <Suspense fallback={<div className="route-fallback" />}>
                <ApplicationConfirmation />
              </Suspense>
            </RequireUser>
          }
        />
        <Route
          path="/application/:applicationId"
          element={
            <Suspense fallback={<div className="route-fallback" />}>
              <ApplicationStatusPage />
            </Suspense>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<div className="route-fallback" />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin/forgot-password"
          element={
            <Suspense fallback={<div className="route-fallback" />}>
              <AdminForgotPassword />
            </Suspense>
          }
        />
        <Route
          path="/admin/reset-password"
          element={
            <Suspense fallback={<div className="route-fallback" />}>
              <AdminResetPassword />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Suspense fallback={<div className="route-fallback" />}>
                <AdminLayout />
              </Suspense>
            </RequireAdmin>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<div className="route-fallback" />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="applications"
            element={
              <Suspense fallback={<div className="route-fallback" />}>
                <AdminApplications />
              </Suspense>
            }
          />
          <Route
            path="applications/:applicationId"
            element={
              <Suspense fallback={<div className="route-fallback" />}>
                <AdminApplicationDetails />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
