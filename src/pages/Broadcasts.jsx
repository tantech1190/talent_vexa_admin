import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Megaphone, Send, Users, Building2, Sparkles } from 'lucide-react';
import api from '../api/client';

const AUDIENCES = [
  { v: 'all',        l: 'All users',      icon: Sparkles,  tone: 'from-cobalt to-cobalt-700' },
  { v: 'candidates', l: 'Candidates',     icon: Users,     tone: 'from-emerald-500 to-teal-600' },
  { v: 'employers',  l: 'Employers',      icon: Building2, tone: 'from-coral to-amber-500' },
];

export default function Broadcasts() {
  const [items, setItems] = useState([]);
  const [audience, setAudience] = useState('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const load = () => api.get('/broadcasts').then((r) => setItems(r.data.items || []));
  useEffect(() => { load(); }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return toast.error('Subject and body are required');
    setSending(true);
    try {
      await api.post('/broadcasts', { audience, subject, body });
      toast.success(`Broadcast sent to ${audience}`);
      setSubject(''); setBody('');
      load();
    } finally { setSending(false); }
  };

  return (
    <div className="space-y-5">
      <header>
        <span className="section-eyebrow"><Megaphone size={12} /> Broadcasts</span>
        <h1 className="display mt-2 text-3xl">Broadcast announcement</h1>
        <p className="mt-1 text-sm text-ink/60">Send platform-wide announcements to all users or specific roles.</p>
      </header>

      <form onSubmit={send} className="card p-5">
        <p className="label">Audience</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {AUDIENCES.map((a) => (
            <button
              type="button"
              key={a.v}
              onClick={() => setAudience(a.v)}
              className={`rounded-2xl border p-4 text-left transition ${audience === a.v ? 'border-cobalt bg-cobalt/[0.06]' : 'border-ink/10 bg-white hover:border-cobalt/40'}`}
            >
              <span className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br text-white ${a.tone}`}>
                <a.icon size={16} />
              </span>
              <p className="mt-3 text-sm font-semibold">{a.l}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3">
          <div>
            <label className="label">Subject</label>
            <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Scheduled maintenance — Sunday 02:00–03:00 IST" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input min-h-[160px]" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Hi all,&#10;&#10;We'll be performing scheduled maintenance…" />
          </div>
        </div>

        <button className="btn-primary mt-4" disabled={sending}>
          <Send size={13} /> {sending ? 'Sending…' : 'Send broadcast'}
        </button>
      </form>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Recent broadcasts</p>
          <span className="chip">{items.length}</span>
        </div>
        <div className="divide-y divide-ink/5">
          {items.map((b) => (
            <div key={b._id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="chip capitalize">{b.audience}</span>
                    <span className="text-xs text-ink/45">{new Date(b.sentAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-1.5 font-semibold">{b.subject}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-semibold">Sent to {b.sentTo.toLocaleString()}</p>
                  <p className="text-ink/55">Open rate {Math.round((b.openedRate || 0) * 100)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
