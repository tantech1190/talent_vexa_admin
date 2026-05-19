import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Tag, Plus, Trash2, Briefcase } from 'lucide-react';
import api from '../api/client';

const COLORS = ['#2C7DA0', '#E8A33D', '#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#0EA5E9', '#F43F5E', '#8B5CF6', '#06B6D4'];

export default function Categories() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/categories').then((r) => setItems(r.data.items || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Category name is required');
    await api.post('/categories', { name: name.trim(), color, slug: name.trim().toLowerCase().replace(/\s+/g, '-') });
    setName('');
    toast.success('Category added');
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete category?')) return;
    await api.delete(`/categories/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div className="space-y-5">
      <header>
        <span className="section-eyebrow"><Tag size={12} /> Categories</span>
        <h1 className="display mt-2 text-3xl">Job categories</h1>
        <p className="mt-1 text-sm text-ink/60">Top-level categories candidates browse and recruiters tag jobs with.</p>
      </header>

      <form onSubmit={add} className="card flex flex-wrap items-center gap-2 p-3">
        <input className="input flex-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" />
        <div className="flex gap-1">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              style={{ background: c }}
              className={`h-9 w-9 rounded-full border-2 ${color === c ? 'border-ink' : 'border-white'}`}
            />
          ))}
        </div>
        <button className="btn-primary"><Plus size={13} /> Add</button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card animate-pulse p-5"><div className="h-3 w-1/3 rounded bg-ink/5" /></div>
        ))}
        {!loading && items.map((c) => (
          <article key={c._id} className="card flex items-center gap-3 p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-sm" style={{ background: c.color }}>
              <Tag size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{c.name}</p>
              <p className="text-xs text-ink/55">
                <Briefcase size={10} className="-mt-0.5 mr-0.5 inline" /> {c.jobsCount} jobs
              </p>
            </div>
            <button onClick={() => remove(c._id)} className="btn-ghost text-coral"><Trash2 size={13} /></button>
          </article>
        ))}
      </div>
    </div>
  );
}
