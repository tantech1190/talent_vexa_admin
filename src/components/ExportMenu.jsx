import { useState } from 'react';
import { Download, FileDown, FileSpreadsheet, Printer } from 'lucide-react';
import {
  downloadCsv, downloadExcel, downloadPdf, downloadFullPdf, sectionsToRows, printPage,
} from '../utils/exporter';

/**
 * Drop-in export menu used across admin pages.
 *
 * Modes:
 *  - Single table  → pass `rows` (header row first)
 *  - Multi-section → pass `sections=[{title, subtitle?, head, body}]` (+ optional `meta`)
 */
export default function ExportMenu({
  label = 'Export',
  rows,
  sections,
  meta,
  filename,
  title,
  align = 'right',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const flatRows = sections ? sectionsToRows(title || filename, sections, meta) : rows;

  const runPdf = () => {
    if (sections) downloadFullPdf(filename, title || filename, sections, meta || {});
    else downloadPdf(filename, rows, title);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-cobalt/40 hover:text-cobalt"
      >
        <Download size={13} /> {label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className={`absolute z-40 mt-1 w-44 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-lg ${align === 'left' ? 'left-0' : 'right-0'}`}>
            <button
              onClick={() => { setOpen(false); downloadExcel(filename, flatRows); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-cream"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" /> Excel (.xlsx)
            </button>
            <button
              onClick={() => { setOpen(false); downloadCsv(filename, flatRows); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-cream"
            >
              <FileDown size={14} className="text-cobalt" /> CSV
            </button>
            <button
              onClick={() => { setOpen(false); runPdf(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-cream"
            >
              <FileDown size={14} className="text-coral" /> PDF (.pdf)
            </button>
            <button
              onClick={() => { setOpen(false); printPage(); }}
              className="flex w-full items-center gap-2 border-t border-ink/5 px-3 py-2 text-left text-sm hover:bg-cream"
            >
              <Printer size={14} className="text-ink/60" /> Print page
            </button>
          </div>
        </>
      )}
    </div>
  );
}
