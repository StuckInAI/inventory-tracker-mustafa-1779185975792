export type JobStatus = 'open' | 'closed' | 'draft' | 'on-hold';
export type CandidateStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high';

export interface Salary {
  min: number;
  max: number;
  currency: string;
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
  salary?: Salary;
  clientId?: string;
  clientName?: string;
  recruiterName?: string;
  postedAt?: string;
  closingDate?: string;
  candidatesCount?: number;
  pipeline?: string[];
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  currentCompany?: string;
  currentJobId?: string;
  currentStage?: string;
  status: CandidateStatus;
  skills?: string[];
  experience?: number;
  resumeUrl?: string;
  notes?: string;
  appliedAt: string;
  jobId?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  interviewerId: string;
  interviewerName: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: InterviewStatus;
  notes?: string;
  location?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  location?: string;
  notes?: string;
  jobIds?: string[];
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  avatar?: string;
  jobIds?: string[];
  joinedAt: string;
}

export interface CurrentUser {
  name: string;
  role: string;
  avatar: string;
}

export interface AppState {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  clients: Client[];
  team: TeamMember[];
  currentUser: CurrentUser;
}
