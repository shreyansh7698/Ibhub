import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, FileCheck2, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../application/ApplicationStatus.jsx';
import { DOCUMENT_STATUS } from '../../services/types.js';

const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

function SortHead({ label, field, query, onSort }) {
  const activeSort = query.sort === field;
  return (
    <th>
      <button type="button" className={`admin-th ${activeSort ? 'is-active' : ''}`} onClick={() => onSort(field)}>
        {label}
        {activeSort && (query.dir === 'asc' ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />)}
      </button>
    </th>
  );
}

export default function ApplicationTable({ rows, query, onSort, loading }) {
  const onSortToggle = (field) =>
    onSort({ ...query, sort: field, dir: query.sort === field && query.dir === 'asc' ? 'desc' : 'asc', page: 1 });

  if (!loading && rows.length === 0) {
    return <p className="admin-empty">No applications match these filters.</p>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <SortHead label="Application ID" field="id" query={query} onSort={onSortToggle} />
            <SortHead label="Applicant" field="name" query={query} onSort={onSortToggle} />
            <th>Country</th>
            <th>Visa type</th>
            <SortHead label="Submitted" field="createdAt" query={query} onSort={onSortToggle} />
            <th>Payment</th>
            <th>Status</th>
            <th>Docs</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => {
            const documents = a.documents || [];
            const verified = documents.filter((d) => d.status === DOCUMENT_STATUS.VERIFIED).length;
            return (
              <tr key={a.id}>
                <td className="admin-table__id">{a.id}</td>
                <td>
                  {a.applicant.firstName || '—'} {a.applicant.lastName || ''}
                  <span className="admin-table__sub">{a.applicant.email || ''}</span>
                </td>
                <td>{a.countryName}</td>
                <td className="admin-table__sub">{a.visaTypeLabel}</td>
                <td>{fmtDate(a.createdAt)}</td>
                <td>
                  <span className={`pay-pill pay-pill--${(a.payment?.status || 'none').toLowerCase()}`}>
                    {a.payment?.status || '—'}
                  </span>
                </td>
                <td>
                  <StatusBadge status={a.status} />
                </td>
                <td>
                  <span className="admin-table__docs">
                    <FileCheck2 aria-hidden="true" /> {verified}/{documents.length}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/applications/${a.id}`} className="admin-table__view">
                    View <ExternalLink aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* mobile card list */}
      <ul className="admin-cards">
        {rows.map((a) => (
          <li key={a.id}>
            <Link to={`/admin/applications/${a.id}`}>
              <div className="admin-cards__top">
                <span className="admin-table__id">{a.id}</span>
                <StatusBadge status={a.status} />
              </div>
              <p className="admin-cards__name">
                {a.applicant.firstName || '—'} {a.applicant.lastName || ''}
              </p>
              <p className="admin-cards__meta">
                {a.countryName} · {a.visaTypeLabel} · {fmtDate(a.createdAt)}
              </p>
              <span className={`pay-pill pay-pill--${(a.payment?.status || 'none').toLowerCase()}`}>
                {a.payment?.status || '—'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
