import { useEffect, useState } from 'react';
import { BarChart3, Users, Briefcase, TrendingUp } from 'lucide-react';
import api from '../api/client';
import ExportMenu from '../components/ExportMenu';
import { useLocale } from '../context/LocaleContext';

const pct = (n, total) => total ? `${Math.round((n / total) * 100)}%` : '0%';

export default function Reports() {
  const { t } = useLocale();
  const [d, setD] = useState(null);
  useEffect(() => { api.get('/reports').then((r) => setD(r.data.overview)); }, []);

  if (!d) return <div className="card p-10 text-center text-ink/55">{t('common.loading')}</div>;

  const max = Math.max(...d.signupsByDay.map((p) => p.candidates + p.employers));

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="section-eyebrow"><BarChart3 size={12} /> {t('reports.title')}</span>
          <h1 className="display mt-2 text-3xl">{t('reports.title')}</h1>
          <p className="mt-1 text-sm text-ink/60">{t('reports.subtitle')}</p>
        </div>
        <ExportMenu
          label="Export full report"
          title={`Platform report · ${new Date().toLocaleDateString()}`}
          filename={`platform-report-${new Date().toISOString().slice(0, 10)}`}
          meta={{
            'Visits': d.funnel?.visits ?? 0,
            'Signups': d.funnel?.signups ?? 0,
            'Applied': d.funnel?.applied ?? 0,
            'Hired': d.funnel?.hired ?? 0,
          }}
          sections={[
            {
              title: '1. Conversion funnel',
              head: ['Stage', 'Count', 'Conversion from visits %'],
              body: [
                ['Visits', d.funnel?.visits ?? 0, '100%'],
                ['Signups', d.funnel?.signups ?? 0, pct(d.funnel?.signups, d.funnel?.visits)],
                ['Profile completed', d.funnel?.profileDone ?? 0, pct(d.funnel?.profileDone, d.funnel?.visits)],
                ['Applied', d.funnel?.applied ?? 0, pct(d.funnel?.applied, d.funnel?.visits)],
                ['Interviewed', d.funnel?.interviewed ?? 0, pct(d.funnel?.interviewed, d.funnel?.visits)],
                ['Hired', d.funnel?.hired ?? 0, pct(d.funnel?.hired, d.funnel?.visits)],
              ],
            },
            {
              title: '2. Daily signups (last 30 days)',
              head: ['Date', 'Candidates', 'Employers', 'Total'],
              body: (d.signupsByDay || []).map((p) => [p.date, p.candidates, p.employers, p.candidates + p.employers]),
            },
            {
              title: '3. Jobs by category',
              head: ['Category', 'Jobs'],
              body: (d.jobsByCategory || []).map((c) => [c.name, c.jobs]),
            },
            {
              title: '4. Top hiring employers',
              head: ['Rank', 'Company', 'Applications', 'Hires'],
              body: (d.topEmployers || []).map((c, i) => [i + 1, c.company, c.applications, c.hires]),
            },
          ]}
        />
      </header>

      {/* Signup bar chart */}
      <section className="card p-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Daily signups · last 30 days</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cobalt" /> Candidates</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-coral" /> Employers</span>
          </div>
        </div>
        <div className="mt-4 flex h-44 items-end gap-1">
          {d.signupsByDay.map((p) => {
            const tot = p.candidates + p.employers;
            const h = (tot / max) * 100;
            const candH = (p.candidates / tot) * h;
            const empH  = (p.employers / tot) * h;
            return (
              <div key={p.date} className="group relative flex flex-1 flex-col items-center justify-end">
                <div className="w-full overflow-hidden rounded-md bg-ink/5" style={{ height: `${h}%` }}>
                  <div className="w-full bg-coral" style={{ height: `${(empH / h) * 100}%` }} />
                  <div className="w-full bg-cobalt" style={{ height: `${(candH / h) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two-column charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Jobs by category</p>
          <div className="mt-4 space-y-2">
            {d.jobsByCategory.map((c) => {
              const maxJ = Math.max(...d.jobsByCategory.map((x) => x.jobs));
              const pct = (c.jobs / maxJ) * 100;
              return (
                <div key={c.name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-semibold text-ink/70">{c.name}</span>
                    <span className="text-ink/55">{c.jobs}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink/5">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Conversion funnel</p>
          <div className="mt-4 space-y-2.5">
            {[
              { label: 'Visits',       value: d.funnel.visits,        tone: 'bg-cobalt' },
              { label: 'Signups',      value: d.funnel.signups,       tone: 'bg-violet-500' },
              { label: 'Profile done', value: d.funnel.profileDone,   tone: 'bg-coral' },
              { label: 'Applied',      value: d.funnel.applied,       tone: 'bg-emerald-500' },
              { label: 'Interviewed',  value: d.funnel.interviewed,   tone: 'bg-sky-500' },
              { label: 'Hired',        value: d.funnel.hired,         tone: 'bg-gold' },
            ].map((row, _, arr) => {
              const max = arr[0].value;
              const pct = (row.value / max) * 100;
              return (
                <div key={row.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-semibold text-ink/70">{row.label}</span>
                    <span className="text-ink/55">{row.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink/5">
                    <div className={`${row.tone} h-full rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="card p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Top hiring employers</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {d.topEmployers.map((c, i) => (
            <div key={c.company} className="rounded-2xl border border-ink/10 p-3">
              <p className="text-[10px] uppercase tracking-wider text-ink/45">#{i + 1}</p>
              <p className="display text-lg">{c.company}</p>
              <p className="mt-1 text-xs text-ink/55">{c.applications} apps · {c.hires} hires</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
