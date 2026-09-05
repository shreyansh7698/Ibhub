import { useState } from 'react';
import { flagUrl } from '../data/countries.js';

/**
 * Country flag image with a graceful fallback (initials chip) if the CDN fails.
 */
export default function Flag({ code, name, size = 'w80', className = '' }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`flag-fallback ${className}`} aria-label={`Flag of ${name}`} role="img">
        {code.toUpperCase()}
      </span>
    );
  }

  return (
    <img
      className={className}
      src={flagUrl(code, size)}
      alt={`Flag of ${name}`}
      loading="lazy"
      width={size === 'w40' ? 20 : size === 'w160' ? 80 : 40}
      onError={() => setFailed(true)}
    />
  );
}
