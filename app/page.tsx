'use client';
import { useState } from 'react';
import { useRealtimeTracker } from '@/hooks/useRealtimeTracker';
import { ProjectStage } from '@/types/tracker';
import { EditStageModal } from '@/components/EditStageModal';
import { NewProjectModal } from '@/components/NewProjectModal';
import { ExecutiveMetrics } from '@/components/ExecutiveMetrics';
import { MatrixView } from '@/components/MatrixView';
import { KanbanView } from '@/components/KanbanView';
import { exportProjectsToExcel } from '@/lib/exportExcel';
import { ShieldCheck, Activity, Plus, FileSpreadsheet, LayoutGrid, Kanban, Search, Filter } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function DashboardPage() {
  const { projects, auditLogs, loading, refetch } = useRealtimeTracker();
  const [selectedStage, setSelectedStage] = useState<{ stage: ProjectStage; projName: string } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'matrix' | 'kanban'>('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [picFilter, setPicFilter] = useState<string>('ALL');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="font-medium text-sm tracking-wide text-slate-400">Menghubungkan ke Realtime Database...</p>
      </div>
    );
  }

  // Filter Logic
  const allPics = Array.from(new Set(projects.map((p) => p.pic_security).filter(Boolean)));

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pic_security.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.vendor_target && p.vendor_target.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchPic = picFilter === 'ALL' || p.pic_security === picFilter;

    let matchStatus = true;
    if (statusFilter === 'BLOCKED') {
      matchStatus = p.stages?.some((s) => s.status === 'BLOCKED') || false;
    } else if (statusFilter === 'COMPLETED') {
      matchStatus = p.stages?.every((s) => s.status === 'DONE' || s.status === 'NOT_APPLICABLE') || false;
    } else if (statusFilter === 'IN_PROGRESS') {
      matchStatus = p.stages?.some((s) => s.status === 'IN_PROGRESS') || false;
    }

    return matchSearch && matchPic && matchStatus;
  });

  const handleExportExcel = () => {
    if (projects.length === 0) {
      toast.error('Belum ada data project untuk diexport');
      return;
    }
    try {
      exportProjectsToExcel(projects);
      toast.success('Laporan Excel 23 Tahapan berhasil diunduh!');
    } catch (e: any) {
      toast.error('Gagal export: ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      <Toaster position="top-right" richColors theme="dark" />

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/20 border border-blue-400/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-white tracking-tight">IT Security Procurement Tracker</h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Executive Realtime 23-Document Lifecycle & Project Milestone Management
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-end">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('matrix')}
              className={
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer " +
                (viewMode === 'matrix' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200')
              }
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Matrix
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer " +
                (viewMode === 'kanban' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200')
              }
            >
              <Kanban className="w-3.5 h-3.5" /> Kanban
            </button>
          </div>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Project
          </button>
        </div>
      </header>

      {/* Executive Metrics Stat Cards */}
      <ExecutiveMetrics projects={projects} />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-6 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari nama project, PIC, atau vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="BLOCKED">⚠️ Ada Kendala (Blocked)</option>
            <option value="IN_PROGRESS">🔄 In Progress</option>
            <option value="COMPLETED">✓ Completed (23 Done)</option>
          </select>

          {allPics.length > 0 && (
            <select
              value={picFilter}
              onChange={(e) => setPicFilter(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua PIC</option>
              {allPics.map((pic) => (
                <option key={pic} value={pic}>
                  {pic}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Grid: Content (Matrix/Kanban) + Audit Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {viewMode === 'matrix' ? (
            <MatrixView
              projects={filteredProjects}
              onSelectStage={(stg, pName) => setSelectedStage({ stage: stg, projName: pName })}
              onOpenAddModal={() => setIsAddOpen(true)}
            />
          ) : (
            <KanbanView
              projects={filteredProjects}
              onSelectStage={(stg, pName) => setSelectedStage({ stage: stg, projName: pName })}
            />
          )}
        </div>

        {/* Live Activity Log Sidebar */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 h-fit shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Live Activity Log</h3>
          </div>
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 text-xs">
            {auditLogs.length === 0 ? (
              <p className="text-slate-500 text-xs py-4 text-center">Belum ada riwayat aktivitas.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl space-y-1.5 hover:border-slate-700 transition">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span className="font-semibold text-blue-400">{log.updated_by}</span>
                    <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-200 font-medium leading-snug">
                    {log.project_name} → <span className="text-slate-400">{log.stage_name}</span>
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">{log.previous_status || 'INIT'}</span>
                    <span>→</span>
                    <span
                      className={
                        "px-1.5 py-0.5 rounded text-[10px] font-semibold " +
                        (log.new_status === 'DONE'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : log.new_status === 'BLOCKED'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-blue-500/20 text-blue-300')
                      }
                    >
                      {log.new_status}
                    </span>
                  </div>
                  {log.notes_snapshot && (
                    <p className="text-slate-400 text-[10px] italic bg-slate-900/50 p-1.5 rounded border border-slate-800/40">
                      "{log.notes_snapshot}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Stage Modal */}
      {selectedStage && (
        <EditStageModal
          stage={selectedStage.stage}
          projectName={selectedStage.projName}
          onClose={() => setSelectedStage(null)}
          onSuccess={refetch}
        />
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
