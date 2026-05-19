import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Plus, Trash2, Tag, Save, X } from 'lucide-react';
import api from '../api/client';

const CATEGORIES = ['welcome','application','interview','offer','transactional','alert','billing'];
const empty = { name: '', subject: '', body: '', category: 'welcome', shared: true };

export default function EmailTemplates() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => api.get('/templates').then((r) => setItems(r.data.items || []));
  useEffect(() => { load(); }, []);

  const start = (t) => { setEditing(t?._id || 'new'); setForm(t ? { ...t } : empty); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim() || !form.body.trim()) return toast.error('Fill all fields');
    if (editing === 'new') await api.post('/templates', form);
    else await api.put(`/templates/${editing}`, form);
    toast.success('Template saved');
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete template?')) return;
    await api.delete(`/templates/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><Mail size={12} /> Templates</span>
          <h1 className="display mt-2 text-3xl">Email templates</h1>
          <p className="mt-1 text-sm text-ink/60">System-wide templates used in transactional emails.</p>
        </div>
        <button onClick={() => start(null)} className="btn-primary"><Plus size={13} /> New template</button>
      </header>

      {editing && (
        <form onSubmit={save} className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="display text-lg">{editing === 'new' ? 'New template' : 'Edit template'}</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-ink/40 hover:text-ink"><X size={16} /></button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-end gap-2 pb-1">
              <input type="checkbox" checked={!!form.shared} onChange={(e) => setForm({ ...form, shared: e.target.checked })} />
              <span className="text-sm">Visible to all admins</span>
            </label>
            <div className="md:col-span-3">
              <label className="label">Subject</label>
              <input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Use {{name}}, {{job}}, {{company}}" />
            </div>
            <div className="md:col-span-3">
              <label className="label">Body</label>
              <textarea className="input min-h-[200px]" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            </div>
          </div>
          <button className="btn-primary mt-4"><Save size={13} /> Save template</button>
        </form>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((t) => (
          <article key={t._id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{t.name}</p>
                  <span className="chip"><Tag size={10} /> {t.category}</span>
                  {t.shared && <span className="chip-accent">Team</span>}
                </div>
                <p className="mt-2 text-sm font-medium">{t.subject}</p>
                <p className="mt-1 line-clamp-2 text-xs text-ink/55">{t.body}</p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-ink/40">Updated {new Date(t.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => start(t)} className="btn-ghost text-xs">Edit</button>
                <button onClick={() => remove(t._id)} className="btn-ghost text-xs text-coral"><Trash2 size={13} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
