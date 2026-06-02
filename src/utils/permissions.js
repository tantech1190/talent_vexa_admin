/**
 * Role-based access control for the admin console.
 *
 * Each role maps to the set of route prefixes that role can open and the
 * set of sidebar nav-link `to` values that should appear for that role.
 *
 * Roles available in mockDb.admins: super-admin, admin, moderator, support.
 */

export const ROLE_ROUTES = {
  'super-admin': '*',
  admin: [
    '/', '/reports',
    '/users', '/users/candidates', '/users/employers', '/users/detail',
    '/companies',
    '/jobs', '/applications', '/categories',
    '/kyc', '/subscriptions', '/reports-queue', '/activity',
    '/templates', '/broadcasts',
    '/me',
  ],
  moderator: [
    '/', '/reports',
    '/users', '/users/candidates', '/users/employers', '/users/detail',
    '/companies',
    '/jobs', '/applications', '/categories',
    '/kyc', '/reports-queue', '/activity',
    '/me',
  ],
  support: [
    '/',
    '/users', '/users/candidates', '/users/employers', '/users/detail',
    '/companies',
    '/applications',
    '/templates', '/broadcasts',
    '/me',
  ],
};

const ALWAYS_ALLOWED = ['/login', '/me'];

const normalize = (path) => {
  if (!path) return '/';
  if (path === '/') return '/';
  return path.replace(/\/+$/, '');
};

export function canAccess(role, path) {
  if (!role) return false;
  const p = normalize(path);
  if (ALWAYS_ALLOWED.includes(p)) return true;

  const allow = ROLE_ROUTES[role];
  if (allow === '*') return true;
  if (!Array.isArray(allow)) return false;

  return allow.some((prefix) => {
    if (prefix === '/') return p === '/';
    return p === prefix || p.startsWith(prefix + '/');
  });
}

export function filterNavLinks(role, links) {
  return links.filter((l) => canAccess(role, l.to));
}

export function landingPathFor(role) {
  if (!role) return '/login';
  if (canAccess(role, '/')) return '/';
  const allow = ROLE_ROUTES[role];
  if (allow === '*') return '/';
  return Array.isArray(allow) && allow.length ? allow[0] : '/login';
}
