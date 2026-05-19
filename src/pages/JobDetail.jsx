import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Briefcase, Building2, MapPin, Star, Flag, Trash2, IndianRupee,
  Calendar, Eye, Users, Hash, ShieldCheck,
} from 'lucide-react';
import api from '../api/client';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);
  const load = async () => {
    const { data } = await api.get(`/jobs/${id}`);
    setJob(data.job);
    const r = await api.get('/applications');
    setApps((r.data.items || []).filter((a) => a.job?._id === id));
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  if (!job) return <div className="card p-10 text-center text-ink/55">Loading…</div>;

  const toggleFeatured = async () => { await api.put(`/jobs/${id}/feature`); load(); };
  const unpublish = async () => { await api.put(`/jobs/${id}/unpublish`); toast.success('Unpublished'); load(); };
  const remove = async () => {
    if (!window.confirm('Delete this job permanently?')) return;
    await api.delete(`/jobs/${id}`);
    toast.success('Job deleted');
    history.back();
  };

  return (
    <div className="space-y-5">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-cobalt">
        <ArrowLeft size={13} /> All jobs
      </Link>

      {/* Hero */}
      <header className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="display text-3xl">{job.title}</h1>
              {job.isFeatured && <span className="chip-gold"><Star size={11} className="fill-current" /> Featured</span>}
              {job.isHot && <span className="chip-coral">Hot</span>}
              {job.flagged && <span className="chip-coral"><Flag size={11} /> Flagged</span>}
              <span className={`chip capitalize ${job.status === 'active' ? 'chip-emerald' : job.status === 'closed' ? 'chip-coral' : 'chip-gold'}`}>
                {job.status}
              </span>
            </div>
            <Link to={`/companies/${job.company._id}`} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-cobalt-700 hover:underline">
              <Building2 size={12} /> {job.company.name}
            </Link>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/55">
              <span className="flex items-center gap-1"><MapPin size={11} /> {job.location} · {job.workMode}</span>
              <span className="flex items-center gap-1"><Hash size={11} /> {job.category?.name}</span>
              <span className="flex items-center gap-1"><Briefcase size={11} /> {job.experienceMin}-{job.experienceMax} yrs · {job.jobType}</span>
              <span className="flex items-center gap-1"><IndianRupee size={11} />
                {(job.salaryMin / 100000).toFixed(0)}-{(job.salaryMax / 100000).toFixed(0)} LPA
              </span>
              <span className="flex items-center gap-1"><Calendar size={11} /> Expires {new Date(job.expiresAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={toggleFeatured} className="btn-outline">
              <Star size={13} className={job.isFeatured ? 'fill-amber-400 text-amber-400' : ''} />
              {job.isFeatured ? 'Unfeature' : 'Feature'}
            </button>
            <button onClick={unpublish} className="btn-outline text-coral"><Flag size={13} /> Unpublish</button>
            <button onClick={remove} className="btn-danger"><Trash2 size={13} /> Delete</button>
          </div>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi icon={Users} tone="from-cobalt to-cobalt-700"  value={job.applicationsCount} label="Applications" />
        <Kpi icon={Eye}   tone="from-emerald-500 to-teal-600" value={job.views.toLocaleString()} label="Views" />
        <Kpi icon={Briefcase} tone="from-violet-500 to-fuchsia-500" value={job.vacancies} label="Vacancies" />
        <Kpi icon={ShieldCheck} tone="from-coral to-amber-500" value={job.company.verified ? 'Yes' : 'No'} label="Verified employer" />
      </div>

      <section className="card p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Required skills</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.map((s) => <span key={s} className="chip-accent">{s}</span>)}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Applicants ({apps.length})</p>
          <Link to={`/applications?job=${id}`} className="btn-outline text-xs">View all</Link>
        </div>
        <div className="divide-y divide-ink/5">
          {apps.length === 0 && <p className="p-6 text-sm text-ink/55">No applications yet.</p>}
          {apps.slice(0, 10).map((a) => (
            <div key={a._id} className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cobalt to-cobalt-700 text-xs font-bold text-white">
                  {a.applicant.name[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold">{a.applicant.name}</p>
                  <p className="text-xs text-ink/55">{a.applicant.headline}</p>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="chip capitalize">{a.status}</span>
                <p className="mt-0.5 text-ink/45">{new Date(a.appliedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Kpi({ icon: Icon, tone, value, label }) {
  return (
    <div className="card p-5">
      <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow ${tone}`}>
        <Icon size={18} />
      </span>
      <p className="display mt-4 text-2xl">{value}</p>
      <p className="text-xs text-ink/55">{label}</p>
    </div>
  );
}
