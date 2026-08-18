'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Project, AuditLog, ProjectStage } from '@/types/tracker';
import { toast } from 'sonner';

export function useRealtimeTracker() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: pData } = await supabase
        .from('projects')
        .select('*, stages:project_stages(*)')
        .order('created_at', { ascending: false });

      const { data: lData } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (pData) {
        const formatted = pData.map((proj: any) => ({
          ...proj,
          stages: (proj.stages || []).sort((a: ProjectStage, b: ProjectStage) => a.stage_order - b.stage_order)
        }));
        setProjects(formatted);
      }
      if (lData) setAuditLogs(lData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const stageChannel = supabase
      .channel('realtime_stages')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'project_stages' },
        (payload) => {
          const updatedStage = payload.new as ProjectStage;
          setProjects((prev) =>
            prev.map((proj) => {
              if (proj.id !== updatedStage.project_id) return proj;
              return {
                ...proj,
                stages: proj.stages?.map((stg) =>
                  stg.id === updatedStage.id ? updatedStage : stg
                ),
              };
            })
          );
        }
      )
      .subscribe();

    const logChannel = supabase
      .channel('realtime_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_logs' },
        (payload) => {
          const newLog = payload.new as AuditLog;
          setAuditLogs((prev) => [newLog, ...prev.slice(0, 29)]);
          toast.info('Update: ' + newLog.updated_by + ' mengubah ' + newLog.stage_name + ' ke [' + newLog.new_status + ']');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(stageChannel);
      supabase.removeChannel(logChannel);
    };
  }, []);

  return { projects, auditLogs, loading, refetch: fetchData };
}
