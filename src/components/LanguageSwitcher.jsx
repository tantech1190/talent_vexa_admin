import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLocale } from '../context/LocaleContext';

export default function LanguageSwitcher() {
  const { code, locales, current, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        title={t('topbar.language')}
        className="flex h-10 items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-2.5 text-ink/70 hover:border-cobalt/50 hover:text-cobalt"
      >
        <Globe size={15} />
        <span className="hidden text-xs font-semibold uppercase tracking-wider sm:inline">
          {current.code}
        </span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-pop">
            <div className="border-b border-ink/5 px-4 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50">
                {t('topbar.language')}
              </p>
            </div>
            {locales.map((loc) => {
              const selected = loc.code === code;
              return (
                <button
                  key={loc.code}
                  type="button"
                  onClick={() => { setLocale(loc.code); setOpen(false); }}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-cream ${
                    selected ? 'bg-cobalt/5' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`truncate font-semibold ${selected ? 'text-cobalt-700' : 'text-ink'}`}>
                      {loc.native}
                    </p>
                    <p className="truncate text-[11px] text-ink/55">{loc.label}</p>
                  </div>
                  {selected && <Check size={14} className="text-cobalt" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
