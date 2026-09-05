// Curated photography for the site. All URLs are stable images.unsplash.com
// permalinks used with sizing params. Components that render these images fall
// back to a gradient placeholder if a photo fails to load.
const photo = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Generic, reusable business imagery
export const media = {
  teamCollaboration: photo('1521737604893-d14cc237f11d'),
  boardroomMeeting: photo('1600880292203-757bb62b4baf'),
  roundtable: photo('1552664730-d307ca884978'),
  officeTower: photo('1486406146926-c627a92ad1ab'),
  openPlanOffice: photo('1497366811353-6870744d04b2'),
  meetingRoom: photo('1497366216548-37526070297c'),
  financeDesk: photo('1454165804606-c3d57bc86b40'),
  bookkeeping: photo('1460925895917-afdab827c52f'),
  analyticsLaptop: photo('1551288049-bebda4e38f71'),
  bankingProfessional: photo('1554224155-6726b3ff858f'),
  paperworkDesk: photo('1450101499163-c8848c66ca85'),
  travelVisa: photo('1500835556837-99ac94a94552'),
  handshake: photo('1521791136064-7986c2920216'),
  notebookPlanning: photo('1499750310107-5fef28a66643'),
};

// Page hero backgrounds, keyed by route intent
export const pageImages = {
  home: media.teamCollaboration,
  about: media.boardroomMeeting,
  services: media.openPlanOffice,
  companyFormation: media.officeTower,
  countries: photo('1496442226666-8d4d0e62e6e9'),
  contact: media.meetingRoom,
  blog: media.notebookPlanning,
  faq: media.roundtable,
  visaImmigration: media.travelVisa,
};

// Company-formation / country guide imagery — recognisable business skylines
export const countryImages = {
  usa: photo('1496442226666-8d4d0e62e6e9'),
  uk: photo('1513635269975-59663e0ac1ad'),
  uae: photo('1512453979798-5ea266f8880c'),
  singapore: photo('1525625293386-3f8f99389edd'),
  'hong-kong': photo('1536599018102-9f803c140fc1'),
  europe: photo('1467269204594-9661b134dd2b'),
};

// Service detail imagery, keyed by service slug
export const serviceImages = {
  'company-formation': media.officeTower,
  'bank-account-assistance': media.bankingProfessional,
  'accounting-tax': media.bookkeeping,
  'visa-immigration': media.travelVisa,
  'virtual-office': media.meetingRoom,
  'corporate-compliance': media.paperworkDesk,
  'business-expansion': media.analyticsLaptop,
  'global-advisory': media.roundtable,
  'trademark-registration': media.paperworkDesk,
  'buy-a-business': media.handshake,
  'tourist-visa': media.travelVisa,
  'business-visa': media.handshake,
  'residency-permit': media.paperworkDesk,
};
