const fmt = (iso) =>
  new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/**
 * Audit trail for an application. `showInternal` reveals admin-only events
 * (notes) — never passed from the applicant-facing views.
 */
export default function ApplicationTimeline({ timeline = [], showInternal = false }) {
  const events = [...timeline].filter((e) => showInternal || !e.internal).reverse();
  return (
    <ol className="timeline">
      {events.map((e) => (
        <li key={e.id} className={`timeline__item timeline__item--${e.type}`}>
          <span className="timeline__dot" aria-hidden="true" />
          <div className="timeline__body">
            <p className="timeline__label">{e.label}</p>
            <p className="timeline__meta">
              {fmt(e.at)}
              {e.by ? ` · ${e.by}` : ''}
              {e.reason ? ` · ${e.reason}` : ''}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
