/**
 * TalentVexa Admin — mock API client.
 *
 * No backend. Every endpoint is resolved against the in-memory mockDb.
 * Mirrors the axios `({ data })` contract so call sites stay clean.
 */
import * as db from '../data/mockDb';

const wait = (ms = 200 + Math.random() * 200) => new Promise((r) => setTimeout(r, ms));
const ok   = async (data) => { await wait(); return { data, status: 200 }; };
const fail = async (status, message) => { await wait(120); const e = new Error(message); e.response = { status, data: { message } }; throw e; };
const norm = (url) => url.split('?')[0].replace(/\/$/, '') || '/';
const matches = (pattern, url) => {
  const p = pattern.replace(/:[^/]+/g, '([^/]+)').replace(/\//g, '\\/');
  const m = url.match(new RegExp(`^${p}$`));
  return m ? m.slice(1) : null;
};

const state = {
  user: null,
  candidates:    [...db.candidates],
  employers:     [...db.employers],
  admins:        [...db.admins],
  companies:     [...db.companies],
  jobs:          [...db.jobs],
  applications:  [...db.applications],
  categories:    [...db.categories],
  kyc:           [...db.kycSubmissions],
  subscriptions: [...db.subscriptions],
  transactions:  [...db.transactions],
  reports:       [...db.reportsQueue],
  activity:      [...db.activity],
  templates:     [...db.emailTemplates],
  broadcasts:    [...db.broadcasts],
  settings:      { ...db.settings },
};

(() => {
  try {
    const t = localStorage.getItem('admin_token');
    if (t === 'demo-admin') state.user = db.admins[0];
  } catch {}
})();

const get = async (url, opts = {}) => {
  const u = norm(url);
  const q = opts.params || {};

  if (u === '/auth/me') {
    if (!state.user) return fail(401, 'Not authenticated');
    return ok({ user: state.user });
  }

  if (u === '/dashboard') return ok({ overview: db.reportsOverview });
  if (u === '/reports')   return ok({ overview: db.reportsOverview });

  if (u === '/users') {
    const role = q.role || 'jobseeker';
    const src = role === 'employer' ? state.employers : role === 'admin' ? state.admins : state.candidates;
    const items = src.filter((u2) => {
      if (q.q) {
        const s = String(q.q).toLowerCase();
        return u2.name.toLowerCase().includes(s) || u2.email.toLowerCase().includes(s);
      }
      return true;
    }).filter((u2) => !q.status || u2.status === q.status);
    return ok({ items, total: items.length });
  }
  {
    const m = matches('/users/:id', u);
    if (m) {
      const all = [...state.candidates, ...state.employers, ...state.admins];
      const user = all.find((x) => x._id === m[0]);
      if (!user) return fail(404, 'Not found');
      const apps = state.applications.filter((a) => a.applicant._id === user._id);
      return ok({ user, applications: apps });
    }
  }

  if (u === '/companies') {
    const items = state.companies.filter((c) => !q.q || c.name.toLowerCase().includes(String(q.q).toLowerCase()));
    return ok({ items, total: items.length });
  }
  {
    const m = matches('/companies/:id', u);
    if (m) {
      const company = state.companies.find((c) => c._id === m[0]);
      if (!company) return fail(404, 'Not found');
      const jobs = state.jobs.filter((j) => j.company._id === company._id);
      return ok({ company, jobs });
    }
  }

  if (u === '/jobs') {
    let items = state.jobs;
    if (q.status) items = items.filter((j) => j.status === q.status);
    if (q.featured === 'true') items = items.filter((j) => j.isFeatured);
    if (q.flagged === 'true')  items = items.filter((j) => j.flagged);
    if (q.q) items = items.filter((j) => j.title.toLowerCase().includes(String(q.q).toLowerCase()));
    return ok({ items, total: items.length });
  }
  {
    const m = matches('/jobs/:id', u);
    if (m) {
      const job = state.jobs.find((j) => j._id === m[0]);
      if (!job) return fail(404, 'Not found');
      return ok({ job });
    }
  }

  if (u === '/applications') {
    let items = state.applications;
    if (q.status) items = items.filter((a) => a.status === q.status);
    if (q.flagged === 'true') items = items.filter((a) => a.flagged);
    return ok({ items, total: items.length });
  }

  if (u === '/categories') return ok({ items: state.categories });

  if (u === '/kyc') {
    let items = state.kyc;
    if (q.status) items = items.filter((k) => k.status === q.status);
    return ok({ items, total: items.length });
  }
  {
    const m = matches('/kyc/:id', u);
    if (m) {
      const kyc = state.kyc.find((k) => k._id === m[0]);
      if (!kyc) return fail(404, 'Not found');
      return ok({ kyc });
    }
  }

  if (u === '/plans')         return ok({ items: db.subscriptionPlans });
  if (u === '/subscriptions') return ok({ items: state.subscriptions });
  if (u === '/transactions')  return ok({ items: state.transactions });

  if (u === '/reports/queue') return ok({ items: state.reports });
  if (u === '/activity')      return ok({ items: state.activity });
  if (u === '/templates')     return ok({ items: state.templates });
  if (u === '/broadcasts')    return ok({ items: state.broadcasts });
  if (u === '/settings')      return ok({ settings: state.settings });

  return fail(404, `GET ${u} not implemented`);
};

const post = async (url, body = {}) => {
  const u = norm(url);

  if (u === '/auth/admin/login') {
    state.user = db.admins[0];
    localStorage.setItem('admin_token', 'demo-admin');
    return ok({ token: 'demo-admin', user: state.user });
  }

  if (u === '/broadcasts') {
    const item = { _id: `bc${Date.now()}`, ...body, sentTo: Math.floor(1000 + Math.random() * 8000), openedRate: 0, sentAt: new Date().toISOString() };
    state.broadcasts.unshift(item);
    return ok({ broadcast: item });
  }

  if (u === '/categories') {
    const item = { _id: `c${Date.now()}`, jobsCount: 0, color: body.color || '#2C7DA0', ...body };
    state.categories.unshift(item);
    return ok({ category: item });
  }

  if (u === '/templates') {
    const item = { _id: `tpl${Date.now()}`, updatedAt: new Date().toISOString(), ...body };
    state.templates.unshift(item);
    return ok({ template: item });
  }

  return fail(404, `POST ${u} not implemented`);
};

const put = async (url, body = {}) => {
  const u = norm(url);

  if (u === '/settings') {
    state.settings = { ...state.settings, ...body };
    return ok({ settings: state.settings });
  }

  // Generic id-based PUTs
  const tryUpdate = (coll, id, patch) => {
    const it = coll.find((x) => x._id === id);
    if (it) Object.assign(it, patch);
    return it;
  };

  // user actions
  {
    const m = matches('/users/:id/block', u);
    if (m) {
      const all = [...state.candidates, ...state.employers];
      const found = all.find((x) => x._id === m[0]);
      if (found) found.status = found.status === 'blocked' ? 'active' : 'blocked';
      return ok({ user: found });
    }
  }
  {
    const m = matches('/users/:id/verify', u);
    if (m) {
      const all = [...state.candidates, ...state.employers];
      const found = all.find((x) => x._id === m[0]);
      if (found) found.status = 'active';
      return ok({ user: found });
    }
  }

  // jobs
  {
    const m = matches('/jobs/:id/feature', u);
    if (m) {
      const j = state.jobs.find((x) => x._id === m[0]);
      if (j) j.isFeatured = !j.isFeatured;
      return ok({ job: j });
    }
  }
  {
    const m = matches('/jobs/:id/unpublish', u);
    if (m) {
      const j = state.jobs.find((x) => x._id === m[0]);
      if (j) j.status = 'closed';
      return ok({ job: j });
    }
  }
  {
    const m = matches('/jobs/:id', u);
    if (m) return ok({ job: tryUpdate(state.jobs, m[0], body) });
  }

  // companies
  {
    const m = matches('/companies/:id/verify', u);
    if (m) {
      const c = state.companies.find((x) => x._id === m[0]);
      if (c) { c.verified = true; c.status = 'active'; }
      return ok({ company: c });
    }
  }
  {
    const m = matches('/companies/:id', u);
    if (m) return ok({ company: tryUpdate(state.companies, m[0], body) });
  }

  // applications
  {
    const m = matches('/applications/:id', u);
    if (m) return ok({ application: tryUpdate(state.applications, m[0], body) });
  }

  // kyc actions
  {
    const m = matches('/kyc/:id/approve', u);
    if (m) {
      const k = state.kyc.find((x) => x._id === m[0]);
      if (k) {
        k.status = 'approved';
        const c = state.companies.find((co) => co._id === k.company._id);
        if (c) { c.verified = true; c.status = 'active'; }
      }
      return ok({ kyc: k });
    }
  }
  {
    const m = matches('/kyc/:id/reject', u);
    if (m) {
      const k = state.kyc.find((x) => x._id === m[0]);
      if (k) k.status = 'rejected';
      return ok({ kyc: k });
    }
  }

  // categories
  {
    const m = matches('/categories/:id', u);
    if (m) return ok({ category: tryUpdate(state.categories, m[0], body) });
  }

  // templates
  {
    const m = matches('/templates/:id', u);
    if (m) return ok({ template: tryUpdate(state.templates, m[0], { ...body, updatedAt: new Date().toISOString() }) });
  }

  // reports
  {
    const m = matches('/reports/:id/resolve', u);
    if (m) {
      const r = state.reports.find((x) => x._id === m[0]);
      if (r) r.status = 'resolved';
      return ok({ report: r });
    }
  }
  {
    const m = matches('/reports/:id/dismiss', u);
    if (m) {
      const r = state.reports.find((x) => x._id === m[0]);
      if (r) r.status = 'dismissed';
      return ok({ report: r });
    }
  }

  return fail(404, `PUT ${u} not implemented`);
};

const del = async (url) => {
  const u = norm(url);
  const drop = (coll, id) => {
    const idx = coll.findIndex((x) => x._id === id);
    if (idx >= 0) coll.splice(idx, 1);
    return idx >= 0;
  };
  {
    const m = matches('/jobs/:id', u);
    if (m) { drop(state.jobs, m[0]); return ok({ removed: true }); }
  }
  {
    const m = matches('/categories/:id', u);
    if (m) { drop(state.categories, m[0]); return ok({ removed: true }); }
  }
  {
    const m = matches('/templates/:id', u);
    if (m) { drop(state.templates, m[0]); return ok({ removed: true }); }
  }
  return fail(404, `DELETE ${u} not implemented`);
};

const api = {
  get, post, put, patch: put, delete: del,
  interceptors: { request: { use: () => {} }, response: { use: () => {} } },
};

export const fileBase = '';
export default api;
