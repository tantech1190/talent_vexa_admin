import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Building2, Search, ShieldCheck, AlertCircle, Eye, Star } from 'lucide-react';
import api from '../api/client';
import ExportMenu from '../components/ExportMenu';
import { useLocale } from '../context/LocaleContext';

export default function Companies() {
  const { t } = useLocale();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () =>
    api.get('/companies', { params: { q } })
      .then((r) => setItems(r.data.items || []))
      .finally(() => setLoading(false));

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const verify = async (id) => {
    await api.put(`/companies/${id}/verify`);
    toast.success(t('common.user_verified'));
    load();
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><Building2 size={12} /> {t('companies.title')}</span>
          <h1 className="display mt-2 text-3xl">{t('companies.title')}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {loading ? t('common.loading') : t('companies.subtitle', { n: items.length })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3">
            <Search size={13} className="text-ink/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('companies.search.placeholder')} className="w-64 bg-transparent py-2 text-sm outline-none placeholder:text-ink/40" />
          </form>
          <ExportMenu
            label={t('common.export')}
            title={`${t('companies.title')} · ${new Date().toLocaleDateString()}`}
            filename={`companies-${new Date().toISOString().slice(0, 10)}`}
            rows={[
              ['Name', 'Industry', 'Size', 'HQ', 'Verified', 'Rating', 'Jobs', 'Hires', 'Subscription', 'Candidates viewed', 'Apps', 'Recruiters', 'Founded', 'Status', 'Flagged'],
              ...items.map((c) => [
                c.name, c.industry || '', c.size || '', c.hq || '',
                c.verified ? 'Yes' : 'No',
                c.rating?.toFixed(1) || '',
                c.jobsCount ?? 0, c.hiresCount ?? 0, c.subscription || '',
                c.candidatesViewed ?? 0, c.applicationsCount ?? 0, c.recruitersCount ?? 0,
                c.founded || '', c.status || '', c.flagged ? 'Yes' : 'No',
              ]),
            ]}
          />
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <article key={c._id} className="card p-5 hover:shadow-pop">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cobalt to-ink text-base font-bold text-white">
                {c.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="display truncate text-lg">{c.name}</p>
                  {c.verified
                    ? <span className="chip-emerald"><ShieldCheck size={11} /> Verified</span>
                    : <span className="chip-gold"><AlertCircle size={11} /> Pending</span>}
                </div>
                <p className="text-xs text-ink/55">{c.industry} · {c.size} · {c.hq}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Mini label="Jobs"      value={c.jobsCount} />
              <Mini label="Hires"     value={c.hiresCount} />
              <Mini label="Plan"      value={c.subscription} />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-amber-700">
                <Star size={11} className="fill-amber-400 text-amber-400" /> {c.rating?.toFixed(1)}
              </span>
              {c.flagged && <span className="chip-coral">Flagged</span>}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {!c.verified && (
                <button onClick={() => verify(c._id)} className="btn-success text-xs"><ShieldCheck size={13} /> Verify</button>
              )}
              <Link to={`/companies/${c._id}`} className="btn-outline text-xs"><Eye size={13} /> View</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl bg-cloud/60 p-2">
      <p className="text-sm font-bold capitalize">{value || '—'}</p>
      <p className="text-[10px] uppercase tracking-wider text-ink/50">{label}</p>
    </div>
  );
}
