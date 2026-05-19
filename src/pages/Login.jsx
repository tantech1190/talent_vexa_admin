import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: 'admin@talentvexa.com', password: 'demo1234' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back');
      nav('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col bg-white p-8 sm:p-12">
        <div className="flex items-center gap-3">
          <img src="/talentvexa.png" alt="TalentVexa" className="h-20 w-auto" />
          <span className="rounded-full bg-cobalt/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cobalt-700">
            Admin Console
          </span>
        </div>

        <div className="my-auto w-full max-w-md">
          <span className="section-eyebrow"><ShieldCheck size={12} /> Restricted area</span>
          <h1 className="display mt-4 text-4xl">Sign in to manage TalentVexa</h1>
          <p className="mt-2 text-ink/60">Review KYC submissions, moderate content, monitor billing — all from one place.</p>

          <form onSubmit={submit} className="mt-8 space-y-3">
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="username"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
              />
            </div>
            <button className="btn-primary w-full" disabled={loading}>
              <LogIn size={14} /> {loading ? 'Signing in…' : 'Sign in to console'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink/55">
            Demo build — any email/password works. Demo user:{' '}
            <span className="font-semibold text-ink">admin@talentvexa.com</span>
          </p>
        </div>

        <p className="mt-8 text-xs text-ink/45">© {new Date().getFullYear()} TalentVexa · Smart Hiring Starts Here</p>
      </div>

      {/* Right: branded panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-ink via-cobalt-700 to-cobalt p-12 text-white lg:block">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-cobalt-300/30 blur-3xl" />

        <div className="relative flex h-full flex-col">
          <span className="section-eyebrow border-white/20 bg-white/10 text-white">
            <Sparkles size={12} className="text-gold" /> Built for operators
          </span>

          <h2 className="display mt-6 text-4xl leading-tight">
            Real-time control<br />
            <span className="text-gold">over every signal.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/75">
            Approve KYC. Moderate flagged content. Tune feature flags. The TalentVexa
            admin console keeps the marketplace honest at scale.
          </p>

          <div className="mt-auto grid grid-cols-2 gap-3">
            {[
              { label: 'KYC reviewed last 7d',  value: '124' },
              { label: 'Reports resolved',      value: '38' },
              { label: 'Active subscriptions',  value: '448' },
              { label: 'MRR',                   value: '₹12.4L' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur">
                <p className="display text-2xl font-bold">{s.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/65">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
