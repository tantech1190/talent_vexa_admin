/**
 * CSV / XLSX / PDF export helpers, shared across admin pages.
 *
 * Single-table exports: pass `rows` (header as first row).
 * Multi-section exports: pass `sections` ([{title, subtitle?, head, body}]).
 * Sections become labeled tables in the PDF, and a flattened
 * header-row + blank-separator layout in CSV/XLSX.
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

function rowsToCsv(rows) {
  return rows
    .map((r) => (Array.isArray(r) ? r : [r]).map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

function downloadBlob(filename, contents, mime) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename, rows) {
  const file = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  downloadBlob(file, rowsToCsv(rows), 'text/csv;charset=utf-8');
  toast.success(`Downloaded ${file}`);
}

export function downloadExcel(filename, rows) {
  const file = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  downloadBlob(file, rowsToCsv(rows), 'application/vnd.ms-excel');
  toast.success(`Downloaded ${file}`);
}

export function downloadPdf(filename, rows, title) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title || filename, 40, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generated ${new Date().toLocaleString()} · TalentVexa Admin`, 40, 56);

  const head = [rows?.[0]?.map((c) => (c == null ? '' : String(c))) || []];
  const body = (rows || []).slice(1).map((r) => r.map((c) => (c == null ? '' : String(c))));

  autoTable(doc, {
    head, body, startY: 74,
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 6, overflow: 'linebreak' },
    headStyles: { fillColor: [44, 125, 160], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [246, 248, 251] },
    margin: { left: 40, right: 40 },
  });

  const file = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(file);
  toast.success(`Downloaded ${file}`);
}

export function downloadFullPdf(filename, title, sections, meta = {}) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, 40, 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120);
  const metaLines = [
    `Generated ${new Date().toLocaleString()} · TalentVexa Admin`,
    ...Object.entries(meta).map(([k, v]) => `${k}: ${v}`),
  ];
  metaLines.forEach((ln, i) => doc.text(ln, 40, 62 + i * 12));

  let cursorY = 62 + metaLines.length * 12 + 8;

  sections.forEach((sec) => {
    if (!sec || !sec.body || !sec.body.length) return;
    if (cursorY > 480) { doc.addPage(); cursorY = 48; }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(33, 33, 33);
    doc.text(sec.title, 40, cursorY);
    if (sec.subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(sec.subtitle, 40, cursorY + 14);
    }
    const startY = cursorY + (sec.subtitle ? 24 : 12);

    autoTable(doc, {
      head: sec.head ? [sec.head.map((c) => (c == null ? '' : String(c)))] : undefined,
      body: sec.body.map((r) => r.map((c) => (c == null ? '' : String(c)))),
      startY,
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 6, overflow: 'linebreak' },
      headStyles: { fillColor: [44, 125, 160], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [246, 248, 251] },
      margin: { left: 40, right: 40 },
    });
    cursorY = doc.lastAutoTable.finalY + 24;
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(160);
    doc.text(
      `Page ${i} of ${pageCount} · ${title}`,
      doc.internal.pageSize.getWidth() - 40,
      doc.internal.pageSize.getHeight() - 16,
      { align: 'right' }
    );
  }

  const file = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(file);
  toast.success(`Downloaded ${file}`);
}

/**
 * Render a single tax invoice as a PDF.
 * `inv` = { invoiceNo, company, amount, method, status, createdAt, taxPct?, plan?, billingCycle? }
 */
export function downloadInvoice(inv) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(44, 125, 160);
  doc.text('TalentVexa', 40, 50);
  doc.setFontSize(13);
  doc.setTextColor(33, 33, 33);
  doc.text('TAX INVOICE', W - 40, 50, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Invoice No: ${inv.invoiceNo}`, W - 40, 66, { align: 'right' });
  doc.text(`Date: ${inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}`, W - 40, 78, { align: 'right' });
  doc.text(`Status: ${String(inv.status || 'paid').toUpperCase()}`, W - 40, 90, { align: 'right' });

  doc.setTextColor(33, 33, 33);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed to', 40, 90);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  doc.text(inv.company?.name || '—', 40, 104);

  const total = Number(inv.amount) || 0;
  const taxPct = Number(inv.taxPct) || 0;
  const net = taxPct > 0 ? Math.round(total / (1 + taxPct / 100)) : total;
  const tax = total - net;
  const inr = (n) => `INR ${Number(n).toLocaleString()}`;

  const desc = [inv.plan ? `${inv.plan} plan` : 'Subscription', inv.billingCycle].filter(Boolean).join(' · ') || 'Subscription';

  autoTable(doc, {
    startY: 128,
    head: [['Description', 'Payment method', 'Amount']],
    body: [
      [desc, inv.method || '—', inr(net)],
      ...(taxPct > 0 ? [[`GST (${taxPct}%)`, '', inr(tax)]] : []),
      [{ content: 'Total', styles: { fontStyle: 'bold' } }, '', { content: inr(total), styles: { fontStyle: 'bold' } }],
    ],
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 8 },
    headStyles: { fillColor: [44, 125, 160], textColor: 255, fontStyle: 'bold' },
    columnStyles: { 2: { halign: 'right' } },
    margin: { left: 40, right: 40 },
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(160);
  doc.text('This is a system-generated invoice from TalentVexa Admin.', 40, doc.internal.pageSize.getHeight() - 30);

  const file = `${inv.invoiceNo || 'invoice'}.pdf`;
  doc.save(file);
  toast.success(`Downloaded ${file}`);
}

export function sectionsToRows(title, sections, meta = {}) {
  const rows = [
    [title],
    [`Generated ${new Date().toLocaleString()} · TalentVexa Admin`],
    ...Object.entries(meta).map(([k, v]) => [k, v]),
    [],
  ];
  sections.forEach((sec) => {
    if (!sec || !sec.body || !sec.body.length) return;
    rows.push([sec.title]);
    if (sec.subtitle) rows.push([sec.subtitle]);
    if (sec.head) rows.push(sec.head);
    sec.body.forEach((r) => rows.push(r));
    rows.push([]);
  });
  return rows;
}

export function printPage() {
  toast('Use "Save as PDF" in the print dialog', { icon: '🖨️' });
  setTimeout(() => window.print(), 100);
}
