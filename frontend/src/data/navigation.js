import { countries, flagUrl } from './countries.js';
import {
  Landmark,
  Calculator,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Copyright,
  Handshake,
  Luggage,
  Briefcase,
  Home
} from 'lucide-react';

const formationCountries = ['usa', 'uk', 'uae', 'singapore', 'hong-kong', 'europe'];

export const companyFormationMenu = countries
  .filter((c) => formationCountries.includes(c.slug))
  .sort((a, b) => formationCountries.indexOf(a.slug) - formationCountries.indexOf(b.slug))
  .map((c) => ({
    label: `${c.shortName} Company Formation`,
    to: c.formationPath,
    flag: flagUrl(c.code, 'w40')
  }));

export const businessServicesMenu = [
  { label: 'Bank Account Assistance', to: '/services/bank-account-assistance', icon: Landmark, hint: 'Business banking & payments' },
  // { label: 'Accounting & Tax', to: '/services/accounting-tax', icon: Calculator, hint: 'Bookkeeping, filings, returns' },
  { label: 'Virtual Office', to: '/services/virtual-office', icon: MapPin, hint: 'Address & mail handling' },
  // { label: 'Compliance', to: '/services/corporate-compliance', icon: ShieldCheck, hint: 'Annual filings & secretary' },
  // { label: 'Business Expansion', to: '/services/business-expansion', icon: TrendingUp, hint: 'Market entry & structuring' },
  { label: 'Trademark Registration', to: '/services/trademark-registration', icon: Copyright, hint: 'Brand searches & filing' },
  { label: 'Buy an Existing Business', to: '/services/buy-a-business', icon: Handshake, hint: 'Sourcing & due diligence' }
];

export const visaMenu = [
  { label: 'Tourist Visa', to: '/visa-immigration/tourist-visa', icon: Luggage, hint: 'Short-stay visitor visas' },
  { label: 'Business Visa', to: '/visa-immigration/business-visa', icon: Briefcase, hint: 'Entrepreneur & investor routes' },
  { label: 'Residency Permit', to: '/visa-immigration/residency-permit', icon: Home, hint: 'Long-stay & dependents' }
];

export const countriesMenu = countries
  .filter((c) => formationCountries.includes(c.slug))
  .map((c) => ({
    label: c.name,
    to: `/countries/${c.slug}`,
    flag: flagUrl(c.code, 'w40')
  }));

// Top-level navigation model. `type` drives how the Header renders each item.
export const navItems = [
  { label: 'Home', to: '/', type: 'link' },
  { label: 'Company Formation', to: '/company-formation', type: 'dropdown', menu: companyFormationMenu, menuKind: 'flag' },
  { label: 'Visa ', to: '/visa-immigration', type: 'dropdown', menu: visaMenu, menuKind: 'icon' },
  { label: 'Business Services', to: '/services', type: 'dropdown', menu: businessServicesMenu, menuKind: 'icon' },
  // { label: 'Countries', to: '/countries', type: 'dropdown', menu: countriesMenu, menuKind: 'flag' },
  // { label: 'Resources', to: '/blog', type: 'link' },
  { label: 'About', to: '/about', type: 'link' },
  { label: 'Contact', to: '/contact', type: 'link' }
];
