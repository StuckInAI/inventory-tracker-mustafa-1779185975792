export type JobStatus = 'Open' | 'Closed' | 'On Hold' | 'Draft';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
export type CandidateStatus = 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
export type InterviewType = 'Phone' | 'Video' | 'On-site' | 'Technical';
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';

export interface Job {
  id: string;
  title: string;
  clientId: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  status: CandidateStatus;
  stage?: string;
  skills: string[];
  experience: number;
  location: string;
  resumeUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  notes: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  department: string;
  joinedAt: string;
}

export interface AppState {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  clients: Client[];
  team: TeamMember[];
  currentUser: TeamMember;
}

export type Action =
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'ADD_CANDIDATE'; payload: Candidate }
  | { type: 'UPDATE_CANDIDATE'; payload: Candidate }
  | { type: 'DELETE_CANDIDATE'; payload: string }
  | { type: 'ADD_INTERVIEW'; payload: Interview }
  | { type: 'UPDATE_INTERVIEW'; payload: Interview }
  | { type: 'DELETE_INTERVIEW'; payload: string }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string };
