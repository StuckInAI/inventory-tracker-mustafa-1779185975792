export type JobStatus = 'open' | 'closed' | 'draft' | 'on-hold';
export type CandidateStatus = 'active' | 'inactive' | 'hired' | 'rejected';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: JobStatus;
  description: string;
  requirements: string[];
  salary?: string;
  clientId?: string;
  clientName?: string;
  recruiterName?: string;
  candidatesCount?: number;
  postedAt?: string;
  closingDate?: string;
  pipeline?: PipelineStage[];
  createdAt: string;
  updatedAt: string;
};

export type PipelineStage = {
  id: string;
  name: string;
  candidateIds: string[];
};

export type Activity = {
  id: string;
  type: string;
  description: string;
  createdAt: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  status: CandidateStatus;
  currentJobId?: string;
  currentTitle?: string;
  currentCompany?: string;
  currentStage?: string;
  skills: string[];
  experience?: number;
  resumeUrl?: string;
  activities?: Activity[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Client = {
  id: string;
  name: string;
  industry: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  notes?: string;
  jobIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  avatar: string;
  createdAt: string;
};

export type Interview = {
  id: string;
  candidateId: string;
  jobId: string;
  interviewerId?: string;
  scheduledAt: string;
  duration?: number;
  type?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
};

export type AppState = {
  jobs: Job[];
  candidates: Candidate[];
  clients: Client[];
  team: TeamMember[];
  interviews: Interview[];
  currentUser: TeamMember;
};
