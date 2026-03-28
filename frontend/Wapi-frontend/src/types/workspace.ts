export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  waba_id: string | null;
  waba_type: string | null;
  connection_status?: string;
  is_active?: boolean;
  created_at?: string;
  user_id?: string;
}
