import LegalPage from '../components/LegalPage.jsx';

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      description="The terms governing your use of the International Business Hub website and services."
      path="/terms"
      updated="29 August 2026"
      intro="Welcome to The International Business Hub. By accessing or using our website (www.theibhub.com) and our services, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully."
      sections={[
        {
          heading: '1. Acceptance of Terms',
          paragraphs: [
            'By using our website or any of our services, you acknowledge that you have read, understood, and agreed to these Terms & Conditions. If you do not agree, please do not use our website or services.'
          ]
        },
        {
          heading: '2. Services Offered',
          paragraphs: ['The International Business Hub provides services including but not limited to:'],
          list: [
            'Business and corporate consultation',
            'Immigration and relocation support',
            'Company formation in various countries',
            'Documentation and legal assistance'
          ],
          note: 'We reserve the right to modify or discontinue services at any time without notice.'
        },
        {
          heading: '3. User Obligations',
          paragraphs: ['You agree not to:'],
          list: [
            'Misuse the website or any content therein',
            'Submit false or misleading information',
            'Attempt to breach website security',
            'Reproduce, distribute, or exploit content without permission'
          ],
          note: 'You are responsible for maintaining the confidentiality of any login or access information provided.'
        },
        {
          heading: '4. Payment and Fees',
          paragraphs: [
            'All fees for services will be clearly communicated before engagement. Payments are due as per agreed terms. Certain services may require non-refundable deposits. All charges are subject to applicable taxes.'
          ]
        },
        {
          heading: '5. Intellectual Property',
          paragraphs: [
            'All content on this website including logos, text, images, and graphics is the intellectual property of The International Business Hub. Unauthorized use or reproduction is strictly prohibited.'
          ]
        },
        {
          heading: '6. Disclaimer of Warranties',
          paragraphs: [
            'We do our best to provide accurate and up-to-date information; however, all services and content are provided “as is” without any warranty. We do not guarantee outcomes of legal or immigration applications.'
          ]
        },
        {
          heading: '7. Limitation of Liability',
          paragraphs: [
            'The International Business Hub shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the site or our services. Our liability, if any, will be limited to the amount paid for the services rendered.'
          ]
        },
        {
          heading: '8. Third-Party Links',
          paragraphs: [
            'Our website may include links to third-party sites for additional resources. We are not responsible for the content, privacy, or practices of those external sites.'
          ]
        },
        {
          heading: '9. Termination',
          paragraphs: [
            'We reserve the right to terminate or suspend access to our services or website at any time, without notice, for conduct that violates these Terms or is harmful to our interests.'
          ]
        },
        {
          heading: '10. Governing Law',
          paragraphs: [
            'These Terms & Conditions shall be governed in accordance with the laws of the applicable jurisdiction (e.g., Singapore, UAE, India, etc. – depending on your base of operation).'
          ]
        },
        {
          heading: '11. Changes to Terms',
          paragraphs: [
            'The International Business Hub reserves the right to modify these Terms & Conditions at any time. Changes will be posted on this page, and your continued use of the website implies acceptance.'
          ]
        },
        {
          heading: '12. Contact Us',
          paragraphs: [
            'For questions or concerns regarding these Terms, please contact:',
            'The International Business Hub',
            'Email: support@theibhub.com',
            'Website: www.theibhub.com'
          ]
        }
      ]}
    />
  );
}
