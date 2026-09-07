import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { isMock } from '../services/api.js';

/**
 * Shown wherever the visa flow / admin runs on the mock service layer, so it's
 * never mistaken for a production-secure system.
 */
export default function DemoModeBanner({ variant = 'bar' }) {
  const [open, setOpen] = useState(true);
  if (!isMock || !open) return null;

  return (
    <div className={`demo-banner demo-banner--${variant}`} role="note">
      <Info aria-hidden="true" />
      <p>
        <strong>Demo mode.</strong> Mock services only — no real backend, payment gateway, admin
        authentication or private file storage. Uploaded documents stay in this browser tab and are
        never persisted.
      </p>
      <button type="button" onClick={() => setOpen(false)} aria-label="Dismiss">
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
