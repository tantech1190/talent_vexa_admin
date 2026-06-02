import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Protected from './components/Protected';
import RoleGuard from './components/RoleGuard';

import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Users         from './pages/Users';
import UserDetail    from './pages/UserDetail';
import Companies     from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Jobs          from './pages/Jobs';
import JobDetail     from './pages/JobDetail';
import Applications  from './pages/Applications';
import Categories    from './pages/Categories';
import Kyc           from './pages/Kyc';
import Subscriptions from './pages/Subscriptions';
import Reports       from './pages/Reports';
import ReportsQueue  from './pages/ReportsQueue';
import ActivityLog   from './pages/ActivityLog';
import EmailTemplates from './pages/EmailTemplates';
import Broadcasts    from './pages/Broadcasts';
import Settings      from './pages/Settings';
import AdminProfile  from './pages/AdminProfile';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Protected><AdminLayout /></Protected>}>
        <Route path="/" element={<RoleGuard><Dashboard /></RoleGuard>} />
        <Route path="/reports" element={<RoleGuard><Reports /></RoleGuard>} />

        {/* People */}
        <Route path="/users" element={<Navigate to="/users/candidates" replace />} />
        <Route path="/users/:role" element={<RoleGuard><Users /></RoleGuard>} />
        <Route path="/users/detail/:id" element={<RoleGuard><UserDetail /></RoleGuard>} />
        <Route path="/companies" element={<RoleGuard><Companies /></RoleGuard>} />
        <Route path="/companies/:id" element={<RoleGuard><CompanyDetail /></RoleGuard>} />

        {/* Content */}
        <Route path="/jobs" element={<RoleGuard><Jobs /></RoleGuard>} />
        <Route path="/jobs/:id" element={<RoleGuard><JobDetail /></RoleGuard>} />
        <Route path="/applications" element={<RoleGuard><Applications /></RoleGuard>} />
        <Route path="/categories" element={<RoleGuard><Categories /></RoleGuard>} />

        {/* Ops */}
        <Route path="/kyc" element={<RoleGuard><Kyc /></RoleGuard>} />
        <Route path="/subscriptions" element={<RoleGuard><Subscriptions /></RoleGuard>} />
        <Route path="/reports-queue" element={<RoleGuard><ReportsQueue /></RoleGuard>} />
        <Route path="/activity" element={<RoleGuard><ActivityLog /></RoleGuard>} />

        {/* Comms */}
        <Route path="/templates" element={<RoleGuard><EmailTemplates /></RoleGuard>} />
        <Route path="/broadcasts" element={<RoleGuard><Broadcasts /></RoleGuard>} />

        {/* System */}
        <Route path="/settings" element={<RoleGuard><Settings /></RoleGuard>} />
        <Route path="/me" element={<AdminProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
