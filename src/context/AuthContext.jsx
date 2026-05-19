import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { setLoading(false); return; }
    api.get('/auth/me')
      .then((r) => setUser(r.data.user))
      .catch(() => localStorage.removeItem('admin_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (payload) => {
    const { data } = await api.post('/auth/admin/login', payload);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
