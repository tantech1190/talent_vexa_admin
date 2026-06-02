import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FileCheck, Building2, FileText, ShieldCheck, X, Clock, Headphones, User,
  CheckCircle2, AlertCircle, ChevronRight,
} from 'lucide-react';
import api from '../api/client';
import ExportMenu from '../components/ExportMenu';
import { useLocale } from '../context/LocaleContext';

const STATUS_META = {
  pending:        { label: 'Pending',       tone: 'chip-gold',    icon: Clock },
  'under-review': { label: 'Under review',  tone: 'chip-accent',  icon: AlertCircle },
  approved:       { label: 'Approved',      tone: 'chip-emerald', icon: CheckCircle2 },
  rejected:       { label: 'Rejected',      tone: 'chip-coral',   icon: X },
};

export default function Kyc() {
  const { t } = useLocale();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api.get('/kyc', { params: { status: status || undefined } })
      .then((r) => {
        setItems(r.data.items || []);
        if (!active && (r.data.items || []).length) setActive(r.data.items[0]);
      })
      .finally(() => setLoading(false));

  useEffect(() => { setLoading(true); load(); /* eslint-disable-next-line */ }, [status]);

  const approve = async (id) => {
    await api.put(`/kyc/${id}/approve`);
    toast.success(t('kyc.approved_msg'));
    setActive(null);
    load();
  };
  const reject = async (id) => {
    await api.put(`/kyc/${id}/reject`);
    toast.success(t('kyc.rejected_msg'));
    setActive(null);
    load();
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><FileCheck size={12} /> {t('kyc.title')}</span>
          <h1 className="display mt-2 text-3xl">{t('kyc.title')}</h1>
          <p className="mt-1 text-sm text-ink/60">{t('kyc.subtitle', { n: items.length })}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ExportMenu
            label={t('common.export')}
            title={`${t('kyc.title')} · ${new Date().toLocaleDateString()}`}
            filename={`kyc-${new Date().toISOString().slice(0, 10)}`}
            rows={[
              ['Company', 'Legal name', 'PAN', 'GSTIN', 'CIN', 'Submitted by', 'Status', 'Path', 'Submitted', 'Notes'],
              ...items.map((k) => [
                k.company?.name || '', k.legalName || '', k.pan || '', k.gstin || '', k.cin || '',
                k.submittedBy?.name || '', k.status || '', k.verificationPath || '',
                k.submittedAt ? new Date(k.submittedAt).toLocaleDateString() : '',
                k.notes || '',
              ]),
            ]}
          />
        <div className="inline-flex gap-1 rounded-full border border-ink/10 bg-white p-1 text-sm">
          {['', 'pending', 'under-review', 'approved', 'rejected'].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setStatus(s)}
              className={`rounded-full px-4 py-1.5 capitalize ${status === s ? 'bg-cobalt text-white' : 'text-ink/65 hover:text-ink'}`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1.4fr]">
        {/* List */}
        <div className="card divide-y divide-ink/5">
          {loading && <div className="animate-pulse p-5"><div className="h-3 w-2/5 rounded bg-ink/5" /></div>}
          {!loading && items.length === 0 && <div className="p-10 text-center text-sm text-ink/55">Nothing matches.</div>}
          {items.map((k) => {
            const meta = STATUS_META[k.status] || STATUS_META.pending;
            return (
              <button
                key={k._id}
                onClick={() => setActive(k)}
                className={`flex w-full items-start gap-3 p-4 text-left transition hover:bg-cloud/60 ${active?._id === k._id ? 'bg-cobalt/[0.05]' : ''}`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cobalt to-ink text-xs font-bold text-white">
                  {k.company.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{k.company.name}</p>
                    <span className={meta.tone}><meta.icon size={11} /> {meta.label}</span>
                  </div>
                  <p className="truncate text-xs text-ink/55">{k.company.industry} · {k.company.size} · {k.company.hq}</p>
                  <p className="mt-1 text-[11px] text-ink/45">Submitted by {k.submittedBy} · {new Date(k.submittedAt).toLocaleDateString()}</p>
                </div>
                <ChevronRight size={14} className="mt-1 text-ink/40" />
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="card p-6">
          {!active && <p className="text-sm text-ink/55">Select a submission from the list.</p>}
          {active && (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="display text-2xl">{active.company.name}</h2>
                  <p className="text-sm text-ink/65">{active.legalName}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/55">
                    <span className="flex items-center gap-1"><Building2 size={11} /> {active.company.industry}</span>
                    <span className="flex items-center gap-1"><User size={11} /> {active.submittedBy}</span>
                    <span className="flex items-center gap-1">
                      {active.verificationPath === 'assisted' ? <Headphones size={11} /> : <ShieldCheck size={11} />}
                      {active.verificationPath === 'assisted' ? 'Assisted onboarding' : 'Self-verify'}
                    </span>
                  </div>
                </div>
                <span className={`${(STATUS_META[active.status] || STATUS_META.pending).tone} capitalize`}>{active.status}</span>
              </div>

              {/* KYC fields */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <KV label="Company PAN" value={active.pan} mono />
                <KV label="GSTIN" value={active.gstin} mono />
                <KV label="CIN" value={active.cin} mono />
                <KV label="Contact" value={active.company.contactEmail} />
              </div>

              {/* Documents */}
              <p className="label mt-5">Documents</p>
              <div className="mt-1 grid gap-2 sm:grid-cols-2">
                {Object.entries(active.documents).map(([k, v]) => (
                  <div
                    key={k}
                    className={`flex items-center justify-between rounded-2xl border p-3 ${v ? 'border-ink/10 bg-white' : 'border-dashed border-ink/15 bg-cloud/40'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`grid h-9 w-9 place-items-center rounded-xl ${v ? 'bg-cobalt/10 text-cobalt-700' : 'bg-ink/5 text-ink/40'}`}>
                        <FileText size={14} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold capitalize">{k}</p>
                        <p className="text-[11px] text-ink/55">{v || 'Not uploaded'}</p>
                      </div>
                    </div>
                    {v && <a href="#" className="text-xs font-semibold text-cobalt-700 hover:underline">View</a>}
                  </div>
                ))}
              </div>

              {active.notes && (
                <div className="mt-5 rounded-2xl border border-cobalt/15 bg-cobalt-50 p-3 text-sm text-ink/75">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-cobalt-700">Note from employer</p>
                  <p className="mt-1">{active.notes}</p>
                </div>
              )}

              {/* Actions */}
              {(active.status === 'pending' || active.status === 'under-review') && (
                <div className="mt-6 flex flex-wrap gap-2">
                  <button onClick={() => approve(active._id)} className="btn-success">
                    <CheckCircle2 size={13} /> Approve & verify
                  </button>
                  <button onClick={() => reject(active._id)} className="btn-danger">
                    <X size={13} /> Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KV({ label, value, mono }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-cloud/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-ink/55">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
