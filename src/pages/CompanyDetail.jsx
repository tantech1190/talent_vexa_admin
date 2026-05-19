import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Building2, MapPin, Star, ShieldCheck, AlertCircle, Mail, Phone,
  Briefcase, Users, TrendingUp, FileCheck, CreditCard, Calendar,
} from 'lucide-react';
import api from '../api/client';

export default function CompanyDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const load = () => api.get(`/companies/${id}`).then((r) => setData(r.data));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  if (!data) return <div className="card p-10 text-center text-ink/55">Loading…</div>;
  const c = data.company;

  const verify = async () => {
    await api.put(`/companies/${id}/verify`);
    toast.success('Company verified');
    load();
  };

  return (
    <div className="space-y-5">
      <Link to="/companies" className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-cobalt">
        <ArrowLeft size={13} /> All companies
      </Link>

      {/* Hero */}
      <header className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cobalt to-ink text-2xl font-bold text-white">
              {c.name[0]}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="display text-3xl">{c.name}</h1>
                {c.verified
                  ? <span className="chip-emerald"><ShieldCheck size={11} /> Verified</span>
                  : <span className="chip-gold"><AlertCircle size={11} /> Pending</span>}
                {c.flagged && <span className="chip-coral">Flagged</span>}
              </div>
              <p className="mt-1 text-ink/65">{c.industry} · {c.size} employees · Founded {c.founded}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/55">
                <span className="flex items-center gap-1"><MapPin size={11} /> {c.hq}</span>
                <span className="flex items-center gap-1"><Star size={11} className="fill-amber-400 text-amber-400" /> {c.rating?.toFixed(1)}</span>
                <span className="flex items-center gap-1"><Mail size={11} /> {c.contactEmail}</span>
                <span className="flex items-center gap-1"><Phone size={11} /> {c.contactPhone}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!c.verified && <button onClick={verify} className="btn-success"><ShieldCheck size={13} /> Verify</button>}
            <Link to="/kyc" className="btn-outline"><FileCheck size={13} /> KYC queue</Link>
          </div>
        </div>
      </header>

      {/* KPI tiles */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Briefcase}  tone="from-cobalt to-cobalt-700"        value={c.jobsCount}        label="Active jobs" />
        <Kpi icon={Users}      tone="from-violet-500 to-fuchsia-500"   value={c.applicationsCount}label="Applications" />
        <Kpi icon={TrendingUp} tone="from-emerald-500 to-teal-600"     value={c.hiresCount}       label="Hires" />
        <Kpi icon={CreditCard} tone="from-coral to-amber-500"          value={c.subscription}     label="Subscription" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Jobs list */}
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Open jobs at this company</p>
            <span className="chip">{data.jobs.length}</span>
          </div>
          <div className="divide-y divide-ink/5">
            {data.jobs.length === 0 && <p className="p-6 text-sm text-ink/55">No jobs posted yet.</p>}
            {data.jobs.map((j) => (
              <Link
                key={j._id}
                to={`/jobs/${j._id}`}
                className="flex items-center justify-between gap-3 p-4 hover:bg-cloud/60"
              >
                <div>
                  <p className="font-semibold">{j.title}</p>
                  <p className="text-xs text-ink/55">{j.category?.name} · {j.location} · {j.workMode}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-semibold">{j.applicationsCount} apps</p>
                  <p className="text-ink/55">{j.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sidebar facts */}
        <section className="space-y-4">
          <div className="card p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Account</p>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Recruiters" value={c.recruitersCount} />
              <Row label="Candidates viewed" value={c.candidatesViewed} />
              <Row label="Joined" value={new Date(c.createdAt).toLocaleDateString()} />
              <Row label="Status" value={c.status} cap />
            </dl>
          </div>
          <div className="card p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Quick actions</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/subscriptions" className="btn-outline text-sm"><CreditCard size={13} /> View subscription</Link>
              <Link to="/activity" className="btn-outline text-sm"><Calendar size={13} /> Recent activity</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, tone, value, label }) {
  return (
    <div className="card p-5">
      <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow ${tone}`}>
        <Icon size={18} />
      </span>
      <p className="display mt-4 text-2xl capitalize">{value || '—'}</p>
      <p className="text-xs text-ink/55">{label}</p>
    </div>
  );
}

function Row({ label, value, cap }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink/55">{label}</dt>
      <dd className={`font-semibold ${cap ? 'capitalize' : ''}`}>{value ?? '—'}</dd>
    </div>
  );
}
