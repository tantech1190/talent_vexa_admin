import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, Save, ToggleLeft, Sliders } from 'lucide-react';
import api from '../api/client';

export default function Settings() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/settings').then((r) => setS(r.data.settings)); }, []);

  if (!s) return <div className="card p-10 text-center text-ink/55">Loading…</div>;

  const flag = (k, v) => setS({ ...s, features: { ...s.features, [k]: v } });
  const limit = (k, v) => setS({ ...s, limits: { ...s.limits, [k]: Number(v) } });
  const brand = (k, v) => setS({ ...s, branding: { ...s.branding, [k]: v } });

  const save = async () => {
    await api.put('/settings', s);
    toast.success('Settings saved');
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><SettingsIcon size={12} /> System</span>
          <h1 className="display mt-2 text-3xl">Site settings</h1>
          <p className="mt-1 text-sm text-ink/60">Feature flags, rate-limits and brand identity.</p>
        </div>
        <button onClick={save} className="btn-primary"><Save size={13} /> Save changes</button>
      </header>

      <section className="card p-6">
        <div className="flex items-center gap-2">
          <ToggleLeft size={16} className="text-cobalt" />
          <h2 className="display text-xl">Feature flags</h2>
        </div>
        <div className="mt-4 divide-y divide-ink/5">
          {Object.entries(s.features).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-semibold capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-xs text-ink/55">Toggle this feature platform-wide.</p>
              </div>
              <Toggle checked={v} onChange={(nv) => flag(k, nv)} />
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-cobalt" />
          <h2 className="display text-xl">Limits</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {Object.entries(s.limits).map(([k, v]) => (
            <div key={k}>
              <label className="label">{k.replace(/([A-Z])/g, ' $1').trim()}</label>
              <input className="input" type="number" min="0" value={v} onChange={(e) => limit(k, e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="display text-xl">Brand</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.entries(s.branding).map(([k, v]) => (
            <div key={k}>
              <label className="label">{k}</label>
              <input className="input" value={v} onChange={(e) => brand(k, e.target.value)} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? 'bg-cobalt' : 'bg-ink/15'}`}
      aria-checked={checked}
      role="switch"
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}
