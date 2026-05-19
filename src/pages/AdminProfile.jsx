import { ShieldCheck, Mail, Activity, Bell, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminProfile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-5">
      <header>
        <span className="section-eyebrow"><ShieldCheck size={12} /> My profile</span>
        <h1 className="display mt-2 text-3xl">{user.name}</h1>
        <p className="mt-1 text-sm text-ink/60">{user.email}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-6">
          <h2 className="display text-xl">Account</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <KV label="Display name" value={user.name} />
            <KV label="Email" value={user.email} />
            <KV label="Role" value={user.role} cap />
            <KV label="Status" value={user.status} cap />
            <KV label="Last login" value={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '—'} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="card p-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Permissions</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <Perm icon={ShieldCheck} label="Approve / reject KYC submissions" />
              <Perm icon={Bell} label="Suspend / verify users" />
              <Perm icon={Mail} label="Send platform broadcasts" />
              <Perm icon={Lock} label="Change site settings & feature flags" />
              <Perm icon={Activity} label="View immutable audit log" />
            </ul>
          </div>
          <div className="card p-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Tips</h3>
            <p className="mt-3 text-sm text-ink/70">
              <Sparkles size={12} className="-mt-0.5 mr-1 inline text-cobalt" />
              Press <kbd className="rounded bg-ink/10 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd> anywhere to open
              the global search.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function KV({ label, value, cap }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-cloud/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-ink/55">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold ${cap ? 'capitalize' : ''}`}>{value ?? '—'}</p>
    </div>
  );
}

function Perm({ icon: Icon, label }) {
  return (
    <li className="flex items-center gap-2 text-ink/75">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-cobalt/10 text-cobalt-700">
        <Icon size={12} />
      </span>
      {label}
    </li>
  );
}
