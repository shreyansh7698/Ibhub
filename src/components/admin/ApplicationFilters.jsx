import { Search, X } from 'lucide-react';
import { touristVisaCountries } from '../../data/touristVisas.js';
import { ADMIN_STATUS_OPTIONS, APPLICATION_STATUS, APPLICATION_STATUS_LABELS, PAYMENT_STATUS } from '../../services/types.js';

const APP_STATUSES = [
  APPLICATION_STATUS.PAID,
  ...ADMIN_STATUS_OPTIONS,
  APPLICATION_STATUS.PAYMENT_PENDING,
  APPLICATION_STATUS.DOCUMENTS_PENDING
];

export default function ApplicationFilters({ query, onChange }) {
  const set = (patch) => onChange({ ...query, ...patch, page: 1 });
  const active =
    query.search || query.country || query.status || query.paymentStatus || query.from || query.to;

  return (
    <div className="admin-filters">
      <div className="admin-filters__search">
        <Search aria-hidden="true" />
        <input
          type="search"
          placeholder="Search by ID, name, email, passport no. or payment ref"
          value={query.search || ''}
          onChange={(e) => set({ search: e.target.value })}
        />
      </div>
      <div className="admin-filters__row">
        <select value={query.country || ''} onChange={(e) => set({ country: e.target.value })}>
          <option value="">All countries</option>
          {touristVisaCountries.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={query.status || ''} onChange={(e) => set({ status: e.target.value })}>
          <option value="">All statuses</option>
          {APP_STATUSES.map((s) => (
            <option key={s} value={s}>
              {APPLICATION_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select value={query.paymentStatus || ''} onChange={(e) => set({ paymentStatus: e.target.value })}>
          <option value="">Any payment</option>
          {Object.values(PAYMENT_STATUS).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="admin-filters__date">
          From <input type="date" value={query.from || ''} onChange={(e) => set({ from: e.target.value })} />
        </label>
        <label className="admin-filters__date">
          To <input type="date" value={query.to || ''} onChange={(e) => set({ to: e.target.value })} />
        </label>
        {active && (
          <button
            type="button"
            className="admin-filters__clear"
            onClick={() =>
              onChange({ page: 1, pageSize: query.pageSize, sort: query.sort, dir: query.dir })
            }
          >
            <X aria-hidden="true" /> Clear
          </button>
        )}
      </div>
      <p className="admin-filters__note">
        Demo searches and filters the browser store. Production searches server-side and never sends
        the full dataset to the browser.
      </p>
    </div>
  );
}
