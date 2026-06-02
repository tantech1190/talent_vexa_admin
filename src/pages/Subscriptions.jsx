import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { CreditCard, IndianRupee, Receipt, TrendingUp, AlertTriangle, CheckCircle2, PlusCircle, Filter, X, Download } from 'lucide-react';
import api from '../api/client';
import ExportMenu from '../components/ExportMenu';
import { downloadInvoice } from '../utils/exporter';
import { useLocale } from '../context/LocaleContext';

const BILLING_CYCLES = [
  { v: 'monthly',   l: 'Monthly',   months: 1  },
  { v: 'quarterly', l: 'Quarterly', months: 3  },
  { v: 'annual',    l: 'Annual',    months: 12 },
];

const todayISO = () => new Date().toISOString().slice(0, 10);
const addMonthsISO = (iso, months) => {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
};

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
  const { t } = useLocale();
  const [plans, setPlans] = useState([]);
  const [subs, setSubs]   = useState([]);
  const [txn, setTxn]     = useState([]);
  const [companies, setCompanies] = useState([]);

  const [form, setForm] = useState({
    companyId:    '',
    planId:       '',
    qty:          1,
    discountPct:  0,
    taxPct:       18,
    billingCycle: 'monthly',
    validFrom:    todayISO(),
    validTo:      addMonthsISO(todayISO(), 1),
  });
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ customer: '', plan: '', status: '', cycle: '' });
  const [txnFilters, setTxnFilters] = useState({ customer: '', status: '', method: '' });

  const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const clearFilters = () => setFilters({ customer: '', plan: '', status: '', cycle: '' });
  const setTxnFilter = (k, v) => setTxnFilters((f) => ({ ...f, [k]: v }));
  const clearTxnFilters = () => setTxnFilters({ customer: '', status: '', method: '' });

  const customerOptions = useMemo(
    () => Array.from(new Set(subs.map((s) => s.company?.name).filter(Boolean))).sort(),
    [subs],
  );
  const planOptions = useMemo(
    () => Array.from(new Set(subs.map((s) => s.plan).filter(Boolean))),
    [subs],
  );
  const statusOptions = useMemo(
    () => Array.from(new Set(subs.map((s) => s.status).filter(Boolean))),
    [subs],
  );
  const cycleOptions = useMemo(
    () => Array.from(new Set(subs.map((s) => s.billingCycle).filter(Boolean))),
    [subs],
  );

  const visibleSubs = useMemo(() => subs.filter((s) => (
    (!filters.customer || s.company?.name === filters.customer) &&
    (!filters.plan   || s.plan === filters.plan) &&
    (!filters.status || s.status === filters.status) &&
    (!filters.cycle  || s.billingCycle === filters.cycle)
  )), [subs, filters]);

  const filtersActive = filters.customer || filters.plan || filters.status || filters.cycle;

  const txnStatusOptions = useMemo(
    () => Array.from(new Set(txn.map((x) => x.status).filter(Boolean))),
    [txn],
  );
  const txnMethodOptions = useMemo(
    () => Array.from(new Set(txn.map((x) => x.method).filter(Boolean))),
    [txn],
  );
  const txnCustomerOptions = useMemo(
    () => Array.from(new Set(txn.map((x) => x.company?.name).filter(Boolean))).sort(),
    [txn],
  );
  const visibleTxn = useMemo(() => txn.filter((x) => (
    (!txnFilters.customer || x.company?.name === txnFilters.customer) &&
    (!txnFilters.status || x.status === txnFilters.status) &&
    (!txnFilters.method || x.method === txnFilters.method)
  )), [txn, txnFilters]);
  const txnFiltersActive = txnFilters.customer || txnFilters.status || txnFilters.method;

  const loadSubs = () => api.get('/subscriptions').then((r) => setSubs(r.data.items || []));

  useEffect(() => {
    api.get('/plans').then((r) => setPlans(r.data.items || []));
    api.get('/transactions').then((r) => setTxn(r.data.items || []));
    api.get('/companies').then((r) => setCompanies(r.data.items || []));
    loadSubs();
  }, []);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onCycleChange = (cycle) => {
    setForm((f) => {
      const months = BILLING_CYCLES.find((c) => c.v === cycle)?.months ?? 1;
      return { ...f, billingCycle: cycle, validTo: addMonthsISO(f.validFrom || todayISO(), months) };
    });
  };

  const onValidFromChange = (validFrom) => {
    setForm((f) => {
      const months = BILLING_CYCLES.find((c) => c.v === f.billingCycle)?.months ?? 1;
      return { ...f, validFrom, validTo: addMonthsISO(validFrom, months) };
    });
  };

  const selectedPlan = useMemo(() => plans.find((p) => p._id === form.planId), [plans, form.planId]);
  const preview = useMemo(() => {
    if (!selectedPlan) return null;
    const months = BILLING_CYCLES.find((c) => c.v === form.billingCycle)?.months ?? 1;
    const qty = Math.max(1, Number(form.qty) || 1);
    const discount = Math.max(0, Math.min(100, Number(form.discountPct) || 0));
    const taxPct = Math.max(0, Number(form.taxPct) || 0);
    const gross = (selectedPlan.price || 0) * qty * months;
    const net = Math.round(gross * (1 - discount / 100));
    const tax = Math.round(net * taxPct / 100);
    const total = net + tax;
    return { gross, net, discount, taxPct, tax, total };
  }, [selectedPlan, form.qty, form.discountPct, form.taxPct, form.billingCycle]);

  const provision = async (e) => {
    e.preventDefault();
    if (!form.companyId) return toast.error('Select a company');
    if (!form.planId)    return toast.error('Select a plan');
    if (!form.validFrom || !form.validTo) return toast.error('Set the validity window');
    if (new Date(form.validTo) <= new Date(form.validFrom)) return toast.error('Valid-to must be after valid-from');
    setSaving(true);
    try {
      const { data } = await api.post('/subscriptions', form);
      toast.success(`Subscription provisioned for ${data.subscription.company.name}`);
      setForm((f) => ({ ...f, qty: 1, discountPct: 0 }));
      loadSubs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not provision subscription');
    } finally {
      setSaving(false);
    }
  };

  const mrr = subs.filter((s) => s.status === 'active').reduce((sum, s) => sum + (s.billingCycle === 'annual' ? s.amount / 12 : s.amount), 0);
  const active = subs.filter((s) => s.status === 'active').length;
  const pastDue = subs.filter((s) => s.status === 'past-due').length;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><CreditCard size={12} /> {t('subs.title')}</span>
          <h1 className="display mt-2 text-3xl">{t('subs.title')}</h1>
          <p className="mt-1 text-sm text-ink/60">{t('subs.subtitle', { n: active, mrr: `₹${(mrr / 100000).toFixed(1)}L` })}</p>
        </div>
        <ExportMenu
          label="Export full report"
          title={`Billing report · ${new Date().toLocaleDateString()}`}
          filename={`billing-report-${new Date().toISOString().slice(0, 10)}`}
          meta={{
            'MRR (₹)': Math.round(mrr).toLocaleString(),
            'Active commercial / billing': active,
            'Past-due': pastDue,
            'Transactions (30d)': txn.length,
          }}
          sections={[
            {
              title: '1. Plans',
              head: ['Plan', 'Price ₹/mo', 'Billing', 'Job posts', 'Resume credits', 'Active subscribers'],
              body: plans.map((p) => [p.name, p.price || 0, p.billing, p.jobPosts === 999 ? 'Unlimited' : p.jobPosts, p.credits === 9999 ? 'Unlimited' : p.credits, p.activeSubs ?? 0]),
            },
            {
              title: '2. Active commercial / billing',
              head: ['Company', 'Plan', 'Qty', 'Discount %', 'Tax %', 'Amount ₹', 'Billing cycle', 'Status', 'Valid from', 'Valid to', 'Invoices'],
              body: subs.map((s) => [
                s.company?.name || '', s.plan, s.qty ?? 1, s.discountPct ?? 0, s.taxPct ?? 0, s.amount || 0, s.billingCycle, s.status,
                (s.validFrom || s.startedAt) ? new Date(s.validFrom || s.startedAt).toLocaleDateString() : '',
                (s.validTo   || s.renewsAt)  ? new Date(s.validTo   || s.renewsAt).toLocaleDateString()  : '',
                s.invoicesCount ?? 0,
              ]),
            },
            {
              title: '3. Recent transactions',
              head: ['Invoice', 'Company', 'Amount ₹', 'Method', 'Status', 'Date'],
              body: txn.map((t) => [
                t.invoiceNo, t.company?.name || '', t.amount || 0, t.method, t.status,
                t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '',
              ]),
            },
          ]}
        />
      </header>

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi icon={IndianRupee} tone="from-cobalt to-cobalt-700" value={`₹${(mrr / 100000).toFixed(1)}L`} label="MRR" />
        <Kpi icon={TrendingUp}  tone="from-emerald-500 to-teal-600" value={active} label="Active commercial / billing" />
        <Kpi icon={AlertTriangle} tone="from-coral to-amber-500" value={pastDue} label="Past-due" />
        <Kpi icon={Receipt} tone="from-violet-500 to-fuchsia-500" value={txn.length} label="Transactions (30d)" />
      </div>

      {/* Provision subscription */}
      <form onSubmit={provision} className="card p-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Provision subscription</p>
          {preview && (
            <p className="text-xs text-ink/60">
              Total <span className="display text-base text-ink">₹{preview.total.toLocaleString()}</span>
              {preview.tax > 0 && (
                <span className="ml-2 text-ink/50">
                  (₹{preview.net.toLocaleString()} + ₹{preview.tax.toLocaleString()} tax)
                </span>
              )}
              {preview.discount > 0 && (
                <span className="ml-2 text-ink/40 line-through">₹{preview.gross.toLocaleString()}</span>
              )}
            </p>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">Company</label>
            <select className="input" value={form.companyId} onChange={(e) => setField('companyId', e.target.value)}>
              <option value="">Select a company…</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Plan</label>
            <select className="input" value={form.planId} onChange={(e) => setField('planId', e.target.value)}>
              <option value="">Select a plan…</option>
              {plans.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}{p.price ? ` · ₹${p.price.toLocaleString()}/mo` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Quantity</label>
            <input
              type="number"
              min="1"
              className="input"
              value={form.qty}
              onChange={(e) => setField('qty', e.target.value)}
              placeholder="Number of seats"
            />
          </div>

          <div>
            <label className="label">Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              className="input"
              value={form.discountPct}
              onChange={(e) => setField('discountPct', e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <label className="label">Tax / GST (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              className="input"
              value={form.taxPct}
              onChange={(e) => setField('taxPct', e.target.value)}
              placeholder="18"
            />
          </div>

          <div>
            <label className="label">Billing cycle</label>
            <select className="input" value={form.billingCycle} onChange={(e) => onCycleChange(e.target.value)}>
              {BILLING_CYCLES.map((c) => (
                <option key={c.v} value={c.v}>{c.l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Valid from</label>
            <input
              type="date"
              className="input"
              value={form.validFrom}
              onChange={(e) => onValidFromChange(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Valid to</label>
            <input
              type="date"
              className="input"
              value={form.validTo}
              min={form.validFrom}
              onChange={(e) => setField('validTo', e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button className="btn-primary w-full" disabled={saving}>
              <PlusCircle size={14} /> {saving ? 'Provisioning…' : 'Provision'}
            </button>
          </div>
        </div>
      </form>

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
        <div className="flex items-center justify-between gap-2 px-5 py-3">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Active commercial / billing</p>
            <span className="chip">{visibleSubs.length}{filtersActive ? ` / ${subs.length}` : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CompactSelect
              icon={Filter}
              value={filters.customer}
              onChange={(v) => setFilter('customer', v)}
              placeholder="Customer"
              options={customerOptions}
            />
            <CompactSelect
              value={filters.plan}
              onChange={(v) => setFilter('plan', v)}
              placeholder={t('subs.filter.plan')}
              options={planOptions}
            />
            <CompactSelect
              value={filters.status}
              onChange={(v) => setFilter('status', v)}
              placeholder={t('subs.filter.status')}
              options={statusOptions}
            />
            <CompactSelect
              value={filters.cycle}
              onChange={(v) => setFilter('cycle', v)}
              placeholder={t('subs.filter.cycle')}
              options={cycleOptions}
            />
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                title={t('subs.filter.clear')}
                className="grid h-7 w-7 place-items-center rounded-lg border border-ink/10 text-ink/55 hover:bg-cloud hover:text-coral"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-cloud text-left">
              <tr className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/55">
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Qty</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Validity</th>
                <th className="px-5 py-3">Invoices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {visibleSubs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-ink/55">
                    {t('subs.filter.no_match')}
                  </td>
                </tr>
              )}
              {visibleSubs.map((s) => {
                const from = s.validFrom || s.startedAt;
                const to   = s.validTo   || s.renewsAt;
                return (
                  <tr key={s._id} className="hover:bg-cloud/60">
                    <td className="px-5 py-3 font-semibold">{s.company.name}</td>
                    <td className="px-5 py-3"><span className={`${PLAN_TONE[s.plan]} capitalize`}>{s.plan}</span></td>
                    <td className="px-5 py-3 text-ink/70">{s.qty ?? 1}</td>
                    <td className="px-5 py-3 text-ink/70">
                      {s.amount ? `₹${s.amount.toLocaleString()}` : '—'}
                      <span className="text-xs text-ink/45"> / {s.billingCycle}</span>
                      {s.discountPct > 0 && <span className="chip-emerald ml-2">−{s.discountPct}%</span>}
                    </td>
                    <td className="px-5 py-3"><span className={`${STATUS_TONE[s.status]} capitalize`}>{s.status}</span></td>
                    <td className="px-5 py-3 text-xs text-ink/55">
                      {from ? new Date(from).toLocaleDateString() : '—'} → {to ? new Date(to).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-ink/70">{s.invoicesCount}</span>
                        <button
                          type="button"
                          onClick={() => downloadInvoice({
                            invoiceNo: `INV-${s.company?.name?.slice(0, 4).toUpperCase().replace(/\s/g, '') || 'SUB'}-${s._id}`,
                            company: s.company,
                            amount: s.amount,
                            method: '—',
                            status: s.status === 'active' ? 'paid' : s.status,
                            createdAt: from,
                            taxPct: s.taxPct,
                            plan: s.plan,
                            billingCycle: s.billingCycle,
                          })}
                          title="Download latest invoice"
                          className="inline-flex items-center gap-1 rounded-lg border border-ink/10 px-2 py-1 text-xs font-semibold text-ink/70 hover:border-cobalt/40 hover:text-cobalt"
                        >
                          <Download size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Transactions */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-5 py-3">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Recent transactions</p>
            <span className="chip">{visibleTxn.length}{txnFiltersActive ? ` / ${txn.length}` : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CompactSelect
              icon={Filter}
              value={txnFilters.customer}
              onChange={(v) => setTxnFilter('customer', v)}
              placeholder="Customer"
              options={txnCustomerOptions}
            />
            <CompactSelect
              value={txnFilters.status}
              onChange={(v) => setTxnFilter('status', v)}
              placeholder={t('subs.filter.status')}
              options={txnStatusOptions}
            />
            <CompactSelect
              value={txnFilters.method}
              onChange={(v) => setTxnFilter('method', v)}
              placeholder="Method"
              options={txnMethodOptions}
            />
            {txnFiltersActive && (
              <button
                type="button"
                onClick={clearTxnFilters}
                title={t('subs.filter.clear')}
                className="grid h-7 w-7 place-items-center rounded-lg border border-ink/10 text-ink/55 hover:bg-cloud hover:text-coral"
              >
                <X size={12} />
              </button>
            )}
          </div>
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
                <th className="px-5 py-3 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {visibleTxn.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-ink/55">
                    {t('subs.filter.no_match')}
                  </td>
                </tr>
              )}
              {visibleTxn.map((x) => (
                <tr key={x._id} className="hover:bg-cloud/60">
                  <td className="px-5 py-3 font-mono text-xs">{x.invoiceNo}</td>
                  <td className="px-5 py-3 font-semibold">{x.company.name}</td>
                  <td className="px-5 py-3 text-ink/70">₹{x.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-ink/70">{x.method}</td>
                  <td className="px-5 py-3">
                    <span className={`chip capitalize ${x.status === 'paid' ? 'chip-emerald' : x.status === 'pending' ? 'chip-gold' : 'chip-coral'}`}>
                      {x.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-ink/55">{new Date(x.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => downloadInvoice(x)}
                      title={`Download invoice ${x.invoiceNo}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-ink/10 px-2.5 py-1 text-xs font-semibold text-ink/70 hover:border-cobalt/40 hover:text-cobalt"
                    >
                      <Download size={12} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function CompactSelect({ icon: Icon, value, onChange, placeholder, options }) {
  const active = !!value;
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={11}
          className={`pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 ${active ? 'text-cobalt' : 'text-ink/45'}`}
        />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-7 max-w-[150px] appearance-none truncate rounded-lg border bg-white py-0 pr-6 text-xs capitalize outline-none transition focus:border-cobalt/60 ${
          Icon ? 'pl-6' : 'pl-2'
        } ${active ? 'border-cobalt/40 bg-cobalt/5 font-semibold text-cobalt-700' : 'border-ink/10 text-ink/70'}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="capitalize">{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] text-ink/45">▼</span>
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
