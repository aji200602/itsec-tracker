import { Project, ProjectStage, StageStatus } from '@/types/tracker';
import { ExternalLink, AlertTriangle, Clock } from 'lucide-react';

interface Props {
  projects: Project[];
  onSelectStage: (stage: ProjectStage, projName: string) => void;
  onOpenAddModal: () => void;
}

export function MatrixView({ projects, onSelectStage, onOpenAddModal }: Props) {
  if (projects.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
        <p className="text-slate-400">Tidak ada project yang sesuai dengan filter.</p>
        <button onClick={onOpenAddModal} className="mt-3 text-blue-400 hover:underline text-sm font-medium">
          + Tambah Project Baru
        </button>
      </div>
    );
  }

  const getStatusStyle = (status: StageStatus) => {
    switch (status) {
      case 'DONE':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25';
      case 'IN_PROGRESS':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/40 hover:bg-blue-500/25 ring-1 ring-blue-500/40';
      case 'BLOCKED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/30 animate-pulse ring-1 ring-rose-500/60';
      case 'NOT_APPLICABLE':
        return 'bg-slate-800/30 text-slate-500 border-slate-800';
      default:
        return 'bg-slate-900/70 text-slate-400 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700';
    }
  };

  const getDaysAgo = (dateStr: string) => {
    if (!dateStr) return 0;
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="space-y-6">
      {projects.map((proj) => {
        const doneCount = proj.stages?.filter((s) => s.status === 'DONE').length || 0;
        const progressPct = Math.round((doneCount / 23) * 100);
        const hasBlocked = proj.stages?.some((s) => s.status === 'BLOCKED');

        return (
          <div
            key={proj.id}
            className={
              "bg-slate-900/80 border rounded-2xl p-6 shadow-xl backdrop-blur-md transition-all " +
              (hasBlocked ? "border-rose-900/40 shadow-rose-950/10" : "border-slate-800/80 hover:border-slate-700")
            }
          >
            {/* Project Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-lg font-bold text-white tracking-tight">{proj.project_name}</h3>
                  {hasBlocked && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Ada Kendala
                    </span>
                  )}
                  {doneCount === 23 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                      ✓ Selesai
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  PIC Security: <span className="text-slate-200 font-medium">{proj.pic_security}</span> • Vendor:{' '}
                  <span className="text-slate-200 font-medium">{proj.vendor_target || '-'}</span> • Target Live:{' '}
                  <span className="text-slate-200 font-medium">{proj.target_live_date || '-'}</span>
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-3 bg-slate-950/50 px-3.5 py-2 rounded-xl border border-slate-800/60">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Milestone Progress</p>
                  <p className="text-sm font-black text-blue-400">{doneCount}/23 ({progressPct}%)</p>
                </div>
                <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 4 Phases Segmented Layout */}
            <div className="space-y-4 pt-2 border-t border-slate-800/70">
              {/* Phase 1: Inisiasi */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">Fase 1: Inisiasi & Perencanaan (1-6)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {proj.stages?.slice(0, 6).map((stg) => (
                    <StageCard key={stg.id} stage={stg} projectName={proj.project_name} onSelect={onSelectStage} getStyle={getStatusStyle} getDaysAgo={getDaysAgo} />
                  ))}
                </div>
              </div>

              {/* Phase 2: Kesiapan & Seleksi */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">Fase 2: Kesiapan Dokumen & DRTU (7-12)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {proj.stages?.slice(6, 12).map((stg) => (
                    <StageCard key={stg.id} stage={stg} projectName={proj.project_name} onSelect={onSelectStage} getStyle={getStatusStyle} getDaysAgo={getDaysAgo} />
                  ))}
                </div>
              </div>

              {/* Phase 3: Komersial */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Fase 3: Komersial & Pricing HPS (13-18)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {proj.stages?.slice(12, 18).map((stg) => (
                    <StageCard key={stg.id} stage={stg} projectName={proj.project_name} onSelect={onSelectStage} getStyle={getStatusStyle} getDaysAgo={getDaysAgo} />
                  ))}
                </div>
              </div>

              {/* Phase 4: Legalitas */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Fase 4: Approval & Legalitas PKS (19-23)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {proj.stages?.slice(18, 23).map((stg) => (
                    <StageCard key={stg.id} stage={stg} projectName={proj.project_name} onSelect={onSelectStage} getStyle={getStatusStyle} getDaysAgo={getDaysAgo} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StageCard({
  stage,
  projectName,
  onSelect,
  getStyle,
  getDaysAgo
}: {
  stage: ProjectStage;
  projectName: string;
  onSelect: (s: ProjectStage, p: string) => void;
  getStyle: (st: StageStatus) => string;
  getDaysAgo: (d: string) => number;
}) {
  const days = getDaysAgo(stage.updated_at);
  const isOverdue = (stage.status === 'IN_PROGRESS' && days > 7) || (stage.status === 'BLOCKED' && days > 3);

  return (
    <button
      onClick={() => onSelect(stage, projectName)}
      className={
        "text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col justify-between min-h-[82px] relative group " +
        getStyle(stage.status)
      }
    >
      <div className="font-medium line-clamp-2 leading-tight">
        <span className="opacity-60 text-[10px] block font-mono">#{stage.stage_order}</span>
        {stage.stage_name}
      </div>

      <div className="flex justify-between items-center mt-2 text-[10px] opacity-90 pt-1 border-t border-white/5">
        <span className="font-semibold">{stage.status}</span>
        <div className="flex items-center gap-1">
          {isOverdue && (
            <span className="text-rose-400 font-bold flex items-center gap-0.5" title={`Aging: ${days} hari`}>
              <Clock className="w-2.5 h-2.5" /> {days}d
            </span>
          )}
          {stage.document_link && (
            <a
              href={stage.document_link}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-0.5 rounded hover:bg-white/20 text-blue-300"
              title="Buka Link Dokumen"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </button>
  );
}
