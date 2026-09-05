import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { SuccessCheck, LoadingDots } from '../motion/feedback.jsx';
import ConfettiBurst from '../motion/anime/ConfettiBurst.jsx';
import { spring } from '../motion/presets.js';
import { allServices, visaCountries } from '../data/services.js';
import { countries } from '../data/countries.js';
import { site } from '../data/site.js';

const WHATSAPP_NUMBER = String(site.whatsapp).replace(/[^\d]/g, '');

// When this service is selected, the country dropdown switches to visa destinations.
const VISA_SERVICE = 'Visa & Immigration';
const isVisaService = (service) => service === VISA_SERVICE;

const buildWhatsAppMessage = (form) => {
  const lines = [
    'Hi The International Business Hub, I would like to request a consultation.',
    '',
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `Country of residence: ${form.residence}`,
    `Service interested in: ${form.service}`,
  ];
  if (form.businessCountry) {
    const label = isVisaService(form.service) ? 'Preferred destination country' : 'Preferred business country';
    lines.push(`${label}: ${form.businessCountry}`);
  }
  if (form.message.trim()) lines.push('', `Message: ${form.message.trim()}`);
  return lines.join('\n');
};

const SERVICE_OPTIONS = [
  ...allServices.map((s) => s.title),
  'Not sure yet — need advice'
];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  residence: '',
  service: '',
  businessCountry: '',
  message: '',
  agree: false
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Please enter your full name.';
  if (!form.email.trim()) errors.email = 'Please enter your email address.';
  else if (!emailRe.test(form.email)) errors.email = 'Please enter a valid email address.';
  if (!form.phone.trim()) errors.phone = 'Please enter a phone number.';
  else if (form.phone.replace(/[^\d]/g, '').length < 7) errors.phone = 'Please enter a valid phone number.';
  if (!form.residence.trim()) errors.residence = 'Please enter your country of residence.';
  if (!form.service) errors.service = 'Please choose a service.';
  if (!form.agree) errors.agree = 'Please accept the Privacy Policy to continue.';
  return errors;
}

/**
 * Consultation form. Simulates submission with local state.
 * To connect a backend, replace the body of `submitToApi` with a real fetch call.
 */
export default function ConsultationForm({ compact = false }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success
  const [whatsAppHref, setWhatsAppHref] = useState('');

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => {
      const next = { ...f, [field]: value };
      // The country dropdown swaps its options when switching to/from Visa & Immigration,
      // so clear any now-invalid selection.
      if (field === 'service' && isVisaService(f.service) !== isVisaService(value)) {
        next.businessCountry = '';
      }
      return next;
    });
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const visaMode = isVisaService(form.service);
  const countryOptions = visaMode ? visaCountries : countries;

  const submitToApi = (payload) =>
    new Promise((resolve) => {
      // Simulated network request. Swap for: fetch('/api/consultation', { method: 'POST', body: JSON.stringify(payload) })
      // eslint-disable-next-line no-console
      console.info('Consultation request (demo):', payload);
      setTimeout(resolve, 1200);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstField = Object.keys(found)[0];
      document.getElementById(`cf-${firstField}`)?.focus();
      return;
    }

    // Open WhatsApp synchronously (inside the click gesture) so pop-up blockers allow it,
    // with the enquiry details pre-filled.
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(form))}`;
    setWhatsAppHref(url);
    window.open(url, '_blank', 'noopener,noreferrer');

    setStatus('submitting');
    submitToApi(form).then(() => {
      setStatus('success');
      setForm(initialForm);
    });
  };

  if (status === 'success') {
    return (
      <motion.div
        className={`consult ${compact ? 'consult--compact' : ''}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring.soft}
      >
        <div className="form-success" role="status">
          <span style={{ flexShrink: 0, position: 'relative' }}>
            <SuccessCheck size={40} />
            <ConfettiBurst trigger />
          </span>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h4>Thank you — we've opened WhatsApp with your details.</h4>
            <p>
              Send the pre-filled message to reach a consultant directly. If WhatsApp didn't open,{' '}
              <a href={whatsAppHref} target="_blank" rel="noreferrer">tap here to continue on WhatsApp</a>. In
              the meantime, explore our{' '}
              <Link to="/company-formation">company formation options</Link>.
            </p>
          </motion.div>
        </div>
        <motion.button
          type="button"
          className="btn btn--outline mt-md"
          onClick={() => setStatus('idle')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          Submit another request
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form className={`consult ${compact ? 'consult--compact' : ''}`} onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="cf-name">
            Full Name <span className="req">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={update('name')}
            className={errors.name ? 'has-error' : ''}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'cf-name-err' : undefined}
          />
          {errors.name && <span id="cf-name-err" className="field__error">{errors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="cf-email">
            Email <span className="req">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            className={errors.email ? 'has-error' : ''}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'cf-email-err' : undefined}
          />
          {errors.email && <span id="cf-email-err" className="field__error">{errors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="cf-phone">
            Phone <span className="req">*</span>
          </label>
          <input
            id="cf-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={update('phone')}
            className={errors.phone ? 'has-error' : ''}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'cf-phone-err' : undefined}
          />
          {errors.phone && <span id="cf-phone-err" className="field__error">{errors.phone}</span>}
        </div>

        <div className="field">
          <label htmlFor="cf-residence">
            Country of Residence <span className="req">*</span>
          </label>
          <input
            id="cf-residence"
            type="text"
            autoComplete="country-name"
            value={form.residence}
            onChange={update('residence')}
            className={errors.residence ? 'has-error' : ''}
            aria-invalid={Boolean(errors.residence)}
            aria-describedby={errors.residence ? 'cf-residence-err' : undefined}
          />
          {errors.residence && (
            <span id="cf-residence-err" className="field__error">{errors.residence}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="cf-service">
            Service Interested In <span className="req">*</span>
          </label>
          <select
            id="cf-service"
            value={form.service}
            onChange={update('service')}
            className={errors.service ? 'has-error' : ''}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? 'cf-service-err' : undefined}
          >
            <option value="">Select a service…</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.service && <span id="cf-service-err" className="field__error">{errors.service}</span>}
        </div>

        <div className="field">
          <label htmlFor="cf-businessCountry">
            {visaMode ? 'Preferred Destination Country' : 'Preferred Business Country'}
          </label>
          <select id="cf-businessCountry" value={form.businessCountry} onChange={update('businessCountry')}>
            <option value="">Select a country (optional)…</option>
            {countryOptions.map((c) => (
              <option key={c.slug ?? c.code ?? c.name} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="Undecided">Undecided</option>
          </select>
        </div>

        <div className="field field--full">
          <label htmlFor="cf-message">Message</label>
          <textarea
            id="cf-message"
            rows="4"
            value={form.message}
            onChange={update('message')}
            placeholder="Tell us a little about your business and what you'd like help with."
          />
        </div>

        <div className="field field--full">
          <label className="checkbox" htmlFor="cf-agree">
            <input
              id="cf-agree"
              type="checkbox"
              checked={form.agree}
              onChange={update('agree')}
              aria-invalid={Boolean(errors.agree)}
              aria-describedby={errors.agree ? 'cf-agree-err' : undefined}
            />
            <span>
              I agree to the <Link to="/privacy-policy">Privacy Policy</Link> and consent to being
              contacted about my enquiry.
            </span>
          </label>
          {errors.agree && <span id="cf-agree-err" className="field__error">{errors.agree}</span>}
        </div>
      </div>

      <motion.button
        type="submit"
        className="btn btn--primary btn--lg btn--block mt-md has-sheen"
        disabled={status === 'submitting'}
        whileHover={{ scale: status === 'submitting' ? 1 : 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={spring.soft}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === 'submitting' ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
            >
              <LoadingDots color="#fff" /> Sending…
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Send aria-hidden="true" /> Request Consultation on WhatsApp
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </form>
  );
}
