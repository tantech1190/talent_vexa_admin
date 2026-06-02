import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canAccess, landingPathFor } from '../utils/permissions';

export default function RoleGuard({ children }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user) return <Navigate to="/login" replace />;
  if (canAccess(user.role, pathname)) return children;

  return <NoAccess role={user.role} />;
}

function NoAccess({ role }) {
  const home = landingPathFor(role);
  return (
    <div className="card mx-auto mt-12 max-w-xl p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-coral/15 text-coral">
        <ShieldAlert size={20} />
      </div>
      <h1 className="display mt-4 text-2xl">Access restricted</h1>
      <p className="mt-2 text-sm text-ink/60">
        Your role <span className="chip-gold capitalize">{role}</span> doesn't have access to this section.
      </p>
      <a href={home} className="btn-primary mt-5 inline-flex">Go to dashboard</a>
    </div>
  );
}
