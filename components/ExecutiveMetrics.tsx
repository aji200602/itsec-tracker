import { Project } from '@/types/tracker';
import { ShieldCheck, CheckCircle2, AlertTriangle, Clock, Layers } from 'lucide-react';

interface Props {
  projects: Project[];
}

export function ExecutiveMetrics({ projects }: Props) {
  const totalProjects = projects.length;
  
  let totalStages = 0;
  let totalDoneStages = 0;
  let totalBlockedStages = 0;
  let totalInProgressStages = 0;

  projects.forEach((p) => {
    p.stages?.forEach((s) => {
      totalStages++;
      if (s.status === 'DONE') totalDoneStages++;
      if (s.status === 'BLOCKED') totalBlockedStages++;
      if (s.status === 'IN_PROGRESS') totalInProgressStages++;
    });
  });

  const avgCompletionRate = totalStages > 0 ? Math.round((totalDoneStages / totalStages) * 100) : 0;
  const completedProjects = projects.filter((p) => p.stages?.every((s) => s.status === 'DONE' || s.status === 'NOT_APPLICABLE')).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Metric 1 */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800/80 shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Projects</p>
            <h3 className="text-2xl font-black text-white mt-1">{totalProjects} <span className="text-xs font-normal text-slate-400">Inisiatif</span></h3>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 bg-slate-800/80 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width:  }}></div>
          </div>
          <span className="text-xs font-bold text-blue-400">{avgCompletionRate}% Avg</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800/80 shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-emerald-400/90 uppercase tracking-wider">Fully Completed</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{completedProjects} <span className="text-xs font-normal text-slate-400">Project</span></h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
          <span className="font-semibold text-emerald-400">{totalDoneStages}</span> dari total {totalStages} dokumen selesai (PKS)
        </p>
      </div>

      {/* Metric 3 */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800/80 shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-rose-400/90 uppercase tracking-wider">Bottlenecks / Blocked</p>
            <h3 className="text-2xl font-black text-rose-400 mt-1">{totalBlockedStages} <span className="text-xs font-normal text-slate-400">Dokumen</span></h3>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
          {totalBlockedStages > 0 ? (
            <span className="text-rose-400 font-medium">⚠️ Perlu eskalasi review/approval</span>
          ) : (
            <span className="text-slate-400">Tidak ada kendala aktif</span>
          )}
        </p>
      </div>

      {/* Metric 4 */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800/80 shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider">In Progress Milestones</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{totalInProgressStages} <span className="text-xs font-normal text-slate-400">Berjalan</span></h3>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Proses dokumen berjalan di seluruh inisiatif
        </p>
      </div>
    </div>
  );
}
