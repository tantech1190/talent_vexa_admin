import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldAlert, Briefcase, User, MessageSquare, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../api/client';

const KIND_META = {
  job:     { icon: Briefcase,    tone: 'bg-coral/15 text-coral'     },
  user:    { icon: User,         tone: 'bg-violet-100 text-violet-700' },
  message: { icon: MessageSquare,tone: 'bg-cobalt/10 text-cobalt-700' },
};

const SEVERITY_TONE = {
  high:   'chip-coral',
  medium: 'chip-gold',
  low:    'chip',
};

const STATUS_TONE = {
  open:           'chip-coral',
  'under-review': 'chip-gold',
  resolved:       'chip-emerald',
  dismissed:      'chip',
};

export default function ReportsQueue() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('open');

  const load = () => api.get('/reports/queue').then((r) => setItems(r.data.items || []));
  useEffect(() => { load(); }, []);

  const visible = items.filter((r) => !filter || r.status === filter);

  const resolve = async (id) => {
    await api.put(`/reports/${id}/resolve`);
    toast.success('Resolved');
    load();
  };
  const dismiss = async (id) => {
    await api.put(`/reports/${id}/dismiss`);
    toast.success('Dismissed');
    load();
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><ShieldAlert size={12} /> Trust & Safety</span>
          <h1 className="display mt-2 text-3xl">Reports queue</h1>
          <p className="mt-1 text-sm text-ink/60">User-submitted reports + automated detections. Investigate and act.</p>
        </div>
        <div className="inline-flex gap-1 rounded-full border border-ink/10 bg-white p-1 text-sm">
          {['', 'open', 'under-review', 'resolved', 'dismissed'].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 capitalize ${filter === s ? 'bg-cobalt text-white' : 'text-ink/65 hover:text-ink'}`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-3">
        {visible.length === 0 && (
          <div className="card p-12 text-center">
            <CheckCircle2 className="mx-auto text-emerald-600" size={28} />
            <p className="display mt-3 text-xl">No reports {filter && `· ${filter}`}</p>
            <p className="mt-1 text-sm text-ink/55">Inbox zero — well done.</p>
          </div>
        )}
        {visible.map((r) => {
          const meta = KIND_META[r.kind];
          return (
            <article key={r._id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl ${meta.tone}`}>
                    <meta.icon size={16} />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{r.subject}</p>
                      <span className={`${SEVERITY_TONE[r.severity]} capitalize`}>
                        <AlertTriangle size={11} className="mr-0.5" /> {r.severity}
                      </span>
                      <span className={`${STATUS_TONE[r.status]} capitalize`}>{r.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink/70">{r.reason}</p>
                    <p className="mt-1 text-xs text-ink/45">Reported by {r.reporter} · {new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {(r.status === 'open' || r.status === 'under-review') && (
                  <div className="flex gap-2">
                    <button onClick={() => resolve(r._id)} className="btn-success text-xs"><CheckCircle2 size={13} /> Resolve</button>
                    <button onClick={() => dismiss(r._id)} className="btn-outline text-xs"><X size={13} /> Dismiss</button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
