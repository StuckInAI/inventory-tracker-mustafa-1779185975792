export type JobStatus = 'Open' | 'Closed' | 'Draft' | 'On Hold';
export type CandidateStatus = 'Active' | 'Inactive' | 'Hired' | 'Rejected';
export type InterviewType = 'Phone Screen' | 'Technical' | 'Behavioral' | 'Final' | 'HR';
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: JobStatus;
  description?: string;
  requirements?: string[];
  salaryMin?: number;
  salaryMax?: number;
  clientId?: string;
  clientName?: string;
  recruiterName?: string;
  closingDate?: string;
  postedAt?: string;
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
  status: CandidateStatus;
  jobId?: string;
  jobTitle?: string;
  skills?: string[];
  experience?: number;
  currentTitle?: string;
  currentCompany?: string;
  currentStage?: string;
  resumeUrl?: string;
  notes?: string;
  source?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  notes?: string;
  activeJobs?: number;
  createdAt: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  interviewerId?: string;
  interviewerName?: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration?: number;
  location?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
  avatar?: string;
  jobIds?: string[];
  createdAt: string;
}

export interface AppState {
  jobs: Job[];
  candidates: Candidate[];
  clients: Client[];
  interviews: Interview[];
  team: TeamMember[];
  currentUser: {
    name: string;
    role: string;
    avatar: string;
  };
}
