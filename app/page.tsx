'use client';
import { useState } from 'react';
import { useRealtimeTracker } from '@/hooks/useRealtimeTracker';
import { ProjectStage, StageStatus } from '@/types/tracker';
import { EditStageModal } from '@/components/EditStageModal';
import { NewProjectModal } from '@/components/NewProjectModal';
import { ShieldCheck, Activity, ExternalLink, Plus } from 'lucide-react';
import { Toaster } from 'sonner';

export default function DashboardPage() {
  const { projects, auditLogs, loading, refetch } = useRealtimeTracker();
  const [selectedStage, setSelectedStage] = useState<{ stage: ProjectStage; projName: string } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        <span className="ml-3 font-medium">Menghubungkan ke Realtime Database...</span>
      </div>
    );
  }

  const getStatusColor = (status: StageStatus) => {
    switch (status) {
      case 'DONE': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
      case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30 ring-1 ring-blue-500/50';
      case 'BLOCKED': return 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30';
      case 'NOT_APPLICABLE': return 'bg-slate-800/40 text-slate-600 border-slate-800';
      default: return 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/60';
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pic_security.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <Toaster position="top-right" richColors theme="dark" />
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">IT Security Procurement Tracker</h1>
            <p className="text-xs text-slate-400">Realtime Multi-user Document Lifecycle Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Project
          </button>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Realtime
          </span>
        </div>
      </header>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari Project atau PIC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
              <p className="text-slate-400">Belum ada project yang ditemukan.</p>
              <button onClick={() => setIsAddOpen(true)} className="mt-3 text-blue-400 hover:underline text-sm font-medium">
                + Tambah Project Pertama
              </button>
            </div>
          ) : (
            filteredProjects.map((proj) => {
              const doneCount = proj.stages?.filter((s) => s.status === 'DONE').length || 0;
              const progressPct = Math.round((doneCount / 23) * 100);

              return (
                <div key={proj.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{proj.project_name}</h3>
                      <p className="text-xs text-slate-400">PIC: <span className="text-slate-200">{proj.pic_security}</span> • Vendor: <span className="text-slate-200">{proj.vendor_target || '-'}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-blue-400">{doneCount}/23 ({progressPct}%)</span>
                      <div className="w-24 bg-slate-800 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: progressPct + '%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2.5 pt-3 border-t border-slate-800/80">
                    {proj.stages?.map((stg) => (
                      <button
                        key={stg.id}
                        onClick={() => setSelectedStage({ stage: stg, projName: proj.project_name })}
                        className={'text-left p-2.5 rounded-lg border text-xs transition flex flex-col justify-between min-h-[76px] ' + getStatusColor(stg.status)}
                      >
                        <div className="font-semibold line-clamp-2">
                          {stg.stage_order}. {stg.stage_name}
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[10px] opacity-80">
                          <span>{stg.status}</span>
                          {stg.document_link && <ExternalLink className="w-3 h-3" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Live Activity Log */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 h-fit shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Live Activity Log</h3>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-500">Belum ada aktivitas.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span className="font-semibold text-blue-400">{log.updated_by}</span>
                    <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-200 font-medium">{log.project_name} → <span className="text-slate-400">{log.stage_name}</span></p>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{log.previous_status || 'INIT'}</span>
                    <span>→</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">{log.new_status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedStage && (
        <EditStageModal
          stage={selectedStage.stage}
          projectName={selectedStage.projName}
          onClose={() => setSelectedStage(null)}
        />
      )}

      <NewProjectModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
