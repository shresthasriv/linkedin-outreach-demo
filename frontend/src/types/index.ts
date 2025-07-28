export interface LinkedInProfile {
  provider_id?: string;
  public_identifier?: string;
  first_name?: string;
  last_name?: string;
  name: string;
  job_title: string;
  company: string;
  industry: string;
  location?: string;
  profile_url?: string;
  profile_picture?: string;
  profile_picture_url?: string;
  profile_picture_url_large?: string;
  headline?: string;
  summary?: string;
  work_experience?: Array<{
    position: string;
    company: string;
    location?: string;
    description?: string;
    current: boolean;
    start: string;
    end?: string;
  }>;
  education?: Array<{
    degree?: string;
    school: string;
    field_of_study?: string;
    start: string;
    end?: string;
  }>;
  skills?: Array<{
    name: string;
    endorsement_count: number;
  }>;
  connections_count?: number;
  public_profile_url?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  accountId: string | null;
  profile: LinkedInProfile | null;
  loading: boolean;
  error: string | null;
}

export interface MessageGeneration {
  success: boolean;
  messages: string[];
  target_profile_used: Partial<LinkedInProfile>;
  sender_profile_used: Partial<LinkedInProfile>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface OAuthResponse {
  success: boolean;
  oauth_url: string;
  redirect_uri: string;
}

export interface AccountResponse {
  success: boolean;
  account: {
    id: string;
    provider: string;
    status: string;
  };
}

export interface MessageSendResponse {
  success: boolean;
  message_sent: boolean;
  message_id: string;
  sent_at: string;
  message_preview: string;
} 