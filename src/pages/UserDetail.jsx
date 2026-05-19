import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Star, FileText, Activity, ShieldCheck, Ban } from 'lucide-react';
import api from '../api/client';

export default function UserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => { api.get(`/users/${id}`).then((r) => setData(r.data)); }, [id]);
  if (!data) return <div className="card p-10 text-center text-ink/55">Loading…</div>;

  const u = data.user;
  return (
    <div className="space-y-5">
      <Link to={`/users/${u.role === 'employer' ? 'employers' : u.role === 'admin' ? 'admins' : 'candidates'}`} className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-cobalt">
        <ArrowLeft size={13} /> Back
      </Link>

      <header className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cobalt to-ink text-xl font-bold text-white">
              {u.name?.[0]?.toUpperCase()}
            </span>
            <div>
              <h1 className="display text-2xl">{u.name}</h1>
              <p className="text-ink/65">{u.headline || u.designation || '—'}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/55">
                <span className="flex items-center gap-1"><Mail size={11} /> {u.email}</span>
                {u.phone && <span className="flex items-center gap-1"><Phone size={11} /> {u.phone}</span>}
                {u.location && <span className="flex items-center gap-1"><MapPin size={11} /> {u.location}</span>}
                {u.totalExperienceYears != null && <span className="flex items-center gap-1"><Briefcase size={11} /> {u.totalExperienceYears} yrs</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-outline"><ShieldCheck size={13} /> Verify</button>
            <button className="btn-danger"><Ban size={13} /> Suspend</button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="card p-6">
          <h2 className="display text-lg">Activity overview</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KV label="Applied" value={u.appliedCount ?? u.jobsPosted ?? '—'} />
            <KV label="Profile views" value={u.profileViews ?? '—'} />
            <KV label="Hires" value={u.hiresCount ?? '—'} />
            <KV label="Completeness" value={u.profileCompleteness ? `${u.profileCompleteness}%` : '—'} />
          </div>
          {u.skills?.length > 0 && (
            <>
              <p className="label mt-5">Skills</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {u.skills.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
            </>
          )}
        </section>

        <section className="card p-6">
          <h2 className="display text-lg">Recent applications</h2>
          {data.applications.length === 0 && <p className="mt-3 text-sm text-ink/55">No applications yet.</p>}
          <div className="mt-3 space-y-2">
            {data.applications.slice(0, 6).map((a) => (
              <div key={a._id} className="rounded-2xl border border-ink/10 p-3">
                <p className="text-sm font-semibold">{a.job?.title}</p>
                <p className="text-xs text-ink/55">{a.job?.company?.name} · {a.status}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function KV({ label, value }) {
  return (
    <div className="rounded-2xl border border-ink/10 p-3 text-center">
      <p className="display text-xl">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-ink/55">{label}</p>
    </div>
  );
}
