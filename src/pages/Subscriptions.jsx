import { useEffect, useState } from 'react';
import { CreditCard, IndianRupee, Receipt, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../api/client';

const PLAN_TONE = {
  free:       'chip',
  starter:    'chip-accent',
  growth:     'chip-violet',
  enterprise: 'chip-gold',
};

const STATUS_TONE = {
  active:     'chip-emerald',
  'past-due': 'chip-coral',
  cancelled:  'chip',
};

export default function Subscriptions() {
  const [plans, setPlans] = useState([]);
  const [subs, setSubs]   = useState([]);
  const [txn, setTxn]     = useState([]);

  useEffect(() => {
    api.get('/plans').then((r) => setPlans(r.data.items || []));
    api.get('/subscriptions').then((r) => setSubs(r.data.items || []));
    api.get('/transactions').then((r) => setTxn(r.data.items || []));
  }, []);

  const mrr = subs.filter((s) => s.status === 'active').reduce((sum, s) => sum + (s.billingCycle === 'annual' ? s.amount / 12 : s.amount), 0);
  const active = subs.filter((s) => s.status === 'active').length;
  const pastDue = subs.filter((s) => s.status === 'past-due').length;

  return (
    <div className="space-y-5">
      <header>
        <span className="section-eyebrow"><CreditCard size={12} /> Subscriptions</span>
        <h1 className="display mt-2 text-3xl">Subscriptions & billing</h1>
        <p className="mt-1 text-sm text-ink/60">Monitor revenue, plans and recent transactions.</p>
      </header>

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi icon={IndianRupee} tone="from-cobalt to-cobalt-700" value={`₹${(mrr / 100000).toFixed(1)}L`} label="MRR" />
        <Kpi icon={TrendingUp}  tone="from-emerald-500 to-teal-600" value={active} label="Active subscriptions" />
        <Kpi icon={AlertTriangle} tone="from-coral to-amber-500" value={pastDue} label="Past-due" />
        <Kpi icon={Receipt} tone="from-violet-500 to-fuchsia-500" value={txn.length} label="Transactions (30d)" />
      </div>

      {/* Plans */}
      <section className="card p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Plans</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div key={p._id} className="rounded-2xl border border-ink/10 p-4">
              <p className="display text-lg capitalize">{p.name}</p>
              <p className="display mt-1 text-3xl">
                {p.price === 0 && p.billing === 'monthly' ? 'Free' : p.price === 0 ? 'Custom' : `₹${p.price.toLocaleString()}`}
                {p.price > 0 && <span className="text-sm font-normal text-ink/55"> /mo</span>}
              </p>
              <ul className="mt-3 space-y-1 text-xs text-ink/65">
                <li className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-600" /> {p.jobPosts === 999 ? 'Unlimited' : p.jobPosts} job posts</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-600" /> {p.credits === 9999 ? 'Unlimited' : p.credits} resume credits</li>
              </ul>
              <p className="mt-3 text-[11px] font-semibold text-cobalt-700">{p.activeSubs} active subscribers</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subscriptions table */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Active subscriptions</p>
          <span className="chip">{subs.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-cloud text-left">
              <tr className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/55">
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Renews</th>
                <th className="px-5 py-3">Invoices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {subs.map((s) => (
                <tr key={s._id} className="hover:bg-cloud/60">
                  <td className="px-5 py-3 font-semibold">{s.company.name}</td>
                  <td className="px-5 py-3"><span className={`${PLAN_TONE[s.plan]} capitalize`}>{s.plan}</span></td>
                  <td className="px-5 py-3 text-ink/70">{s.amount ? `₹${s.amount.toLocaleString()}` : '—'} <span className="text-xs text-ink/45">/ {s.billingCycle}</span></td>
                  <td className="px-5 py-3"><span className={`${STATUS_TONE[s.status]} capitalize`}>{s.status}</span></td>
                  <td className="px-5 py-3 text-xs text-ink/55">{new Date(s.renewsAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-ink/70">{s.invoicesCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Transactions */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Recent transactions</p>
          <span className="chip">{txn.length} in last 30 days</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-cloud text-left">
              <tr className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/55">
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {txn.map((t) => (
                <tr key={t._id} className="hover:bg-cloud/60">
                  <td className="px-5 py-3 font-mono text-xs">{t.invoiceNo}</td>
                  <td className="px-5 py-3 font-semibold">{t.company.name}</td>
                  <td className="px-5 py-3 text-ink/70">₹{t.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-ink/70">{t.method}</td>
                  <td className="px-5 py-3">
                    <span className={`chip capitalize ${t.status === 'paid' ? 'chip-emerald' : t.status === 'pending' ? 'chip-gold' : 'chip-coral'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-ink/55">{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Kpi({ icon: Icon, tone, value, label }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow ${tone}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="display mt-4 text-2xl">{value}</p>
      <p className="text-xs text-ink/55">{label}</p>
    </div>
  );
}
