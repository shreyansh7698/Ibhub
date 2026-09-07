import { useState } from 'react';
import { ADMIN_STATUS_OPTIONS, APPLICATION_STATUS_LABELS } from '../../services/types.js';
import { StatusBadge } from '../application/ApplicationStatus.jsx';
import * as api from '../../services/api.js';

export default function StatusSelector({ application, onChange }) {
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const apply = async () => {
    if (!status) return;
    setBusy(true);
    try {
      const updated = await api.adminSetStatus(application.id, status, note.trim() || undefined);
      onChange(updated);
      setStatus('');
      setNote('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="status-selector">
      <div className="status-selector__current">
        Current status <StatusBadge status={application.status} />
      </div>
      <div className="field">
        <label htmlFor="ss-status">Change status to</label>
        <select id="ss-status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select a status…</option>
          {ADMIN_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {APPLICATION_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="ss-note">Note (optional, added to the timeline)</label>
        <textarea id="ss-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <button type="button" className="btn btn--coral btn--block" disabled={!status || busy} onClick={apply}>
        {busy ? 'Updating…' : 'Update status'}
      </button>
    </div>
  );
}
