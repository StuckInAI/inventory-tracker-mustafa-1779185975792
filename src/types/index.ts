export type PipelineStage =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  status: 'open' | 'closed' | 'draft';
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  clientId?: string;
  createdAt: string;
  updatedAt: string;
  applicantCount: number;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  currentRole?: string;
  currentCompany?: string;
  skills: string[];
  stage: PipelineStage;
  jobId?: string;
  notes?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type Interview = {
  id: string;
  candidateId: string;
  jobId: string;
  scheduledAt: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
};

export type Client = {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
  avatar?: string;
  joinedAt: string;
};

export type AppState = {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  clients: Client[];
  team: TeamMember[];
  currentUser: {
    name: string;
    role: string;
    avatar: string;
  };
};

export type AppAction =
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
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'UPDATE_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'DELETE_TEAM_MEMBER'; payload: string };
