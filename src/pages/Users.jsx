import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Users as UsersIcon, Search, Ban, CheckCircle2, Eye,
} from 'lucide-react';
import api from '../api/client';
import ExportMenu from '../components/ExportMenu';
import { useLocale } from '../context/LocaleContext';

const ROLE_META = {
  candidates: { labelKey: 'users.candidates', filter: 'jobseeker', tone: 'from-cobalt to-cobalt-700' },
  employers:  { labelKey: 'users.employers',  filter: 'employer',  tone: 'from-violet-500 to-fuchsia-500' },
  admins:     { labelKey: 'users.admins',     filter: 'admin',     tone: 'from-rose-500 to-red-500' },
};

export default function Users() {
  const { t } = useLocale();
  const { role = 'candidates' } = useParams();
  const [sp, setSp] = useSearchParams();
  const meta = ROLE_META[role] || ROLE_META.candidates;
  const roleLabel = t(meta.labelKey);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState(sp.get('q') || '');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (query = q) =>
    api.get('/users', { params: { role: meta.filter, q: query, status: status || undefined } })
      .then((r) => setItems(r.data.items || []))
      .finally(() => setLoading(false));

  useEffect(() => {
    setLoading(true);
    const urlQ = sp.get('q') || '';
    setQ(urlQ);
    load(urlQ);
    /* eslint-disable-next-line */
  }, [role, status, sp]);

  const onSearch = (e) => {
    e.preventDefault();
    setSp(q ? { q } : {}, { replace: true });
  };

  const toggleBlock = async (id) => {
    await api.put(`/users/${id}/block`);
    toast.success(t('common.status_updated'));
    load();
  };
  const verify = async (id) => {
    await api.put(`/users/${id}/verify`);
    toast.success(t('common.user_verified'));
    load();
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><UsersIcon size={12} /> {roleLabel}</span>
          <h1 className="display mt-2 text-3xl">{roleLabel}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {loading
              ? t('common.loading')
              : t('users.count_on_platform', { n: items.length.toLocaleString(), label: roleLabel.toLowerCase() })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={onSearch} className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3">
            <Search size={13} className="text-ink/40" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={t('users.search.placeholder')}
              className="w-64 bg-transparent py-2 text-sm outline-none placeholder:text-ink/40"
            />
          </form>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input max-w-[160px]">
            <option value="">{t('common.all_statuses')}</option>
            <option value="active">{t('common.active')}</option>
            <option value="blocked">{t('common.blocked')}</option>
            <option value="pending">{t('common.pending')}</option>
          </select>
          <ExportMenu
            label={t('common.export')}
            title={`${roleLabel} · ${new Date().toLocaleDateString()}`}
            filename={`${roleLabel.toLowerCase()}-${new Date().toISOString().slice(0, 10)}`}
            rows={buildUsersRows(role, items)}
          />
        </div>
      </header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-cloud text-left">
              <tr className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/55">
                <th className="px-5 py-3">{t('common.user')}</th>
                <th className="px-5 py-3">{role === 'employers' ? t('common.company') : t('common.headline')}</th>
                <th className="px-5 py-3">{role === 'employers' ? t('common.designation') : t('common.location')}</th>
                <th className="px-5 py-3">{role === 'admins' ? t('common.role') : (role === 'employers' ? t('common.posted') : t('common.applied'))}</th>
                <th className="px-5 py-3">{t('common.status')}</th>
                <th className="px-5 py-3">{t('common.last_active')}</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="7" className="px-5 py-4"><div className="h-3 w-2/5 rounded bg-ink/5" /></td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr><td colSpan="7" className="px-5 py-12 text-center text-ink/55">{t('users.no_match', { label: roleLabel.toLowerCase() })}</td></tr>
              )}
              {!loading && items.map((u) => (
                <tr key={u._id} className="hover:bg-cloud/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${meta.tone}`}>
                        {u.name?.[0]?.toUpperCase()}
                      </span>
                      <div>
                        <p className="font-semibold leading-tight">{u.name}</p>
                        <p className="text-xs text-ink/55">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink/70">{role === 'employers' ? u.company?.name : u.headline || '—'}</td>
                  <td className="px-5 py-3 text-ink/70">{role === 'employers' ? u.designation : u.location || '—'}</td>
                  <td className="px-5 py-3">
                    {role === 'admins'
                      ? <span className="chip-violet capitalize">{u.role}</span>
                      : role === 'employers'
                        ? <span className="text-ink/70">{t('users.jobs_posted', { n: u.jobsPosted ?? '—' })}</span>
                        : <span className="text-ink/70">{t('users.apps_count', { n: u.appliedCount ?? 0 })}</span>}
                  </td>
                  <td className="px-5 py-3"><StatusPill status={u.status} /></td>
                  <td className="px-5 py-3 text-xs text-ink/55">
                    {u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1.5">
                      {u.status !== 'active' && role !== 'admins' && (
                        <button onClick={() => verify(u._id)} className="btn-ghost text-xs"><CheckCircle2 size={13} /></button>
                      )}
                      {role !== 'admins' && (
                        <button
                          onClick={() => toggleBlock(u._id)}
                          className={`btn-ghost text-xs ${u.status === 'blocked' ? 'text-emerald-700' : 'text-coral'}`}
                          title={u.status === 'blocked' ? t('common.unblock') : t('common.block')}
                        >
                          <Ban size={13} />
                        </button>
                      )}
                      <Link to={`/users/detail/${u._id}`} className="btn-ghost text-xs"><Eye size={13} /></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function buildUsersRows(role, items) {
  if (role === 'employers') {
    return [
      ['Name', 'Email', 'Phone', 'Company', 'Designation', 'Jobs posted', 'Hires', 'Status', 'Last active', 'Created'],
      ...items.map((u) => [
        u.name, u.email, u.phone || '', u.company?.name || '', u.designation || '',
        u.jobsPosted ?? 0, u.hiresCount ?? 0, u.status,
        u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString() : '',
        u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
      ]),
    ];
  }
  if (role === 'admins') {
    return [
      ['Name', 'Email', 'Role', 'Status', 'Last login'],
      ...items.map((u) => [
        u.name, u.email, u.role, u.status,
        u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '',
      ]),
    ];
  }
  return [
    ['Name', 'Email', 'Phone', 'Headline', 'Location', 'Experience (yrs)', 'Skills', 'Apps', 'Profile views', 'Completeness %', 'Status', 'Last active', 'Created'],
    ...items.map((u) => [
      u.name, u.email, u.phone || '', u.headline || '', u.location || '',
      u.totalExperienceYears ?? 0, (u.skills || []).join('; '),
      u.appliedCount ?? 0, u.profileViews ?? 0, u.profileCompleteness ?? 0,
      u.status,
      u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString() : '',
      u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
    ]),
  ];
}

function StatusPill({ status }) {
  const map = {
    active:  'chip-emerald',
    pending: 'chip-gold',
    blocked: 'chip-coral',
  };
  return <span className={`${map[status] || 'chip'} capitalize`}>{status}</span>;
}
