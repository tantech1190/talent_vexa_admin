/**
 * TalentVexa Admin — comprehensive in-memory dummy data.
 * Reset on every page reload. Powers all admin pages without any backend.
 */

const daysAgo  = (d) => new Date(Date.now() - d * 86400000).toISOString();
const hoursAgo = (h) => new Date(Date.now() - h * 3600000).toISOString();
const daysAhead= (d) => new Date(Date.now() + d * 86400000).toISOString();

/* deterministic small rng so the data is stable across reloads */
const rng = (seed) => () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};
const rand = rng(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickN = (arr, n) => {
  const cp = [...arr];
  const out = [];
  for (let i = 0; i < n && cp.length; i++) out.push(cp.splice(Math.floor(rand() * cp.length), 1)[0]);
  return out;
};

const FIRST = ['Aarav','Vihaan','Aditya','Vivaan','Sai','Reyansh','Krishna','Ishaan','Arnav','Ayaan','Aanya','Aadhya','Saanvi','Anika','Diya','Ira','Myra','Pari','Anaya','Riya','Rohan','Karan','Tanvi','Nisha','Priya','Aakash','Pranav','Ananya','Meera','Karthik','Lakshmi','Neha','Ravi','Sneha','Yash','Pooja','Rahul','Kavya','Arjun','Manisha','Aman','Bhavya','Chitra','Deepak','Esha','Farhan','Gauri','Harsh','Indira','Jatin'];
const LAST  = ['Sharma','Verma','Gupta','Iyer','Reddy','Nair','Patel','Rao','Kumar','Singh','Pillai','Joshi','Mehta','Khanna','Mishra','Kapoor','Bansal','Ghosh','Banerjee','Desai','Saxena','Sinha','Choudhary','Yadav','Agarwal','Bhatt','Chandra','Dixit','Goyal','Jain','Kohli','Mukherjee','Pandey'];

const SKILLS = ['React','Node.js','TypeScript','Python','Java','Spring Boot','AWS','Docker','Kubernetes','SQL','MongoDB','GraphQL','Next.js','Vue','Angular','Go','Rust','C++','Figma','Photoshop','Illustrator','Sketch','Adobe XD','UI Design','UX Research','Product Strategy','Roadmap','Agile','Scrum','Analytics','SEO','SEM','Content','Copywriting','Sales','Negotiation','Account Management','CRM','Salesforce','HubSpot','Tableau','PowerBI','Excel','Data Analysis','ML','TensorFlow','PyTorch','Tally','GST','Statutory Compliance','HR Operations','Recruiting','Talent Acquisition'];
const LOCATIONS = ['Bangalore','Mumbai','Delhi NCR','Hyderabad','Pune','Chennai','Kolkata','Ahmedabad','Remote','Jaipur','Noida','Gurgaon'];
const DEPARTMENTS = ['Engineering','Design','Product','Marketing','Sales','HR','Finance','Operations','Customer Success','Data'];
const COMPANY_INDUSTRIES = ['IT / Software', 'Banking & Finance', 'Healthcare', 'Retail / FMCG', 'Manufacturing', 'EdTech', 'Logistics', 'Real Estate', 'Hospitality', 'Media'];
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

/* ───────────────────── Categories ───────────────────── */
export const categories = [
  { _id: 'c1',  name: 'Engineering',         slug: 'engineering',        jobsCount: 412, color: '#2C7DA0' },
  { _id: 'c2',  name: 'Design',              slug: 'design',             jobsCount: 96,  color: '#E8A33D' },
  { _id: 'c3',  name: 'Product',             slug: 'product',            jobsCount: 78,  color: '#7C3AED' },
  { _id: 'c4',  name: 'Marketing',           slug: 'marketing',          jobsCount: 134, color: '#EC4899' },
  { _id: 'c5',  name: 'Sales',               slug: 'sales',              jobsCount: 188, color: '#10B981' },
  { _id: 'c6',  name: 'HR & Recruiting',     slug: 'hr',                 jobsCount: 64,  color: '#F59E0B' },
  { _id: 'c7',  name: 'Finance & Accounts',  slug: 'finance',            jobsCount: 110, color: '#0EA5E9' },
  { _id: 'c8',  name: 'Operations',          slug: 'operations',         jobsCount: 92,  color: '#F43F5E' },
  { _id: 'c9',  name: 'Data & Analytics',    slug: 'data',               jobsCount: 71,  color: '#8B5CF6' },
  { _id: 'c10', name: 'Customer Support',    slug: 'customer-support',   jobsCount: 58,  color: '#06B6D4' },
];

/* ───────────────────── Companies ───────────────────── */
const COMPANY_SEED = [
  { name: 'Aurora Labs',       industry: 'IT / Software',   size: '201-500', verified: true,  rating: 4.6, founded: 2015, hq: 'Bengaluru' },
  { name: 'Vexa Systems',      industry: 'IT / Software',   size: '501-1000', verified: true,  rating: 4.4, founded: 2012, hq: 'Pune' },
  { name: 'Northstar',         industry: 'EdTech',          size: '51-200',  verified: true,  rating: 4.2, founded: 2018, hq: 'Hyderabad' },
  { name: 'Indigo Health',     industry: 'Healthcare',      size: '1000+',   verified: true,  rating: 4.5, founded: 2008, hq: 'Mumbai' },
  { name: 'Quanta',            industry: 'IT / Software',   size: '11-50',   verified: false, rating: 4.0, founded: 2021, hq: 'Bengaluru' },
  { name: 'Helios Capital',    industry: 'Banking & Finance', size: '201-500', verified: true, rating: 4.3, founded: 2010, hq: 'Mumbai' },
  { name: 'Stellar Retail',    industry: 'Retail / FMCG',   size: '1000+',   verified: true,  rating: 3.9, founded: 2002, hq: 'Delhi NCR' },
  { name: 'Orbit Logistics',   industry: 'Logistics',       size: '501-1000', verified: false, rating: 4.1, founded: 2014, hq: 'Chennai' },
  { name: 'Mosaic Media',      industry: 'Media',           size: '51-200',  verified: true,  rating: 4.2, founded: 2017, hq: 'Mumbai' },
  { name: 'Ember Realty',      industry: 'Real Estate',     size: '201-500', verified: true,  rating: 4.0, founded: 2009, hq: 'Gurgaon' },
  { name: 'Forge Manufacturing', industry: 'Manufacturing', size: '1000+',  verified: true,  rating: 3.8, founded: 1998, hq: 'Pune' },
  { name: 'Lumen Hospitality', industry: 'Hospitality',     size: '201-500', verified: false, rating: 4.1, founded: 2016, hq: 'Jaipur' },
  { name: 'Cipher Analytics',  industry: 'IT / Software',   size: '11-50',   verified: true,  rating: 4.7, founded: 2020, hq: 'Bengaluru' },
  { name: 'Pulse Diagnostics', industry: 'Healthcare',      size: '201-500', verified: true,  rating: 4.3, founded: 2013, hq: 'Hyderabad' },
  { name: 'Bloom EdTech',      industry: 'EdTech',          size: '51-200',  verified: false, rating: 4.0, founded: 2019, hq: 'Bengaluru' },
];

export const companies = COMPANY_SEED.map((c, i) => ({
  _id: `co${i + 1}`,
  ...c,
  status: c.verified ? 'active' : (i % 3 === 0 ? 'pending' : 'active'),
  jobsCount: 3 + Math.floor(rand() * 22),
  candidatesViewed: 50 + Math.floor(rand() * 600),
  applicationsCount: 80 + Math.floor(rand() * 900),
  hiresCount: 2 + Math.floor(rand() * 28),
  subscription: pick(['free', 'starter', 'growth', 'enterprise']),
  recruitersCount: 1 + Math.floor(rand() * 12),
  createdAt: daysAgo(20 + i * 5),
  contactEmail: `recruit@${c.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
  contactPhone: `+91 ${80000 + i * 1000}-${10000 + i * 11}`,
  flagged: i === 4 || i === 11,
}));

/* ───────────────────── Users (candidates + employers + admins) ───────────────────── */
export const candidates = Array.from({ length: 56 }, (_, i) => {
  const f = pick(FIRST);
  const l = pick(LAST);
  const skillSet = pickN(SKILLS, 5 + Math.floor(rand() * 6));
  const yrs = Math.floor(rand() * 18);
  const headline = pick(['Senior Frontend Engineer','Product Designer','Data Analyst','HR Manager','Sales Executive','Full-stack Developer','Marketing Specialist','Customer Success Lead','Java Backend Engineer','iOS Engineer']);
  return {
    _id: `cand${i + 1}`,
    name: `${f} ${l}`,
    email: `${f.toLowerCase()}.${l.toLowerCase()}@example.com`,
    phone: `+91 9${Math.floor(100000000 + rand() * 899999999)}`.slice(0, 14),
    role: 'jobseeker',
    status: rand() > 0.04 ? 'active' : (rand() > 0.5 ? 'blocked' : 'pending'),
    headline,
    location: pick(LOCATIONS),
    totalExperienceYears: yrs,
    skills: skillSet,
    profileCompleteness: 30 + Math.floor(rand() * 70),
    resumeUrl: rand() > 0.18 ? '/uploads/sample.pdf' : null,
    profilePicture: rand() > 0.5 ? '' : '',
    appliedCount: Math.floor(rand() * 35),
    profileViews: Math.floor(rand() * 220),
    lastActiveAt: daysAgo(Math.floor(rand() * 30)),
    createdAt: daysAgo(10 + Math.floor(rand() * 200)),
    flagged: i % 23 === 0,
    about: `Experienced ${headline.toLowerCase()} with ${yrs} years building shipping products end-to-end.`,
    currentTitle: headline,
    currentCompany: pick(COMPANY_SEED).name,
    currentIndustry: pick(['IT Services', 'Product / SaaS', 'Banking & Finance', 'Healthtech', 'Consumer Internet']),
    department: pick(['Engineering', 'Design', 'Sales', 'Marketing', 'HR']),
    roleCategory: headline,
    jobType: pick(['Permanent', 'Contract', 'Internship', 'Temporary']),
    employmentType: rand() > 0.85 ? 'Part-time' : 'Full-time',
    preferredShift: pick(['Day', 'Night', 'Flexible', 'Rotational']),
    currentSalary: `${4 + Math.floor(rand() * 20)} LPA`,
    expectedSalary: `${8 + Math.floor(rand() * 20)} LPA`,
    noticePeriod: pick(['Immediate', '15 days', '30 days', '60 days', '90 days']),
    education: [{
      degree: pick(['B.E', 'B.Tech', 'BSc', 'MBA', 'M.Tech']),
      fieldOfStudy: pick(['Computer Science', 'Information Tech', 'Electronics', 'Business Admin']),
      institute: pick(['IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'IIM Ahmedabad']),
      startYear: 2008 + Math.floor(rand() * 10),
      endYear: 2012 + Math.floor(rand() * 10),
    }],
    experience: [
      { title: headline, company: pick(COMPANY_SEED).name, from: daysAgo(yrs * 365), to: null, currentlyWorking: true, description: 'Leading initiatives across the product and platform.' },
      { title: 'Software Engineer', company: pick(COMPANY_SEED).name, from: daysAgo((yrs + 3) * 365), to: daysAgo(yrs * 365), description: 'Built core features and mentored junior engineers.' },
    ],
    itSkills: skillSet.slice(0, 4).map((s, k) => ({
      name: s, version: '', experienceYears: Math.max(1, yrs - k),
      lastUsedYear: 2026 - (k % 3), proficiency: ['Beginner', 'Intermediate', 'Advanced', 'Expert'][(yrs + k) % 4],
    })),
    projects: i % 2 === 0 ? [{
      title: `${headline} project`, role: yrs > 5 ? 'Tech lead' : 'Engineer', client: pick(COMPANY_SEED).name,
      from: daysAgo(yrs * 180), to: daysAgo((yrs - 1) * 180), currentlyWorking: false,
      technologies: skillSet.slice(0, 3), link: '',
      description: 'Led the modernisation of the core surface; delivered 30% perf improvement.',
    }] : [],
    certifications: i % 3 === 0 ? ['AWS Solutions Architect — Associate'] : [],
    awards: i % 4 === 0 ? ['Employee of the year 2024'] : [],
    publications: [], patents: [],
    linkedinUrl: `https://linkedin.com/in/${f.toLowerCase()}-${l.toLowerCase()}`,
    githubUrl: i % 2 === 0 ? `https://github.com/${f.toLowerCase()}${l.toLowerCase()}` : '',
    portfolioUrl: i % 5 === 0 ? `https://${f.toLowerCase()}.dev` : '',
    preferredLocations: [pick(LOCATIONS), pick(LOCATIONS)],
    preferredWorkModes: i % 3 === 0 ? ['remote'] : i % 3 === 1 ? ['hybrid'] : ['onsite'],
    languages: ['English', 'Hindi'],
    dateOfBirth: `${1985 + (i % 15)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 27)).padStart(2, '0')}`,
    gender: pick(['male', 'female', 'female', 'male', 'non-binary']),
    maritalStatus: pick(['Single', 'Married', 'Prefer not to say']),
    hometown: pick(LOCATIONS),
    permanentAddress: '',
    pincode: `${560000 + (i * 13) % 99999}`,
    workPermit: i % 5 === 0 ? ['USA'] : [],
    differentlyAbled: false,
    openToRelocation: i % 2 === 0,
    openToOpportunities: true,
  };
});

export const employers = COMPANY_SEED.flatMap((c, ci) =>
  Array.from({ length: 1 + Math.floor(rand() * 3) }, (_, ri) => {
    const f = pick(FIRST);
    const l = pick(LAST);
    return {
      _id: `emp${ci}-${ri}`,
      name: `${f} ${l}`,
      email: `${f.toLowerCase()}.${l.toLowerCase()}@${c.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      phone: `+91 9${Math.floor(100000000 + rand() * 899999999)}`.slice(0, 14),
      role: 'employer',
      status: rand() > 0.05 ? 'active' : (rand() > 0.5 ? 'blocked' : 'pending'),
      company: { _id: `co${ci + 1}`, name: c.name },
      designation: pick(['Talent Acquisition Lead','HR Manager','Senior Recruiter','Hiring Manager','Founder & CEO','VP People','TA Specialist']),
      jobsPosted: Math.floor(rand() * 18),
      hiresCount: Math.floor(rand() * 9),
      lastActiveAt: daysAgo(Math.floor(rand() * 30)),
      createdAt: daysAgo(20 + Math.floor(rand() * 365)),
    };
  })
);

export const admins = [
  { _id: 'admin1', name: 'TalentVexa Admin', email: 'admin@talentvexa.com', role: 'super-admin', lastLoginAt: hoursAgo(2), status: 'active' },
  { _id: 'admin2', name: 'Priya Verma',      email: 'priya@talentvexa.com', role: 'admin',       lastLoginAt: hoursAgo(8), status: 'active' },
  { _id: 'admin3', name: 'Niraj Iyer',       email: 'niraj@talentvexa.com', role: 'moderator',   lastLoginAt: daysAgo(2),  status: 'active' },
  { _id: 'admin4', name: 'Sneha Kapoor',     email: 'sneha@talentvexa.com', role: 'support',     lastLoginAt: daysAgo(5),  status: 'active' },
];

/* ───────────────────── Jobs ───────────────────── */
const TITLES = ['Senior React Engineer','Product Designer','Data Engineer','Growth Marketer','iOS Engineer','Customer Success Lead','Java Backend Developer','HR Business Partner','Full-stack Engineer','Marketing Manager','Account Executive','UX Researcher','DevOps Engineer','Finance Analyst','Operations Lead','Sales Manager','Content Strategist','QA Engineer','Mobile Engineer','Tech Lead'];
const JOB_TYPES = ['full-time','full-time','full-time','contract','internship','part-time'];
const WORK_MODES = ['onsite','remote','hybrid'];

export const jobs = Array.from({ length: 96 }, (_, i) => {
  const company = pick(companies);
  const cat = pick(categories);
  const title = pick(TITLES);
  const minExp = Math.floor(rand() * 10);
  const maxExp = minExp + 2 + Math.floor(rand() * 6);
  const minSal = 400000 + Math.floor(rand() * 2000000);
  const maxSal = minSal + 200000 + Math.floor(rand() * 2000000);
  return {
    _id: `job${i + 1}`,
    title,
    company: { _id: company._id, name: company.name, verified: company.verified },
    category: { _id: cat._id, name: cat.name, color: cat.color },
    location: pick(LOCATIONS),
    workMode: pick(WORK_MODES),
    jobType: pick(JOB_TYPES),
    experienceMin: minExp,
    experienceMax: maxExp,
    salaryMin: minSal,
    salaryMax: maxSal,
    vacancies: 1 + Math.floor(rand() * 8),
    applicationsCount: Math.floor(rand() * 220),
    views: Math.floor(rand() * 4000),
    status: rand() > 0.08 ? 'active' : (rand() > 0.5 ? 'closed' : 'draft'),
    isFeatured: i % 8 === 0,
    isHot:      i % 11 === 0,
    flagged:    i % 27 === 0,
    skills: pickN(SKILLS, 3 + Math.floor(rand() * 4)),
    postedAt: daysAgo(Math.floor(rand() * 60)),
    expiresAt: daysAhead(20 + Math.floor(rand() * 40)),
  };
});

/* ───────────────────── Applications ───────────────────── */
const APP_STATUSES = ['applied', 'shortlisted', 'interview', 'offered', 'hired', 'rejected', 'on-hold'];
export const applications = Array.from({ length: 180 }, (_, i) => {
  const cand = pick(candidates);
  const job  = pick(jobs);
  return {
    _id: `appn${i + 1}`,
    applicant: { _id: cand._id, name: cand.name, email: cand.email, headline: cand.headline, location: cand.location },
    job: { _id: job._id, title: job.title, company: job.company },
    status: pick(APP_STATUSES),
    rating: Math.floor(rand() * 6),
    isStarred: rand() > 0.78,
    flagged: rand() > 0.95,
    source: pick(['direct', 'referral', 'job-board', 'campus', 'resdex']),
    expectedSalary: `₹${(8 + Math.floor(rand() * 40))} LPA`,
    appliedAt: daysAgo(Math.floor(rand() * 45)),
  };
});

/* ───────────────────── KYC Verification queue ───────────────────── */
export const kycSubmissions = Array.from({ length: 14 }, (_, i) => {
  const company = companies[i % companies.length];
  return {
    _id: `kyc${i + 1}`,
    company: { _id: company._id, name: company.name, industry: company.industry, size: company.size, hq: company.hq, contactEmail: company.contactEmail },
    submittedBy: pick(employers).name,
    submittedAt: daysAgo(Math.floor(rand() * 7)),
    status: i < 6 ? 'pending' : (i < 10 ? 'under-review' : (i < 12 ? 'approved' : 'rejected')),
    legalName: company.name + (rand() > 0.5 ? ' Pvt Ltd' : ' Technologies'),
    pan: 'AAACA' + (1000 + i) + 'A',
    gstin: '29ABCDE' + (1234 + i) + 'F1Z5',
    cin: 'U72200KA' + (2015 + (i % 8)) + 'PTC' + (100000 + i * 17),
    documents: {
      pan:   '/uploads/pan-' + (i + 1) + '.pdf',
      gst:   rand() > 0.3 ? '/uploads/gst-' + (i + 1) + '.pdf' : null,
      auth:  '/uploads/auth-' + (i + 1) + '.pdf',
      cheque: rand() > 0.5 ? '/uploads/cheque-' + (i + 1) + '.pdf' : null,
      coi:   rand() > 0.5 ? '/uploads/coi-' + (i + 1) + '.pdf' : null,
    },
    verificationPath: rand() > 0.5 ? 'self' : 'assisted',
    notes: i % 4 === 0 ? 'Recruiter mentioned urgent hiring for 12 SDE-II roles.' : '',
  };
});

/* ───────────────────── Subscriptions / Plans / Transactions ───────────────────── */
export const subscriptionPlans = [
  { _id: 'plan-free',       name: 'Free',       price: 0,     billing: 'monthly', activeSubs: 312, jobPosts: 1,   credits: 0   },
  { _id: 'plan-starter',    name: 'Starter',    price: 4999,  billing: 'monthly', activeSubs: 88,  jobPosts: 10,  credits: 250  },
  { _id: 'plan-growth',     name: 'Growth',     price: 14999, billing: 'monthly', activeSubs: 36,  jobPosts: 40,  credits: 1500 },
  { _id: 'plan-enterprise', name: 'Enterprise', price: 0,     billing: 'custom',  activeSubs: 12,  jobPosts: 999, credits: 9999 },
];

export const subscriptions = companies.map((c, i) => ({
  _id: `sub${i + 1}`,
  company: { _id: c._id, name: c.name },
  plan: c.subscription,
  status: i % 9 === 0 ? 'cancelled' : (i % 13 === 0 ? 'past-due' : 'active'),
  amount: c.subscription === 'enterprise' ? 199000 : c.subscription === 'growth' ? 14999 : c.subscription === 'starter' ? 4999 : 0,
  billingCycle: c.subscription === 'enterprise' ? 'annual' : 'monthly',
  startedAt:  daysAgo(30 + i * 11),
  renewsAt:   daysAhead(15 + (i % 25)),
  invoicesCount: 3 + Math.floor(rand() * 22),
}));

export const transactions = Array.from({ length: 40 }, (_, i) => {
  const c = pick(companies);
  return {
    _id: `txn${1000 + i}`,
    company: { _id: c._id, name: c.name },
    amount: pick([4999, 14999, 4999, 14999, 199000]),
    status: rand() > 0.07 ? 'paid' : (rand() > 0.5 ? 'pending' : 'failed'),
    method: pick(['UPI', 'Card', 'NetBanking', 'Bank transfer']),
    invoiceNo: `INV-${2024}${String(1000 + i).padStart(4, '0')}`,
    createdAt: daysAgo(Math.floor(rand() * 30)),
  };
});

/* ───────────────────── Flagged content / Reports / Trust & Safety ───────────────────── */
export const reportsQueue = [
  { _id: 'r1', kind: 'job',     subject: 'Senior PHP Developer · QuickCash',   reason: 'Suspected payment-to-apply scam',         reporter: pick(candidates).name, status: 'open',     severity: 'high',   createdAt: hoursAgo(3) },
  { _id: 'r2', kind: 'user',    subject: 'Rohit K. (rohit@spam.example.com)',  reason: 'Spamming recruiters with copy-paste',     reporter: 'System', status: 'open',     severity: 'medium', createdAt: hoursAgo(7) },
  { _id: 'r3', kind: 'message', subject: 'Aurora Labs → Priya M.',              reason: 'Off-platform contact request',            reporter: pick(candidates).name, status: 'open',     severity: 'low',    createdAt: hoursAgo(14) },
  { _id: 'r4', kind: 'job',     subject: 'Marketing Intern · Helios (unpaid)', reason: 'Unpaid internship policy violation',      reporter: pick(candidates).name, status: 'under-review', severity: 'medium', createdAt: daysAgo(1) },
  { _id: 'r5', kind: 'user',    subject: 'Fake recruiter account flagged',     reason: 'Profile claims false company affiliation', reporter: 'System', status: 'open',     severity: 'high',   createdAt: daysAgo(1) },
  { _id: 'r6', kind: 'message', subject: 'Bulk DM detected',                    reason: 'Recruiter exceeded outreach rate-limit',   reporter: 'System', status: 'resolved', severity: 'low',    createdAt: daysAgo(2) },
  { _id: 'r7', kind: 'job',     subject: 'Tally Operator (no salary, no JD)',  reason: 'Incomplete job description',              reporter: pick(candidates).name, status: 'open',     severity: 'low',    createdAt: daysAgo(2) },
  { _id: 'r8', kind: 'user',    subject: 'Duplicate candidate profiles',       reason: '3 accounts on same phone number',         reporter: 'System', status: 'open',     severity: 'medium', createdAt: daysAgo(3) },
];

/* ───────────────────── Activity / Audit log ───────────────────── */
const ADMIN_ACTIONS = [
  { actor: 'Priya Verma',  action: 'kyc.approve',    target: 'Aurora Labs',         note: 'All documents verified.' },
  { actor: 'TalentVexa Admin',  action: 'user.suspend',   target: 'fake-recruiter@x.com',note: 'Reported by 3 candidates.' },
  { actor: 'Niraj Iyer',   action: 'job.unpublish',  target: 'Senior PHP · QuickCash', note: 'Suspected scam — removed.' },
  { actor: 'Priya Verma',  action: 'plan.refund',    target: 'INV-20241193',        note: 'Customer cancellation < 14 days.' },
  { actor: 'TalentVexa Admin',  action: 'broadcast.send', target: 'All employers',       note: 'Maintenance window notice.' },
  { actor: 'Niraj Iyer',   action: 'report.resolve', target: 'r6 — Bulk DM',        note: 'Rate-limit applied to account.' },
  { actor: 'Priya Verma',  action: 'company.verify', target: 'Cipher Analytics',    note: 'Manual review complete.' },
  { actor: 'Sneha Kapoor', action: 'template.create',target: 'Welcome email (v3)',  note: '' },
];
export const activity = Array.from({ length: 24 }, (_, i) => ({
  _id: `act${i + 1}`,
  ...ADMIN_ACTIONS[i % ADMIN_ACTIONS.length],
  createdAt: hoursAgo(i * 6 + 1),
}));

/* ───────────────────── Email templates (system) ───────────────────── */
export const emailTemplates = [
  { _id: 'tpl1', name: 'Candidate welcome',        category: 'welcome',    subject: 'Welcome to TalentVexa, {{name}}!',              updatedAt: daysAgo(8), shared: true,  body: 'Hi {{name}},\n\nWelcome aboard…' },
  { _id: 'tpl2', name: 'Application received',     category: 'application',subject: 'We received your application for {{job}}',     updatedAt: daysAgo(15),shared: true,  body: 'Hi {{name}},\n\nThanks for applying to {{job}} at {{company}}…' },
  { _id: 'tpl3', name: 'Interview invite',         category: 'interview',  subject: 'Interview invitation — {{job}} at {{company}}',updatedAt: daysAgo(3), shared: true,  body: '…' },
  { _id: 'tpl4', name: 'Offer letter',             category: 'offer',      subject: 'Your offer letter from {{company}}',           updatedAt: daysAgo(22),shared: true,  body: '…' },
  { _id: 'tpl5', name: 'Plan renewal reminder',    category: 'billing',    subject: 'Your {{plan}} plan renews in 7 days',          updatedAt: daysAgo(40),shared: false, body: '…' },
  { _id: 'tpl6', name: 'KYC approved',             category: 'transactional', subject: 'Your company verification is approved 🎉',  updatedAt: daysAgo(1), shared: true,  body: '…' },
  { _id: 'tpl7', name: 'Job alert digest (weekly)', category: 'alert',     subject: 'This week\'s new jobs for you',                updatedAt: daysAgo(4), shared: true,  body: '…' },
];

/* ───────────────────── Broadcasts (admin → users) ───────────────────── */
export const broadcasts = [
  { _id: 'bc1', audience: 'all',           subject: 'Scheduled maintenance — Sunday 02:00–03:00 IST',  sentTo: 12450, openedRate: 0.62, sentAt: daysAgo(6) },
  { _id: 'bc2', audience: 'employers',     subject: 'Resdex 2.0 is here — boolean & saved searches',   sentTo: 1840,  openedRate: 0.71, sentAt: daysAgo(12) },
  { _id: 'bc3', audience: 'candidates',    subject: '5 new ways to make your profile stand out',       sentTo: 10610, openedRate: 0.54, sentAt: daysAgo(18) },
];

/* ───────────────────── Reports / Analytics ───────────────────── */
export const reportsOverview = {
  kpis: {
    totalUsers:        candidates.length + employers.length,
    totalCandidates:   candidates.length,
    totalEmployers:    employers.length,
    totalCompanies:    companies.length,
    activeJobs:        jobs.filter((j) => j.status === 'active').length,
    totalJobs:         jobs.length,
    totalApplications: applications.length,
    hires:             applications.filter((a) => a.status === 'hired').length,
    mrr:               12_45_000,
    pendingKyc:        kycSubmissions.filter((k) => k.status === 'pending' || k.status === 'under-review').length,
    openReports:       reportsQueue.filter((r) => r.status === 'open').length,
  },
  signupsByDay: Array.from({ length: 30 }, (_, i) => ({
    date: daysAgo(29 - i).slice(0, 10),
    candidates: 30 + Math.floor(rand() * 80),
    employers:  4 + Math.floor(rand() * 14),
  })),
  funnel: {
    visits:        82540,
    signups:        4280,
    profileDone:    3010,
    applied:        2270,
    interviewed:     980,
    hired:           312,
  },
  topEmployers: companies
    .slice(0, 8)
    .sort((a, b) => b.hiresCount - a.hiresCount)
    .map((c) => ({ company: c.name, hires: c.hiresCount, applications: c.applicationsCount })),
  jobsByCategory: categories.map((c) => ({ name: c.name, jobs: c.jobsCount, color: c.color })),
};

/* ───────────────────── Site settings / Feature flags ───────────────────── */
export const settings = {
  features: {
    publicRegistration:    true,
    employerKycRequired:   true,
    boostedJobs:           true,
    resdexBoolean:         true,
    selfServeBilling:      true,
    pushNotifications:     false,
    walkInJobs:            true,
  },
  branding: {
    siteName:  'TalentVexa',
    tagline:   'Smart Hiring Starts Here',
    primary:   '#2C7DA0',
    accent:    '#E8A33D',
  },
  limits: {
    maxJobPostsFree:     1,
    maxResumesPerSearch: 100,
    rateLimitOutreach:   80,
  },
};
