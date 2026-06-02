import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLocale();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: 'admin@talentvexa.com', password: 'demo1234' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success(t('login.welcome_back'));
      nav('/');
    } catch (err) {
      toast.error(err.response?.data?.message || t('login.failed'));
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
            {t('brand.console')}
          </span>
        </div>

        <div className="my-auto w-full max-w-md">
          <span className="section-eyebrow"><ShieldCheck size={12} /> {t('login.restricted')}</span>
          <h1 className="display mt-4 text-4xl">{t('login.title')}</h1>
          <p className="mt-2 text-ink/60">{t('login.subtitle')}</p>

          <form onSubmit={submit} className="mt-8 space-y-3">
            <div>
              <label className="label">{t('login.email')}</label>
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
              <label className="label">{t('login.password')}</label>
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
              <LogIn size={14} /> {loading ? t('login.cta_loading') : t('login.cta')}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-ink/10 bg-cloud/60 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/55">
              Demo accounts (any password)
            </p>
            <div className="mt-2 grid gap-1.5 text-xs">
              {[
                { role: 'super-admin', email: 'admin@talentvexa.com' },
                { role: 'admin',       email: 'priya@talentvexa.com' },
                { role: 'moderator',   email: 'niraj@talentvexa.com' },
                { role: 'support',     email: 'sneha@talentvexa.com' },
              ].map((d) => (
                <button
                  type="button"
                  key={d.email}
                  onClick={() => setForm({ email: d.email, password: 'demo1234' })}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-white"
                >
                  <span className="font-mono text-ink/75">{d.email}</span>
                  <span className="chip-gold capitalize">{d.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-ink/45">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </div>

      {/* Right: branded panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-ink via-cobalt-700 to-cobalt p-12 text-white lg:block">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-cobalt-300/30 blur-3xl" />

        <div className="relative flex h-full flex-col">
          <span className="section-eyebrow border-white/20 bg-white/10 text-white">
            <Sparkles size={12} className="text-gold" /> {t('login.panel.eyebrow')}
          </span>

          <h2 className="display mt-6 text-4xl leading-tight">
            {t('login.panel.title_1')}<br />
            <span className="text-gold">{t('login.panel.title_2')}</span>
          </h2>
          <p className="mt-4 max-w-md text-white/75">
            {t('login.panel.body')}
          </p>

          <div className="mt-auto grid grid-cols-2 gap-3">
            {[
              { label: t('login.panel.kpi.kyc'),     value: '124' },
              { label: t('login.panel.kpi.reports'), value: '38' },
              { label: t('login.panel.kpi.subs'),    value: '448' },
              { label: t('login.panel.kpi.mrr'),     value: '₹12.4L' },
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
