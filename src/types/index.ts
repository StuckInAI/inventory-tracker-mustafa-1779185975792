export type CandidateStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';

export type JobStatus = 'open' | 'closed' | 'draft' | 'on_hold';

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical';

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: CandidateStatus;
  jobId?: string;
  jobTitle?: string;
  currentRole?: string;
  stage?: string;
  avatar?: string;
  title?: string;
  skills?: string[];
  experience?: number;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: JobStatus;
  description?: string;
  requirements?: string[];
  salary?: { min: number; max: number; currency: string };
  clientId?: string;
  createdAt: string;
  updatedAt: string;
  openings?: number;
  filled?: number;
}

export interface Client {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  contactName?: string;
  contactTitle?: string;
  phone?: string;
  email?: string;
  status?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId?: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt?: string;
  date?: string;
  time?: string;
  duration?: number;
  interviewers?: string[];
  notes?: string;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  avatar?: string;
  joinedAt?: string;
  createdAt: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface AppState {
  currentUser: CurrentUser;
  candidates: Candidate[];
  jobs: Job[];
  clients: Client[];
  interviews: Interview[];
  team: TeamMember[];
}
