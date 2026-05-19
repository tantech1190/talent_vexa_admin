import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Star, Eye } from 'lucide-react';
import api from '../api/client';

const STATUSES = ['applied', 'shortlisted', 'interview', 'offered', 'hired', 'rejected', 'on-hold'];
const STATUS_TONE = {
  applied:     'chip',
  shortlisted: 'chip-accent',
  interview:   'chip-gold',
  offered:     'chip-violet',
  hired:       'chip-emerald',
  rejected:    'chip-coral',
  'on-hold':   'chip',
};

export default function Applications() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/applications', { params: { status: status || undefined } })
      .then((r) => setItems(r.data.items || []))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><FileText size={12} /> Applications</span>
          <h1 className="display mt-2 text-3xl">All applications</h1>
          <p className="mt-1 text-sm text-ink/60">{loading ? 'Loading…' : `${items.length} applications`}</p>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input max-w-[180px]">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-cloud text-left">
              <tr className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/55">
                <th className="px-5 py-3">Candidate</th>
                <th className="px-5 py-3">Job</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Applied</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="8" className="px-5 py-4"><div className="h-3 w-2/5 rounded bg-ink/5" /></td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr><td colSpan="8" className="px-5 py-12 text-center text-ink/55">No applications match.</td></tr>
              )}
              {!loading && items.map((a) => (
                <tr key={a._id} className="hover:bg-cloud/60">
                  <td className="px-5 py-3">
                    <p className="font-semibold leading-tight">{a.applicant?.name}</p>
                    <p className="text-xs text-ink/55">{a.applicant?.email}</p>
                  </td>
                  <td className="px-5 py-3 text-ink/70">{a.job?.title}</td>
                  <td className="px-5 py-3 text-ink/70">{a.job?.company?.name}</td>
                  <td className="px-5 py-3">
                    <span className="chip capitalize">{a.source}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-0.5">
                      {Array.from({ length: a.rating || 0 }).map((_, i) =>
                        <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                      )}
                      {!a.rating && <span className="text-xs text-ink/40">—</span>}
                    </span>
                  </td>
                  <td className="px-5 py-3"><span className={`${STATUS_TONE[a.status] || 'chip'} capitalize`}>{a.status}</span></td>
                  <td className="px-5 py-3 text-xs text-ink/55">{new Date(a.appliedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Link to={`/users/detail/${a.applicant?._id}`} title="View candidate" className="btn-ghost text-xs"><Eye size={13} /></Link>
                      <Link to={`/jobs/${a.job?._id}`} title="View job" className="btn-ghost text-xs"><FileText size={13} /></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
