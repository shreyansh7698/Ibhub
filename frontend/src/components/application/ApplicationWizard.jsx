import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import * as api from '../../services/api.js';
import * as paymentService from '../../services/paymentService.js';
import { getVisaType } from '../../data/touristVisas.js';
import { LoadingDots } from '../../motion/feedback.jsx';
import StepProgress from './StepProgress.jsx';
import ApplicantInformationForm, { fieldsForVisa, validateApplicant } from './ApplicantInformationForm.jsx';
import PassportUpload from './PassportUpload.jsx';
import FinancialDocumentUpload from './FinancialDocumentUpload.jsx';
import ReviewApplication from './ReviewApplication.jsx';
import PaymentSummary from './PaymentSummary.jsx';
import DemoCheckout from './DemoCheckout.jsx';
import LegalNotice from './LegalNotice.jsx';

const TRAVEL_IDS = ['travelStartDate', 'travelEndDate'];
const pick = (obj, ids) => ids.reduce((o, k) => ((o[k] = obj[k] ?? ''), o), {});

export default function ApplicationWizard({ visa, countrySlug, initialVisaTypeId }) {
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [application, setApplication] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [visaTypeId, setVisaTypeId] = useState(initialVisaTypeId || visa.visaTypes[0].id);
  const visaType = getVisaType(countrySlug, visaTypeId);

  const [form, setForm] = useState({});
  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});
  const [stepError, setStepError] = useState(null);
  const [busy, setBusy] = useState(false);

  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [confirmConsent, setConfirmConsent] = useState(false);
  const [order, setOrder] = useState(null);

  const steps = useMemo(() => {
    const hasExtraDocs = visa.requiredDocuments.some((d) => !['passport', 'photograph'].includes(d));
    return [
      { key: 'applicant', label: 'Applicant' },
      { key: 'passport', label: 'Passport' },
      ...(hasExtraDocs ? [{ key: 'documents', label: 'Documents' }] : []),
      { key: 'review', label: 'Review' },
      { key: 'payment', label: 'Payment' }
    ];
  }, [visa]);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex]?.key;

  // create the draft on mount — once, even under StrictMode's double-invoke
  const createdRef = useRef(false);
  useEffect(() => {
    if (createdRef.current) return;
    createdRef.current = true;
    api
      .createApplication({ countrySlug, visaTypeId })
      .then(setApplication)
      .catch((e) => setCreateError(e.message || 'Could not start the application.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [stepIndex]);

  const setField = (id, value) => {
    setForm((f) => ({ ...f, [id]: value }));
    setErrors((e) => (e[id] ? { ...e, [id]: undefined } : e));
  };
  const setDoc = (type, meta) => {
    setDocuments((docs) => {
      const rest = docs.filter((d) => d.type !== type);
      return meta ? [...rest, meta] : rest;
    });
    setStepError(null);
  };

  const changeVisaType = async (id) => {
    setVisaTypeId(id);
    if (application) {
      const updated = await api.updateApplication(application.id, { visaTypeId: id });
      setApplication(updated);
    }
  };

  const requiredDocKeys = visa.requiredDocuments;
  const haveDoc = (t) => documents.some((d) => d.type === t);

  const validateStep = () => {
    if (step === 'applicant') {
      const fields = fieldsForVisa(visa);
      const e = validateApplicant(fields, form);
      setErrors(e);
      if (Object.keys(e).length) {
        setStepError('Please complete the highlighted fields.');
        return false;
      }
      return true;
    }
    if (step === 'passport') {
      const missing = ['passport', ...(requiredDocKeys.includes('photograph') ? ['photograph'] : [])].filter((t) => !haveDoc(t));
      if (missing.length) {
        setStepError('Please upload your passport copy' + (missing.includes('photograph') ? ' and photograph' : '') + '.');
        return false;
      }
      return true;
    }
    if (step === 'documents') {
      const extra = requiredDocKeys.filter((t) => !['passport', 'photograph'].includes(t));
      const missing = extra.filter((t) => !haveDoc(t));
      if (missing.length) {
        setStepError('Please upload all required documents to continue.');
        return false;
      }
      return true;
    }
    if (step === 'review') {
      if (!confirmAccurate || !confirmConsent) {
        setStepError('Please confirm both statements to continue to payment.');
        return false;
      }
      return true;
    }
    return true;
  };

  const persistStep = async () => {
    if (step === 'applicant') {
      const nonTravel = { ...form };
      TRAVEL_IDS.forEach((k) => delete nonTravel[k]);
      const updated = await api.updateApplication(application.id, {
        applicant: nonTravel,
        travel: pick(form, TRAVEL_IDS),
        step: 'applicant'
      });
      setApplication(updated);
    }
    if (step === 'review') {
      const o = await api.createPaymentOrder(application.id);
      setOrder(o);
    }
  };

  const next = async () => {
    setStepError(null);
    if (!validateStep()) {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setBusy(true);
    try {
      await persistStep();
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    } catch (e) {
      setStepError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const back = () => {
    setStepError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const handlePayment = async (outcome) => {
    setStepError(null);
    try {
      const { verified, application: paidApp } = await paymentService.checkoutAndVerify(order, outcome);
      if (verified) {
        navigate(`/visa-application/${countrySlug}/confirmation?id=${encodeURIComponent(paidApp.id)}`, {
          state: { applicationId: paidApp.id }
        });
      } else {
        setApplication(paidApp);
        setStepError('The payment did not go through. You can try again.');
      }
    } catch (e) {
      setStepError(e.message || 'Payment could not be completed.');
    }
  };

  if (createError) {
    return (
      <div className="wiz-error">
        <AlertCircle aria-hidden="true" />
        <p>{createError}</p>
      </div>
    );
  }
  if (!application) {
    return (
      <div className="wiz-loading">
        <LoadingDots /> Preparing your application…
      </div>
    );
  }

  return (
    <div className="wiz" ref={topRef}>
      <div className="wiz__progress">
        <StepProgress steps={steps} current={stepIndex} />
      </div>

      <div className="wiz__body">
        <div className="wiz__main">
          {stepError && (
            <div className="wiz__alert" role="alert">
              <AlertCircle aria-hidden="true" /> {stepError}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 'applicant' && (
                <>
                  <StepHeader n="01" title="Applicant information" desc="Enter your details exactly as they appear on your passport." />
                  {visa.visaTypes.length > 1 && (
                    <div className="field wiz__visatype">
                      <label htmlFor="wiz-visatype">Visa type <span className="req">*</span></label>
                      <select id="wiz-visatype" value={visaTypeId} onChange={(e) => changeVisaType(e.target.value)}>
                        {visa.visaTypes.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <ApplicantInformationForm
                    visa={visa}
                    values={form}
                    errors={errors}
                    onChange={setField}
                  />
                  <LegalNotice compact />
                </>
              )}

              {step === 'passport' && (
                <>
                  <StepHeader n="02" title="Passport" desc="Upload a clear copy of the photo page of your valid passport." />
                  <PassportUpload applicationId={application.id} visa={visa} documents={documents} onChange={setDoc} />
                </>
              )}

              {step === 'documents' && (
                <>
                  <StepHeader n="03" title="Supporting documents" desc={`${visa.name} requires the documents below for a tourist visa.`} />
                  <FinancialDocumentUpload applicationId={application.id} visa={visa} documents={documents} onChange={setDoc} />
                </>
              )}

              {step === 'review' && (
                <>
                  <StepHeader n={String(steps.findIndex((s) => s.key === 'review') + 1).padStart(2, '0')} title="Review your application" desc="Check everything is correct before payment. You can edit any section." />
                  <ReviewApplication
                    visa={visa}
                    visaType={visaType}
                    applicant={form}
                    documents={documents}
                    confirmAccurate={confirmAccurate}
                    confirmConsent={confirmConsent}
                    onToggleAccurate={() => setConfirmAccurate((v) => !v)}
                    onToggleConsent={() => setConfirmConsent((v) => !v)}
                    onEdit={(k) => setStepIndex(steps.findIndex((s) => s.key === k))}
                  />
                </>
              )}

              {step === 'payment' && (
                <>
                  <StepHeader n={String(steps.findIndex((s) => s.key === 'payment') + 1).padStart(2, '0')} title="Payment" desc="Complete payment to submit your application for processing." />
                  {order && <DemoCheckout order={order} onResult={handlePayment} onCancel={back} />}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {step !== 'payment' && (
            <div className="wiz__nav">
              {stepIndex > 0 ? (
                <button type="button" className="btn btn--outline" onClick={back} disabled={busy}>
                  <ArrowLeft aria-hidden="true" /> Back
                </button>
              ) : (
                <span />
              )}
              <button type="button" className="btn btn--coral btn--lg" onClick={next} disabled={busy}>
                {busy ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <LoadingDots color="#fff" /> Saving…
                  </span>
                ) : step === 'review' ? (
                  <>Continue to payment <ArrowRight aria-hidden="true" /></>
                ) : (
                  <>Continue <ArrowRight aria-hidden="true" /></>
                )}
              </button>
            </div>
          )}
        </div>

        <aside className="wiz__aside">
          <div className="wiz__aside-card">
            <p className="wiz__aside-eyebrow">Your application</p>
            <h3>{visa.name} Tourist Visa</h3>
            <p className="wiz__aside-type">{visaType.label}</p>
            <dl>
              <div><dt>Stay</dt><dd>{visaType.stayDuration}</dd></div>
              <div><dt>Entry</dt><dd>{visaType.entryType}</dd></div>
              <div><dt>Processing</dt><dd>{visaType.processingTime}</dd></div>
            </dl>
          </div>
          <PaymentSummary breakdown={order?.breakdown || visaType.fees} currency={order?.currency || visaType.fees.currency} muted={!order} />
        </aside>
      </div>
    </div>
  );
}

function StepHeader({ n, title, desc }) {
  return (
    <header className="wiz__step-head">
      <span className="wiz__step-n">{n}</span>
      <div>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
    </header>
  );
}
