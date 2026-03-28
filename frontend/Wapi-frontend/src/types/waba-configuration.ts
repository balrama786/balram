export interface ReplyRef {
  id: string;
  type: string;
}

export interface DelayedReplyRef extends ReplyRef {
  delay_minutes: number;
}

export interface WabaConfigPayload {
  out_of_working_hours?: ReplyRef | null;
  welcome_message?: ReplyRef | null;
  delayed_reply?: DelayedReplyRef | null;
  fallback_message?: ReplyRef | null;
  reengagement_message?: ReplyRef | null;
  round_robin_assignment?: boolean;
}

export interface WabaConfigData extends WabaConfigPayload {
  _id?: string;
  waba_id?: string;
}

export interface WabaConfigResponse {
  success: boolean;
  message?: string;
  data: WabaConfigData;
}
