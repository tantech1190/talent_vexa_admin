import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Briefcase, FileText, ShieldCheck, Ban,
  GraduationCap, Calendar, Building2, Code2, Rocket, Award, Globe2, Linkedin,
  Github, ExternalLink, User2, Target, IndianRupee, Clock, Languages,
} from 'lucide-react';
import api from '../api/client';

export default function UserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => { api.get(`/users/${id}`).then((r) => setData(r.data)); }, [id]);
  if (!data) return <div className="card p-10 text-center text-ink/55">Loading…</div>;

  const u = data.user;
  const isCandidate = u.role === 'jobseeker';
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
              {(u.currentTitle || u.currentCompany) && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/55">
                  <Building2 size={11} /> {u.currentTitle}{u.currentTitle && u.currentCompany ? ' · ' : ''}{u.currentCompany}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/55">
                <span className="flex items-center gap-1"><Mail size={11} /> {u.email}</span>
                {u.phone && <span className="flex items-center gap-1"><Phone size={11} /> {u.phone}</span>}
                {u.location && <span className="flex items-center gap-1"><MapPin size={11} /> {u.location}</span>}
                {u.totalExperienceYears != null && <span className="flex items-center gap-1"><Briefcase size={11} /> {u.totalExperienceYears} yrs</span>}
                {u.noticePeriod && <span className="flex items-center gap-1"><Clock size={11} /> Notice: {u.noticePeriod}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {u.resumeUrl && (
              <a href={u.resumeUrl} target="_blank" rel="noreferrer" className="btn-outline">
                <FileText size={13} /> View resume
              </a>
            )}
            <button className="btn-outline"><ShieldCheck size={13} /> Verify</button>
            <button className="btn-danger"><Ban size={13} /> Suspend</button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <section className="card p-6">
            <h2 className="display text-lg">Activity overview</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <KVStat label={isCandidate ? 'Applied' : 'Jobs posted'} value={u.appliedCount ?? u.jobsPosted ?? '—'} />
              <KVStat label="Profile views" value={u.profileViews ?? '—'} />
              <KVStat label={isCandidate ? 'Saved' : 'Hires'} value={u.hiresCount ?? '—'} />
              <KVStat label="Completeness" value={u.profileCompleteness ? `${u.profileCompleteness}%` : '—'} />
            </div>
          </section>

          {u.about && (
            <section className="card p-6">
              <h2 className="display text-lg">Profile summary</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink/80">{u.about}</p>
            </section>
          )}

          {Array.isArray(u.skills) && u.skills.length > 0 && (
            <section className="card p-6">
              <h2 className="display text-lg">Key skills</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {u.skills.map((s) => (
                  <span key={s} className="rounded-full bg-cobalt/10 px-2.5 py-1 text-xs font-semibold text-cobalt-700">{s}</span>
                ))}
              </div>
            </section>
          )}

          {Array.isArray(u.experience) && u.experience.length > 0 && (
            <section className="card p-6">
              <h2 className="display text-lg">Employment</h2>
              <ol className="mt-3 space-y-4">
                {u.experience.map((e, i) => (
                  <li key={i} className="border-l-2 border-cobalt/30 pl-4">
                    <p className="text-sm font-semibold">{e.title}{e.company && <span className="text-ink/65"> · {e.company}</span>}</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-ink/55">
                      <Calendar size={11} /> {formatDate(e.from)} — {e.currentlyWorking ? 'Present' : (formatDate(e.to) || 'Present')}
                    </p>
                    {e.description && <p className="mt-1.5 text-xs leading-5 text-ink/75">{e.description}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {Array.isArray(u.education) && u.education.length > 0 && (
            <section className="card p-6">
              <h2 className="display text-lg">Education</h2>
              <ul className="mt-3 space-y-3">
                {u.education.map((e, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <GraduationCap size={14} className="mt-1 text-cobalt-700" />
                    <div>
                      <p className="text-sm font-semibold">{e.degree}{e.fieldOfStudy && <span className="text-ink/65"> · {e.fieldOfStudy}</span>}</p>
                      <p className="text-xs text-ink/55">
                        {e.institute || e.institution || '—'}
                        {(e.startYear || e.endYear || e.year) && <> · {e.startYear || ''}{e.startYear && (e.endYear || e.year) ? ' — ' : ''}{e.endYear || e.year || ''}</>}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {Array.isArray(u.itSkills) && u.itSkills.length > 0 && (
            <section className="card p-6">
              <h2 className="flex items-center gap-2 display text-lg"><Code2 size={16} /> IT skills</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-ink/55">
                    <tr><th className="px-3 py-2 text-left">Skill</th><th className="px-3 py-2 text-left">Experience</th><th className="px-3 py-2 text-left">Last used</th><th className="px-3 py-2 text-left">Proficiency</th></tr>
                  </thead>
                  <tbody>
                    {u.itSkills.map((sk, i) => (
                      <tr key={i} className="border-t border-ink/5">
                        <td className="px-3 py-2 font-semibold">{sk.name}{sk.version ? <span className="ml-1 text-ink/55">v{sk.version}</span> : ''}</td>
                        <td className="px-3 py-2 text-ink/65">{sk.experienceYears ? `${sk.experienceYears} yrs` : '—'}</td>
                        <td className="px-3 py-2 text-ink/65">{sk.lastUsedYear || '—'}</td>
                        <td className="px-3 py-2"><span className="rounded-full bg-cobalt/10 px-2 py-0.5 text-[11px] font-semibold text-cobalt-700">{sk.proficiency || '—'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {Array.isArray(u.projects) && u.projects.length > 0 && (
            <section className="card p-6">
              <h2 className="flex items-center gap-2 display text-lg"><Rocket size={16} /> Projects</h2>
              <ol className="mt-3 space-y-4">
                {u.projects.map((p, i) => (
                  <li key={i} className="border-l-2 border-cobalt/30 pl-4">
                    <p className="text-sm font-semibold">{p.title}{p.role && <span className="text-ink/65"> · {p.role}</span>}</p>
                    <p className="mt-0.5 inline-flex items-center gap-2 text-[11px] text-ink/55">
                      {p.client && <span><Building2 size={11} className="-mt-0.5 inline" /> {p.client}</span>}
                      <span><Calendar size={11} className="-mt-0.5 inline" /> {formatDate(p.from)} — {p.currentlyWorking ? 'Present' : formatDate(p.to) || 'Present'}</span>
                    </p>
                    {Array.isArray(p.technologies) && p.technologies.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.technologies.map((t) => <span key={t} className="rounded-md bg-ink/5 px-1.5 py-0.5 text-[11px] text-ink/70">{t}</span>)}
                      </div>
                    )}
                    {p.description && <p className="mt-1.5 text-xs leading-5 text-ink/75">{p.description}</p>}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-cobalt-700 hover:underline">
                        <ExternalLink size={10} /> View project
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {(u.certifications?.length || u.awards?.length || u.publications?.length || u.patents?.length || u.linkedinUrl || u.githubUrl || u.portfolioUrl) && (
            <section className="card p-6">
              <h2 className="flex items-center gap-2 display text-lg"><Award size={16} /> Accomplishments</h2>
              <div className="mt-3 space-y-3">
                {u.certifications?.length > 0 && <Bullet label="Certifications" items={u.certifications} />}
                {u.awards?.length > 0 && <Bullet label="Awards" items={u.awards} />}
                {u.publications?.length > 0 && <Bullet label="Publications" items={u.publications} />}
                {u.patents?.length > 0 && <Bullet label="Patents" items={u.patents} />}
              </div>
              {(u.linkedinUrl || u.githubUrl || u.portfolioUrl) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {u.linkedinUrl && <a href={u.linkedinUrl} target="_blank" rel="noreferrer" className="btn-outline"><Linkedin size={13} /> LinkedIn</a>}
                  {u.githubUrl && <a href={u.githubUrl} target="_blank" rel="noreferrer" className="btn-outline"><Github size={13} /> GitHub</a>}
                  {u.portfolioUrl && <a href={u.portfolioUrl} target="_blank" rel="noreferrer" className="btn-outline"><Globe2 size={13} /> Portfolio</a>}
                </div>
              )}
            </section>
          )}
        </div>

        <div className="space-y-4">
          <section className="card p-6">
            <h2 className="flex items-center gap-2 display text-lg"><Target size={16} /> Career profile</h2>
            <div className="mt-3 grid gap-2">
              <KV label="Industry" value={u.currentIndustry} />
              <KV label="Department" value={u.department} />
              <KV label="Role category" value={u.roleCategory} />
              <KV label="Job type" value={u.jobType} />
              <KV label="Employment type" value={u.employmentType} />
              <KV label="Preferred shift" value={u.preferredShift} />
              <KV label="Preferred locations" value={(u.preferredLocations || []).join(', ')} />
              <KV label="Preferred work modes" value={(u.preferredWorkModes || []).join(', ')} />
              <KV label="Open to relocation" value={u.openToRelocation ? 'Yes' : 'No'} />
              <KV label="Current salary" value={u.currentSalary} icon={IndianRupee} />
              <KV label="Expected salary" value={u.expectedSalary} icon={IndianRupee} />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="flex items-center gap-2 display text-lg"><User2 size={16} /> Personal details</h2>
            <div className="mt-3 grid gap-2">
              <KV label="Date of birth" value={u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString() : ''} />
              <KV label="Gender" value={u.gender} cap />
              <KV label="Marital status" value={u.maritalStatus} />
              <KV label="Hometown" value={u.hometown} />
              <KV label="Pincode" value={u.pincode} />
              <KV label="Languages" value={(u.languages || []).join(', ')} icon={Languages} />
              <KV label="Work permits" value={(u.workPermit || []).join(', ')} />
              {u.differentlyAbled && <KV label="Differently abled" value="Yes" />}
            </div>
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
    </div>
  );
}

function KVStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-ink/10 p-3 text-center">
      <p className="display text-xl">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-ink/55">{label}</p>
    </div>
  );
}

function KV({ label, value, cap, icon: Icon }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-cloud/40 px-3 py-2">
      <span className="text-[11px] uppercase tracking-wider text-ink/55">{label}</span>
      <span className={`text-right text-sm font-semibold text-ink/85 ${cap ? 'capitalize' : ''}`}>
        {Icon && <Icon size={11} className="-mt-0.5 mr-1 inline text-ink/55" />}{value}
      </span>
    </div>
  );
}

function Bullet({ label, items }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink/55">{label}</p>
      <ul className="mt-1 list-inside list-disc space-y-0.5 text-[13px] leading-6 text-ink/75">
        {items.map((it) => <li key={it}>{it}</li>)}
      </ul>
    </div>
  );
}

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(+dt)) return '';
  return dt.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}
