/** Renders a single application field from a descriptor. Uses the shared .field styles. */
export default function FieldRenderer({ field, value, error, onChange, onBlur }) {
  const id = `af-${field.id}`;
  const describedBy = error ? `${id}-err` : field.hint ? `${id}-hint` : undefined;
  const common = {
    id,
    name: field.id,
    value: value ?? '',
    onChange: (e) => onChange(field.id, e.target.value),
    onBlur: () => onBlur?.(field.id),
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    className: error ? 'has-error' : '',
    autoComplete: field.autoComplete
  };

  return (
    <div className={`field ${field.full ? 'field--full' : ''}`}>
      <label htmlFor={id}>
        {field.label} {field.required ? <span className="req">*</span> : <span className="opt">(optional)</span>}
      </label>

      {field.type === 'select' ? (
        <select {...common}>
          <option value="">Select…</option>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea rows={3} {...common} />
      ) : (
        <input type={field.type || 'text'} {...common} />
      )}

      {field.hint && !error && (
        <span id={`${id}-hint`} className="field__hint">
          {field.hint}
        </span>
      )}
      {error && (
        <span id={`${id}-err`} className="field__error">
          {error}
        </span>
      )}
    </div>
  );
}
