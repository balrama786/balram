export interface WABAConnectionPhoneNumber {
  id: string;
  phone_number_id: string;
  display_phone_number: string;
  verified_name?: string;
  quality_rating?: string;
  status?: string;
  is_active: boolean;
}

export interface WABAConnection {
  id: string;
  _id?: string; // Sometimes returned as _id from MongoDB
  name: string;
  whatsapp_business_account_id: string;
  app_id: string;
  access_token: string;
  is_active: boolean;
  phone_numbers: WABAConnectionPhoneNumber[];
  phone_numbers_count: number;
}

export interface ConnectionsResponse {
  success: boolean;
  data: WABAConnection[];
  total_wabas: number;
}

export interface WabaSetupStep {
  id: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  iconName: "Phone" | "AppWindow" | "Key" | "Webhook" | "CheckCircle2";
}

export interface WabaSetupGuideProps {
  isConnected: boolean;
}
