import LegalPage from '../components/LegalPage.jsx';

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How The International Business Hub collects, uses, and protects your personal information."
      path="/privacy-policy"
      updated="1 August 2026"
      intro="This Privacy Policy explains how The International Business Hub (“we”, “us”) collects, uses, discloses, and safeguards your information when you visit our website or use our services. This is a sample policy for a demonstration website and should be reviewed by a qualified adviser before real-world use."
      sections={[
        {
          heading: 'Information We Collect',
          paragraphs: [
            'We collect information you provide directly, such as your name, email address, phone number, country of residence, and details about your business when you complete a consultation form or contact us.',
            'We also collect limited technical information automatically, such as your browser type, device, and pages viewed, to help us improve the website.'
          ]
        },
        {
          heading: 'How We Use Your Information',
          paragraphs: [
            'We use your information to respond to enquiries, provide and administer our services, prepare filings and applications on your instruction, communicate service updates, and meet legal and regulatory obligations.',
            'We do not sell your personal information.'
          ]
        },
        {
          heading: 'Sharing Your Information',
          paragraphs: [
            'We share information only as needed to deliver a service you have requested — for example with company registries, banks, payment providers, tax authorities, and licensed professional partners.',
            'We may also disclose information where required by law or to protect our legal rights.'
          ]
        },
        {
          heading: 'Data Retention',
          paragraphs: [
            'We retain personal information for as long as necessary to provide our services and to comply with legal, accounting, and reporting requirements, after which it is securely deleted or anonymised.'
          ]
        },
        {
          heading: 'Your Rights',
          paragraphs: [
            'Depending on your location, you may have rights to access, correct, delete, or restrict the processing of your personal information, and to object to processing or request portability.',
            'To exercise any of these rights, contact us using the details on our Contact page.'
          ]
        },
        {
          heading: 'Security',
          paragraphs: [
            'We use appropriate technical and organisational measures to protect personal information. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.'
          ]
        },
        {
          heading: 'Changes to This Policy',
          paragraphs: [
            'We may update this policy from time to time. Material changes will be posted on this page with an updated revision date.'
          ]
        }
      ]}
    />
  );
}
