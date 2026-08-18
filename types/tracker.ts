export type StageStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE" | "BLOCKED" | "NOT_APPLICABLE";
export type ProjectStatus = "ON_TRACK" | "AT_RISK" | "DELAYED" | "COMPLETED";

export interface ProjectStage {
  id: string;
  project_id: string;
  stage_order: number;
  phase_name: string;
  stage_name: string;
  status: StageStatus;
  document_link?: string;
  notes?: string;
  pic_stage?: string;
  target_date?: string;
  actual_completed_date?: string;
  updated_by: string;
  updated_at: string;
}

export interface Project {
  id: string;
  project_name: string;
  pic_security: string;
  vendor_target?: string;
  target_live_date?: string;
  overall_status: ProjectStatus;
  stages?: ProjectStage[];
  created_at: string;
}

export interface AuditLog {
  id: string;
  project_name: string;
  stage_name: string;
  previous_status: StageStatus;
  new_status: StageStatus;
  updated_by: string;
  notes_snapshot?: string;
  created_at: string;
}
