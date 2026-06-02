import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Briefcase, FileCheck, FileText, Tag,
  LogOut, Menu, X, ShieldCheck, CreditCard, BarChart3, Activity, Mail, Megaphone,
  Settings as SettingsIcon, Bell, ChevronDown, Search, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { filterNavLinks } from '../utils/permissions';
import { useMemo, useState } from 'react';

const SECTIONS = [
  {
    labelKey: 'nav.section.overview',
    links: [
      { to: '/',         labelKey: 'nav.dashboard',           icon: LayoutDashboard, end: true },
      { to: '/reports',  labelKey: 'nav.reports_analytics',   icon: BarChart3 },
    ],
  },
  {
    labelKey: 'nav.section.people',
    links: [
      { to: '/users/candidates', labelKey: 'nav.candidates', icon: Users },
      { to: '/users/employers',  labelKey: 'nav.employers',  icon: Users },
      { to: '/companies',        labelKey: 'nav.companies',  icon: Building2 },
      { to: '/users/admins',     labelKey: 'nav.admins',     icon: ShieldCheck },
    ],
  },
  {
    labelKey: 'nav.section.content',
    links: [
      { to: '/jobs',         labelKey: 'nav.jobs',         icon: Briefcase },
      { to: '/applications', labelKey: 'nav.applications', icon: FileText },
      { to: '/categories',   labelKey: 'nav.categories',   icon: Tag },
    ],
  },
  {
    labelKey: 'nav.section.operations',
    links: [
      { to: '/kyc',           labelKey: 'nav.kyc',           icon: FileCheck },
      { to: '/subscriptions', labelKey: 'nav.commercial_billing', icon: CreditCard },
      { to: '/reports-queue', labelKey: 'nav.reports_queue', icon: ShieldCheck },
      { to: '/activity',      labelKey: 'nav.activity',      icon: Activity },
    ],
  },
  {
    labelKey: 'nav.section.communication',
    links: [
      { to: '/templates',  labelKey: 'nav.templates',  icon: Mail },
      { to: '/broadcasts', labelKey: 'nav.broadcasts', icon: Megaphone },
    ],
  },
  {
    labelKey: 'nav.section.system',
    links: [
      { to: '/settings', labelKey: 'nav.settings', icon: SettingsIcon },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { t } = useLocale();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState('');

  const onLogout = () => { logout(); nav('/login'); };

  const sections = useMemo(() => {
    const role = user?.role;
    return SECTIONS
      .map((s) => ({ ...s, links: filterNavLinks(role, s.links) }))
      .filter((s) => s.links.length > 0);
  }, [user?.role]);

  const onSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    nav(`/users/candidates?q=${encodeURIComponent(q)}`);
    setSearch('');
  };

  return (
    <div className="flex min-h-screen bg-cloud">
      {/* Sidebar */}
      <aside
        className={`${open ? 'fixed inset-0 z-40 block bg-ink/40' : 'hidden'} lg:relative lg:block lg:bg-transparent`}
        onClick={() => setOpen(false)}
      >
        <div
          className="h-screen w-64 shrink-0 overflow-y-auto border-r border-ink/10 bg-white lg:sticky lg:top-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Brand */}
          <Link to="/" className="flex flex-col items-start gap-2 border-b border-ink/10 px-5 py-5">
            <img src="/talentvexa.png" alt="TalentVexa" className="h-20 w-auto" />
            <span className="rounded-full bg-cobalt/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cobalt-700">
              {t('brand.console')}
            </span>
          </Link>

          {/* Nav */}
          <nav className="space-y-5 px-3 py-5">
            {sections.map((s) => (
              <div key={s.labelKey}>
                <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">
                  {t(s.labelKey)}
                </p>
                <ul className="space-y-0.5">
                  {s.links.map((l) => (
                    <li key={l.to}>
                      <NavLink
                        to={l.to}
                        end={l.end}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
                        }
                      >
                        <l.icon size={15} /> {t(l.labelKey)}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Plan / Help footer */}
          <div className="m-3 mt-2 rounded-2xl border border-cobalt/20 bg-gradient-to-br from-cobalt-50 to-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cobalt-700">
              <Sparkles size={11} className="-mt-0.5 mr-1 inline" />
              {t('topbar.tip.title')}
            </p>
            <p className="mt-2 text-xs text-ink/70">
              {t('topbar.tip.body')}
            </p>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink/10 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen((s) => !s)} className="grid h-10 w-10 place-items-center rounded-xl border border-ink/10 bg-white lg:hidden">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>

            <form onSubmit={onSearch} className="hidden items-center gap-2 rounded-full border border-ink/10 bg-cloud px-3 py-1.5 sm:flex">
              <Search size={13} className="text-ink/45" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('topbar.search.placeholder')}
                className="w-72 bg-transparent text-sm outline-none placeholder:text-ink/45"
              />
              <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] text-ink/45 sm:inline">↵</kbd>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/reports-queue"
              title={t('topbar.notifications')}
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-ink/10 bg-white text-ink/70 hover:text-cobalt"
            >
              <Bell size={16} />
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-coral text-[9px] font-bold text-white">5</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setMenu((s) => !s)}
                className="flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1.5 pl-1 pr-3 hover:border-cobalt/50"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-cobalt to-ink text-[12px] font-bold text-white">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </span>
                <span className="hidden text-sm font-semibold text-ink sm:inline">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={13} className="text-ink/40" />
              </button>
              {menu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenu(false)} />
                  <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-pop">
                    <div className="border-b border-ink/5 px-4 py-3">
                      <p className="truncate text-sm font-semibold">{user?.name}</p>
                      <p className="truncate text-xs text-ink/50">{user?.email}</p>
                      <span className="mt-1.5 inline-flex rounded-full bg-cobalt/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cobalt-700">
                        {user?.role}
                      </span>
                    </div>
                    <Link to="/me" onClick={() => setMenu(false)} className="block px-4 py-2.5 text-sm hover:bg-cream">
                      {t('topbar.my_profile')}
                    </Link>
                    <Link to="/settings" onClick={() => setMenu(false)} className="block px-4 py-2.5 text-sm hover:bg-cream">
                      {t('topbar.site_settings')}
                    </Link>
                    <Link to="/activity" onClick={() => setMenu(false)} className="block px-4 py-2.5 text-sm hover:bg-cream">
                      {t('topbar.activity_log')}
                    </Link>
                    <button onClick={onLogout} className="flex w-full items-center gap-2 border-t border-ink/5 px-4 py-2.5 text-left text-sm text-coral hover:bg-coral/5">
                      <LogOut size={14} /> {t('topbar.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8"><Outlet /></main>
      </div>
    </div>
  );
}
