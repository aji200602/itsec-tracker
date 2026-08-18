import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewProjectModal({ isOpen, onClose, onSuccess }: Props) {
  if (!isOpen) return null;

  const [projectName, setProjectName] = useState("");
  const [picSecurity, setPicSecurity] = useState("");
  const [vendorTarget, setVendorTarget] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from("projects").insert({
        project_name: projectName,
        pic_security: picSecurity,
        vendor_target: vendorTarget || null,
        target_live_date: targetDate || null
      });

      if (error) throw error;
      toast.success('Project ' + projectName + ' berhasil dibuat beserta 23 tahapan!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Gagal menambah project");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white">Tambah Project IT Security Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Nama Project *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Implementasi PAM & SIEM 2026"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">PIC IT Security *</label>
            <input
              type="text"
              required
              placeholder="Nama PIC Internal"
              value={picSecurity}
              onChange={(e) => setPicSecurity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Vendor Target</label>
              <input
                type="text"
                placeholder="Nama Vendor/Prinsipal"
                value={vendorTarget}
                onChange={(e) => setVendorTarget(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Live Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
              Batal
            </button>
            <button type="submit" disabled={isSaving} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white">
              {isSaving ? "Menyimpan..." : "Buat Project & 23 Milestones"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
