import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Protected from './components/Protected';

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
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />

        {/* People */}
        <Route path="/users" element={<Navigate to="/users/candidates" replace />} />
        <Route path="/users/:role" element={<Users />} />
        <Route path="/users/detail/:id" element={<UserDetail />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />

        {/* Content */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/categories" element={<Categories />} />

        {/* Ops */}
        <Route path="/kyc" element={<Kyc />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/reports-queue" element={<ReportsQueue />} />
        <Route path="/activity" element={<ActivityLog />} />

        {/* Comms */}
        <Route path="/templates" element={<EmailTemplates />} />
        <Route path="/broadcasts" element={<Broadcasts />} />

        {/* System */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/me" element={<AdminProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
