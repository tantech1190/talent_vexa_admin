import { useEffect, useMemo, useState } from 'react';
import { Activity, ChevronRight, Search, Filter } from 'lucide-react';
import api from '../api/client';
import ExportMenu from '../components/ExportMenu';
import { useLocale } from '../context/LocaleContext';

const ACTION_TONE = {
  'kyc.approve':     'chip-emerald',
  'user.suspend':    'chip-coral',
  'job.unpublish':   'chip-coral',
  'plan.refund':     'chip-gold',
  'broadcast.send':  'chip-violet',
  'report.resolve':  'chip-accent',
  'company.verify':  'chip-emerald',
  'template.create': 'chip',
};

export default function ActivityLog() {
  const { t } = useLocale();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [actor, setActor] = useState('');
  const [action, setAction] = useState('');
  const [days, setDays] = useState('');

  useEffect(() => { api.get('/activity').then((r) => setItems(r.data.items || [])); }, []);

  const actors = useMemo(() => Array.from(new Set(items.map((i) => i.actor).filter(Boolean))).sort(), [items]);
  const actions = useMemo(() => Array.from(new Set(items.map((i) => i.action).filter(Boolean))).sort(), [items]);

  const filtered = useMemo(() => {
    const cutoff = days ? Date.now() - Number(days) * 86400000 : null;
    const term = q.trim().toLowerCase();
    return items.filter((a) => (
      (!actor || a.actor === actor) &&
      (!action || a.action === action) &&
      (!cutoff || new Date(a.createdAt).getTime() >= cutoff) &&
      (!term || (
        (a.actor || '').toLowerCase().includes(term) ||
        (a.action || '').toLowerCase().includes(term) ||
        (a.target || '').toLowerCase().includes(term) ||
        (a.note || '').toLowerCase().includes(term)
      ))
    ));
  }, [items, q, actor, action, days]);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><Activity size={12} /> {t('activity.title')}</span>
          <h1 className="display mt-2 text-3xl">{t('activity.title')}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {t('activity.subtitle', { n: `${filtered.length} / ${items.length}` })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3">
            <Search size={13} className="text-ink/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('activity.search.placeholder')} className="w-56 bg-transparent py-2 text-sm outline-none" />
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white px-2 py-1 text-xs">
            <Filter size={12} />
            <select value={actor} onChange={(e) => setActor(e.target.value)} className="bg-transparent text-xs font-semibold outline-none">
              <option value="">All actors</option>
              {actors.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <select value={action} onChange={(e) => setAction(e.target.value)} className="input max-w-[180px]">
            <option value="">All actions</option>
            {actions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={days} onChange={(e) => setDays(e.target.value)} className="input max-w-[140px]">
            <option value="">Any time</option>
            <option value="1">Last 24h</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <ExportMenu
            label="Export"
            title={`Activity log · ${new Date().toLocaleDateString()}`}
            filename={`activity-log-${new Date().toISOString().slice(0, 10)}`}
            rows={[
              ['When', 'Actor', 'Action', 'Target', 'Note'],
              ...filtered.map((a) => [
                a.createdAt ? new Date(a.createdAt).toLocaleString() : '',
                a.actor || '', a.action || '', a.target || '', a.note || '',
              ]),
            ]}
          />
        </div>
      </header>

      <div className="card divide-y divide-ink/5">
        {filtered.length === 0 && (
          <div className="p-10 text-center text-ink/55">No activity matches the filters.</div>
        )}
        {filtered.map((a) => (
          <div key={a._id} className="flex items-start gap-3 p-4">
            <span className="mt-1.5 grid h-2 w-2 place-items-center">
              <span className="h-2 w-2 rounded-full bg-cobalt" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{a.actor}</span>
                <ChevronRight size={12} className="text-ink/30" />
                <span className={`${ACTION_TONE[a.action] || 'chip'} font-mono text-[10px] normal-case`}>{a.action}</span>
                <ChevronRight size={12} className="text-ink/30" />
                <span className="text-sm text-ink/70">{a.target}</span>
              </div>
              {a.note && <p className="mt-1 text-xs text-ink/55">{a.note}</p>}
            </div>
            <p className="shrink-0 text-xs text-ink/45">{new Date(a.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
