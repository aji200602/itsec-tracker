import { Project, ProjectStage } from '@/types/tracker';
import { ExternalLink, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

interface Props {
  projects: Project[];
  onSelectStage: (stage: ProjectStage, projName: string) => void;
}

export function KanbanView({ projects, onSelectStage }: Props) {
  // Tentukan fase aktif project berdasarkan tahapan pertama yang belum DONE
  const getActivePhase = (stages?: ProjectStage[]) => {
    if (!stages || stages.length === 0) return 1;
    const firstIncomplete = stages.find((s) => s.status !== 'DONE' && s.status !== 'NOT_APPLICABLE');
    if (!firstIncomplete) return 4; // Semua selesai
    if (firstIncomplete.stage_order <= 6) return 1;
    if (firstIncomplete.stage_order <= 12) return 2;
    if (firstIncomplete.stage_order <= 18) return 3;
    return 4;
  };

  const getPhaseProjects = (phaseNum: number) => {
    return projects.filter((p) => getActivePhase(p.stages) === phaseNum);
  };

  const columns = [
    { num: 1, title: '1. Inisiasi & Scope', color: 'border-sky-500/30 text-sky-400 bg-sky-500/10' },
    { num: 2, title: '2. Kesiapan Dokumen', color: 'border-violet-500/30 text-violet-400 bg-violet-500/10' },
    { num: 3, title: '3. Komersial & HPS', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
    { num: 4, title: '4. Legalitas & PKS', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colProjects = getPhaseProjects(col.num);
        return (
          <div key={col.num} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col min-h-[500px]">
            <div className={}>
              <h4 className="font-bold text-xs uppercase tracking-wider">{col.title}</h4>
              <span className="px-2 py-0.5 rounded-full bg-slate-950/60 text-xs font-bold">{colProjects.length}</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {colProjects.length === 0 ? (
                <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                  Tidak ada project di fase ini
                </div>
              ) : (
                colProjects.map((p) => {
                  const doneCount = p.stages?.filter((s) => s.status === 'DONE').length || 0;
                  const activeStage = p.stages?.find((s) => s.status === 'IN_PROGRESS' || s.status === 'BLOCKED') || p.stages?.[doneCount];

                  return (
                    <div
                      key={p.id}
                      className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 shadow-md hover:border-slate-700 transition space-y-3"
                    >
                      <div>
                        <h5 className="font-bold text-sm text-white">{p.project_name}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">PIC: {p.pic_security} • Vendor: {p.vendor_target || '-'}</p>
                      </div>

                      {/* Current Active Stage */}
                      {activeStage && (
                        <div
                          onClick={() => onSelectStage(activeStage, p.project_name)}
                          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition text-xs"
                        >
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Milestone Aktif</span>
                            <span className={}>
                              {activeStage.status}
                            </span>
                          </div>
                          <p className="font-semibold text-slate-200 flex items-center justify-between">
                            <span>#{activeStage.stage_order}. {activeStage.stage_name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                        <span>Progress Keseluruhan</span>
                        <span className="font-bold text-blue-400">{doneCount}/23</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
