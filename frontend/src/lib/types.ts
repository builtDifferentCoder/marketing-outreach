export type ServiceType =
  | "AI Automation Agency"
  | "Marketing Agency"
  | "Software Agency"
  | "Other";

export type StatusType =
  | "NEW"
  | "RESEARCHED"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "REPLIED"
  | "INTERESTED"
  | "CALL_SCHEDULED"
  | "PROPOSAL_SENT"
  | "NEGOTIATING"
  | "WON"
  | "LOST"
  | "NOT_INTERESTED";

export type PriorityType = "HIGH" | "MEDIUM" | "LOW";

export type DemoType =
  | "Lead Qualification"
  | "AI Support/Sales Agent"
  | "RAG"
  | "Automation"
  | "Other";

export interface Prospect {
  id: number;
  company_name: string;
  website?: string | null;
  company_type?: string | null;
  owner_name: string;
  owner_title?: string | null;
  email: string;
  linkedin_url?: string | null;
  phone?: string | null;
  country?: string | null;
  timezone?: string | null;
  service_type?: string | null;
  potential_need?: string | null;
  source?: string | null;
  status: StatusType;
  priority: PriorityType;
  first_contact_date?: string | null;
  last_contact_date?: string | null;
  next_follow_up_date?: string | null;
  proposal_amount?: number | null;
  currency: string;
  demo_sent: boolean;
  demo_type?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export type ProspectFormData = {
  company_name: string;
  website?: string;
  company_type?: string;
  owner_name: string;
  owner_title?: string;
  email: string;
  linkedin_url?: string;
  phone?: string;
  country?: string;
  timezone?: string;
  service_type?: string;
  potential_need?: string;
  source?: string;
  status: StatusType;
  priority: PriorityType;
  first_contact_date?: string;
  last_contact_date?: string;
  next_follow_up_date?: string;
  proposal_amount?: number | null;
  currency: string;
  demo_sent: boolean;
  demo_type?: string;
  notes?: string;
};

export interface StatsData {
  total: number;
  new: number;
  contacted: number;
  follow_up: number;
  interested: number;
  proposals: number;
  won: number;
  lost: number;
}
