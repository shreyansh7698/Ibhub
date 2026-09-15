import { motion } from 'framer-motion';
import { STANDARD_FIELDS, FIELD_GROUPS } from '../../services/types.js';
import FieldRenderer from './FieldRenderer.jsx';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isoToday = () => new Date().toISOString().slice(0, 10);

/** Build the field list for a country (standard + any per-country extras). */
export function fieldsForVisa(visa) {
  const extra = visa?.applicationFields || [];
  return [...STANDARD_FIELDS, ...extra];
}

/** Pure validation — returns { fieldId: message }. */
export function validateApplicant(fields, values) {
  const e = {};
  fields.forEach((f) => {
    const v = (values[f.id] ?? '').toString().trim();
    if (f.required && !v) {
      e[f.id] = `${f.label} is required.`;
      return;
    }
    if (!v) return;
    if (f.type === 'email' && !emailRe.test(v)) e[f.id] = 'Enter a valid email address.';
    if (f.type === 'tel' && v.replace(/[^\d]/g, '').length < 7) e[f.id] = 'Enter a valid phone number.';
    if (f.id === 'passportExpiryDate' && v <= isoToday()) e[f.id] = 'Your passport must not be expired.';
    if (f.id === 'travelEndDate' && values.travelStartDate && v < values.travelStartDate) {
      e[f.id] = 'Travel end date must be after the start date.';
    }
    if (f.id === 'dateOfBirth' && v >= isoToday()) e[f.id] = 'Enter a valid date of birth.';
  });
  return e;
}

export default function ApplicantInformationForm({ visa, values, errors, onChange, onBlur }) {
  const fields = fieldsForVisa(visa);
  return (
    <div className="wiz-form">
      {FIELD_GROUPS.map((group, gi) => {
        const groupFields = fields.filter((f) => f.group === group.id);
        if (!groupFields.length) return null;
        return (
          <motion.fieldset
            key={group.id}
            className="wiz-fieldset"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * gi, duration: 0.35 }}
          >
            <legend>{group.label}</legend>
            <div className="form-grid">
              {groupFields.map((f) => (
                <FieldRenderer
                  key={f.id}
                  field={f}
                  value={values[f.id]}
                  error={errors[f.id]}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              ))}
            </div>
          </motion.fieldset>
        );
      })}
    </div>
  );
}
