import * as XLSX from 'xlsx';
import { Project } from '@/types/tracker';

export function exportProjectsToExcel(projects: Project[]) {
  // Sheet 1: Executive Summary
  const summaryData = projects.map((p, idx) => {
    const doneCount = p.stages?.filter((s) => s.status === 'DONE').length || 0;
    const blockedCount = p.stages?.filter((s) => s.status === 'BLOCKED').length || 0;
    const inProgressCount = p.stages?.filter((s) => s.status === 'IN_PROGRESS').length || 0;
    const progressPct = Math.round((doneCount / 23) * 100);

    return {
      'No': idx + 1,
      'Nama Project': p.project_name,
      'PIC Security': p.pic_security,
      'Vendor': p.vendor_target || '-',
      'Target Live Date': p.target_live_date || '-',
      'Progress (%)': `${progressPct}% (${doneCount}/23)`,
      'Status': blockedCount > 0 ? 'BLOCKED / KENDALA' : doneCount === 23 ? 'COMPLETED' : 'IN PROGRESS',
      'In Progress': inProgressCount,
      'Blocked Stages': blockedCount,
      'Completed Stages': doneCount
    };
  });

  // Sheet 2: Detailed 23 Stages Matrix
  const detailData: any[] = [];
  projects.forEach((p) => {
    p.stages?.forEach((s) => {
      detailData.push({
        'Nama Project': p.project_name,
        'PIC Project': p.pic_security,
        'No. Tahap': s.stage_order,
        'Fase': s.phase_name,
        'Nama Dokumen / Milestone': s.stage_name,
        'Status': s.status,
        'Link Dokumen': s.document_link || '-',
        'Catatan / Kendala': s.notes || '-',
        'PIC Stage': s.pic_stage || '-',
        'Tanggal Selesai': s.actual_completed_date || '-',
        'Terakhir Diupdate Oleh': s.updated_by || 'System',
        'Waktu Update': new Date(s.updated_at).toLocaleString('id-ID')
      });
    });
  });

  const wb = XLSX.utils.book_new();
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  const wsDetail = XLSX.utils.json_to_sheet(detailData);

  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary Project');
  XLSX.utils.book_append_sheet(wb, wsDetail, 'Detail 23 Tahapan');

  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `ITSec_Procurement_Report_${today}.xlsx`);
}
