import { useEffect, useState } from 'react';
import { Activity, ChevronRight } from 'lucide-react';
import api from '../api/client';

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
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/activity').then((r) => setItems(r.data.items || [])); }, []);

  return (
    <div className="space-y-5">
      <header>
        <span className="section-eyebrow"><Activity size={12} /> Audit</span>
        <h1 className="display mt-2 text-3xl">Activity log</h1>
        <p className="mt-1 text-sm text-ink/60">Every admin action across the platform, immutable.</p>
      </header>

      <div className="card divide-y divide-ink/5">
        {items.map((a) => (
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
