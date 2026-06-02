import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Briefcase, Building2, FileText, IndianRupee, FileCheck, ShieldAlert,
  TrendingUp, ArrowUpRight, Sparkles,
} from 'lucide-react';
import api from '../api/client';
import { useLocale } from '../context/LocaleContext';

export default function Dashboard() {
  const { t } = useLocale();
  const [d, setD] = useState(null);
  useEffect(() => {
    api.get('/dashboard').then((r) => setD(r.data.overview));
  }, []);

  if (!d) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card animate-pulse p-5"><div className="h-4 w-1/3 rounded bg-ink/5" /></div>
        ))}
      </div>
    );
  }

  const k = d.kpis;
  const KPIS = [
    { label: t('dash.kpi.candidates'),   value: k.totalCandidates,   icon: Users,      tone: 'from-cobalt to-cobalt-700',     to: '/users/candidates' },
    { label: t('dash.kpi.employers'),    value: k.totalEmployers,    icon: Users,      tone: 'from-violet-500 to-fuchsia-500', to: '/users/employers' },
    { label: t('dash.kpi.companies'),    value: k.totalCompanies,    icon: Building2,  tone: 'from-emerald-500 to-teal-600',   to: '/companies' },
    { label: t('dash.kpi.jobs'),         value: k.activeJobs,        icon: Briefcase,  tone: 'from-coral to-amber-500',        to: '/jobs' },
    { label: t('dash.kpi.applications'), value: k.totalApplications, icon: FileText,   tone: 'from-sky-500 to-blue-600',       to: '/applications' },
    { label: t('dash.kpi.hires'),        value: k.hires,             icon: TrendingUp, tone: 'from-rose-500 to-red-500',       to: '/applications?status=hired' },
    { label: t('dash.kpi.mrr'),          value: `₹${(k.mrr / 100000).toFixed(1)}L`, icon: IndianRupee, tone: 'from-yellow-500 to-orange-500', to: '/subscriptions' },
    { label: t('dash.kpi.kyc'),          value: k.pendingKyc,        icon: FileCheck,  tone: 'from-cyan-500 to-cobalt-600',    to: '/kyc' },
  ];

  const points = d.signupsByDay.slice(-14);
  const maxC = Math.max(...points.map((p) => p.candidates));
  const sparkline = points.map((p, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = 100 - (p.candidates / maxC) * 90 - 5;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><Sparkles size={12} /> {t('dash.eyebrow')}</span>
          <h1 className="display mt-2 text-3xl">{t('dash.title')}</h1>
          <p className="mt-1 text-sm text-ink/60">{t('dash.subtitle')}</p>
        </div>
        <Link to="/reports" className="btn-outline">{t('dash.detailed')} <ArrowUpRight size={13} /></Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <Link key={k.label} to={k.to} className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-pop">
            <div className="flex items-start justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow ${k.tone}`}>
                <k.icon size={18} />
              </span>
              <ArrowUpRight size={14} className="text-ink/25 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cobalt" />
            </div>
            <p className="display mt-4 text-2xl">{k.value.toLocaleString?.() ?? k.value}</p>
            <p className="text-xs text-ink/55">{k.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">{t('dash.signups.eyebrow')}</p>
              <p className="display mt-2 text-2xl">
                {t('dash.signups.new_users', { n: points.reduce((s, p) => s + p.candidates + p.employers, 0).toLocaleString() })}
              </p>
            </div>
            <span className="chip-accent">{t('dash.signups.wow')}</span>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-3 h-32 w-full">
            <defs>
              <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2C7DA0" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2C7DA0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={`0,100 ${sparkline} 100,100`} fill="url(#spark)" />
            <polyline points={sparkline} fill="none" stroke="#2C7DA0" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="card p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">{t('dash.pending_tasks')}</p>
          <div className="mt-4 space-y-3">
            <OperatorRow icon={FileCheck} tone="bg-cobalt/10 text-cobalt-700" label={t('dash.op.kyc')} value={k.pendingKyc} to="/kyc" />
            <OperatorRow icon={ShieldAlert} tone="bg-coral/15 text-coral" label={t('dash.op.reports')} value={k.openReports} to="/reports-queue" />
            <OperatorRow icon={FileText} tone="bg-violet-100 text-violet-700" label={t('dash.op.flagged_jobs')} value={4} to="/jobs?flagged=true" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">{t('dash.funnel.eyebrow')}</p>
          <div className="mt-4 space-y-2.5">
            {[
              { label: t('dash.funnel.visits'),      value: d.funnel.visits,      tone: 'bg-cobalt' },
              { label: t('dash.funnel.signups'),     value: d.funnel.signups,     tone: 'bg-violet-500' },
              { label: t('dash.funnel.profile'),     value: d.funnel.profileDone, tone: 'bg-coral' },
              { label: t('dash.funnel.applied'),     value: d.funnel.applied,     tone: 'bg-emerald-500' },
              { label: t('dash.funnel.interviewed'), value: d.funnel.interviewed, tone: 'bg-sky-500' },
              { label: t('dash.funnel.hired'),       value: d.funnel.hired,       tone: 'bg-gold' },
            ].map((row, i, arr) => {
              const max = arr[0].value;
              const pct = (row.value / max) * 100;
              return (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink/70">{row.label}</span>
                    <span className="text-ink/55">{row.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink/5">
                    <div className={`${row.tone} h-full rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">{t('dash.top_employers')}</p>
          <div className="mt-4 divide-y divide-ink/5">
            {d.topEmployers.map((c, i) => (
              <div key={c.company} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cobalt to-ink text-xs font-bold text-white">
                    {c.company[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{c.company}</p>
                    <p className="text-xs text-ink/55">{t('dash.applications_hires', { a: c.applications, h: c.hires })}</p>
                  </div>
                </div>
                <span className="chip-emerald">#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OperatorRow({ icon: Icon, tone, label, value, to }) {
  return (
    <Link to={to} className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 px-3 py-2.5 hover:border-cobalt/40 hover:bg-cobalt/[0.04]">
      <span className="flex items-center gap-2.5">
        <span className={`grid h-8 w-8 place-items-center rounded-xl ${tone}`}>
          <Icon size={14} />
        </span>
        <span className="text-sm">{label}</span>
      </span>
      <span className="rounded-full bg-cobalt px-2 py-0.5 text-xs font-bold text-white">{value}</span>
    </Link>
  );
}
