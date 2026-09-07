import { useState } from 'react';
import { StickyNote, Send } from 'lucide-react';
import * as api from '../../services/api.js';

const fmt = (iso) => new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function AdminNotes({ application, onChange }) {
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!body.trim()) return;
    setBusy(true);
    try {
      const updated = await api.adminAddNote(application.id, body.trim());
      onChange(updated);
      setBody('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-notes">
      <p className="admin-notes__hint">
        <StickyNote aria-hidden="true" /> Internal only — not shown to the applicant.
      </p>
      <ul className="admin-notes__list">
        {(application.notes || []).length === 0 && <li className="admin-empty">No notes yet.</li>}
        {(application.notes || [])
          .slice()
          .reverse()
          .map((n) => (
            <li key={n.id}>
              <p>{n.body}</p>
              <span>
                {n.by} · {fmt(n.at)}
              </span>
            </li>
          ))}
      </ul>
      <div className="admin-notes__add">
        <textarea
          rows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add an internal note…"
        />
        <button type="button" className="btn btn--sm btn--coral" disabled={busy || !body.trim()} onClick={add}>
          <Send aria-hidden="true" /> Add note
        </button>
      </div>
    </div>
  );
}
