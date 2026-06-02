import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { STRINGS } from '../data/translations';

export const SUPPORTED_LOCALES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

const Ctx = createContext(null);
const STORAGE_KEY = 'admin_locale';

export function LocaleProvider({ children }) {
  const [code, setCode] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LOCALES.some((l) => l.code === saved) ? saved : 'en';
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, code); } catch (_) { /* ignore */ }
    if (typeof document !== 'undefined') document.documentElement.lang = code;
  }, [code]);

  const setLocale = useCallback((next) => {
    if (SUPPORTED_LOCALES.some((l) => l.code === next)) setCode(next);
  }, []);

  const t = useCallback((key, vars) => {
    const map = STRINGS[code] || STRINGS.en;
    let value = map[key];
    if (value == null) value = STRINGS.en[key];
    if (value == null) return key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(vars[k]));
      });
    }
    return value;
  }, [code]);

  const current = useMemo(
    () => SUPPORTED_LOCALES.find((l) => l.code === code) || SUPPORTED_LOCALES[0],
    [code],
  );

  const value = useMemo(
    () => ({ code, current, locales: SUPPORTED_LOCALES, setLocale, t }),
    [code, current, setLocale, t],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

export function useT() {
  return useLocale().t;
}
