import { useState } from "react";
import { ProjectStage, StageStatus } from "@/types/tracker";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Props {
  stage: ProjectStage | null;
  projectName: string;
  onClose: () => void;
}

export function EditStageModal({ stage, projectName, onClose }: Props) {
  if (!stage) return null;

  const [status, setStatus] = useState<StageStatus>(stage.status);
  const [docLink, setDocLink] = useState(stage.document_link || "");
  const [notes, setNotes] = useState(stage.notes || "");
  const [author, setAuthor] = useState(stage.updated_by || "PIC IT Security");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("project_stages")
        .update({
          status,
          document_link: docLink,
          notes,
          updated_by: author,
          actual_completed_date: status === "DONE" ? new Date().toISOString().split("T")[0] : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", stage.id);

      if (error) throw error;
      toast.success('Berhasil mengupdate: ' + stage.stage_name);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
        <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
              {stage.phase_name} • Milestone #{stage.stage_order}
            </span>
            <h3 className="text-lg font-bold text-white mt-1">{stage.stage_name}</h3>
            <p className="text-xs text-slate-400">Project: {projectName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Status Tahapan</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StageStatus)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="NOT_STARTED">⏳ Not Started</option>
              <option value="IN_PROGRESS">🔄 In Progress</option>
              <option value="DONE">✅ Done</option>
              <option value="BLOCKED">🚫 Blocked / Kendala</option>
              <option value="NOT_APPLICABLE">➖ N/A (Not Applicable)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Link Dokumen (SharePoint / GDrive)</label>
            <input
              type="url"
              placeholder="https://..."
              value={docLink}
              onChange={(e) => setDocLink(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Catatan Hambatan / Keterangan</label>
            <textarea
              rows={3}
              placeholder="Catatan kendala atau approval..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Nama PIC Pengubah</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
              Batal
            </button>
            <button type="submit" disabled={isSaving} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white">
              {isSaving ? "Menyimpan..." : "Simpan Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
