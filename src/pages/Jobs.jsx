import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Briefcase, Search, Star, MapPin, Building2, Trash2, Eye, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ExportMenu from '../components/ExportMenu';
import { useLocale } from '../context/LocaleContext';

export default function Jobs() {
  const { t } = useLocale();
  const [sp] = useSearchParams();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [flaggedOnly] = useState(sp.get('flagged') === 'true');
  const [loading, setLoading] = useState(true);

  const load = () =>
    api.get('/jobs', { params: { q: q || undefined, status: status || undefined, flagged: flaggedOnly ? 'true' : undefined } })
      .then((r) => setItems(r.data.items || []))
      .finally(() => setLoading(false));

  useEffect(() => { setLoading(true); load(); /* eslint-disable-next-line */ }, [status, flaggedOnly]);

  const toggleFeatured = async (id) => {
    await api.put(`/jobs/${id}/feature`);
    load();
  };
  const unpublish = async (id) => {
    await api.put(`/jobs/${id}/unpublish`);
    toast.success('Job unpublished');
    load();
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this job permanently?')) return;
    await api.delete(`/jobs/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><Briefcase size={12} /> {t('jobs.title')}</span>
          <h1 className="display mt-2 text-3xl">{t('jobs.title')}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {loading ? t('common.loading') : t('jobs.subtitle', { n: items.length })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3">
            <Search size={13} className="text-ink/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('jobs.search.placeholder')} className="w-64 bg-transparent py-2 text-sm outline-none placeholder:text-ink/40" />
          </form>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input max-w-[160px]">
            <option value="">{t('common.all_statuses')}</option>
            <option value="active">{t('jobs.status.active')}</option>
            <option value="closed">{t('jobs.status.closed')}</option>
            <option value="draft">{t('jobs.status.draft')}</option>
          </select>
          <ExportMenu
            label={t('common.export')}
            title={`${t('jobs.title')} · ${new Date().toLocaleDateString()}`}
            filename={`jobs-${new Date().toISOString().slice(0, 10)}`}
            rows={[
              ['Title', 'Company', 'Category', 'Location', 'Work mode', 'Job type', 'Exp (yrs)', 'Salary range (₹)', 'Vacancies', 'Applications', 'Views', 'Status', 'Featured', 'Hot', 'Flagged', 'Skills', 'Posted', 'Expires'],
              ...items.map((j) => [
                j.title, j.company?.name || '', j.category?.name || '', j.location || '',
                j.workMode || '', j.jobType || '',
                `${j.experienceMin || 0}–${j.experienceMax || 0}`,
                `${j.salaryMin || 0}–${j.salaryMax || 0}`,
                j.vacancies ?? 1, j.applicationsCount ?? 0, j.views ?? 0,
                j.status, j.isFeatured ? 'Yes' : 'No', j.isHot ? 'Yes' : 'No', j.flagged ? 'Yes' : 'No',
                (j.skills || []).join('; '),
                j.postedAt ? new Date(j.postedAt).toLocaleDateString() : '',
                j.expiresAt ? new Date(j.expiresAt).toLocaleDateString() : '',
              ]),
            ]}
          />
        </div>
      </header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-cloud text-left">
              <tr className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/55">
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Applications</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Posted</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="7" className="px-5 py-4"><div className="h-3 w-2/5 rounded bg-ink/5" /></td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr><td colSpan="7" className="px-5 py-12 text-center text-ink/55">No jobs match.</td></tr>
              )}
              {!loading && items.map((j) => (
                <tr key={j._id} className="hover:bg-cloud/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold leading-tight">{j.title}</p>
                      {j.isFeatured && <Star size={13} className="fill-amber-400 text-amber-400" />}
                      {j.isHot && <span className="chip-coral text-[9px]">Hot</span>}
                      {j.flagged && <Flag size={13} className="text-coral" />}
                    </div>
                    <p className="text-xs text-ink/55">{j.category?.name} · {j.jobType}</p>
                  </td>
                  <td className="px-5 py-3 text-ink/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 size={11} className="text-ink/40" /> {j.company?.name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink/70">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={11} className="text-ink/40" /> {j.location}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink/70">{j.applicationsCount}</td>
                  <td className="px-5 py-3">
                    <span className={`chip capitalize ${j.status === 'active' ? 'chip-emerald' : j.status === 'closed' ? 'chip-coral' : 'chip-gold'}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-ink/55">{new Date(j.postedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => toggleFeatured(j._id)} title={j.isFeatured ? 'Unfeature' : 'Feature'} className="btn-ghost text-xs">
                        <Star size={13} className={j.isFeatured ? 'fill-amber-400 text-amber-400' : ''} />
                      </button>
                      <Link to={`/jobs/${j._id}`} title="Open" className="btn-ghost text-xs"><Eye size={13} /></Link>
                      <button onClick={() => unpublish(j._id)} title="Unpublish" className="btn-ghost text-xs text-coral"><Flag size={13} /></button>
                      <button onClick={() => remove(j._id)} title="Delete" className="btn-ghost text-xs text-coral"><Trash2 size={13} /></button>
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
