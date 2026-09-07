import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader.jsx';
import ApplicationFilters from '../components/admin/ApplicationFilters.jsx';
import ApplicationTable from '../components/admin/ApplicationTable.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';

const DEFAULT_QUERY = { search: '', page: 1, pageSize: 10, sort: 'createdAt', dir: 'desc' };

export default function AdminApplications() {
  const { email } = useOutletContext();
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [result, setResult] = useState({ items: [], total: 0, page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(true);

  const load = useCallback((q) => {
    setLoading(true);
    api
      .adminListApplications(q)
      .then(setResult)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(query), query.search ? 250 : 0); // debounce search
    return () => clearTimeout(t);
  }, [query, load]);

  const totalPages = Math.max(1, Math.ceil(result.total / query.pageSize));

  return (
    <>
      <AdminHeader title="Applications" email={email} />

      <ApplicationFilters query={query} onChange={setQuery} />

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>
            {result.total} application{result.total === 1 ? '' : 's'}
          </h2>
          {loading && (
            <span className="admin-panel__loading">
              <LoadingDots /> loading
            </span>
          )}
        </div>

        <ApplicationTable rows={result.items} query={query} onSort={setQuery} loading={loading} />

        {totalPages > 1 && (
          <div className="admin-pager">
            <button
              type="button"
              disabled={query.page <= 1}
              onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
            >
              <ChevronLeft aria-hidden="true" /> Prev
            </button>
            <span>
              Page {query.page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={query.page >= totalPages}
              onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
            >
              Next <ChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
