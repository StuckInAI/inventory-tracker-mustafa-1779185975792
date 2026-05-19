export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email?: string;
  department?: string;
};

export type Client = {
  id: string;
  name: string;
  industry: string;
  contact: string;
  email: string;
  phone?: string;
  website?: string;
  location?: string;
  status: 'active' | 'inactive';
  jobsCount?: number;
  createdAt: string;
};

export type Job = {
  id: string;
  title: string;
  clientId: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  status: 'open' | 'closed' | 'draft' | 'on-hold';
  department: string;
  salary?: string;
  description?: string;
  requirements?: string[];
  recruiterId: string;
  createdAt: string;
  updatedAt?: string;
  applicantsCount?: number;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  skills?: string[];
  experience?: number;
  education?: string;
  resume?: string;
  avatar: string;
  status: 'active' | 'inactive' | 'hired' | 'rejected';
  source?: string;
  createdAt: string;
};

export type ApplicationStage =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  stage: ApplicationStage;
  appliedAt: string;
  updatedAt?: string;
  notes?: string;
  rating?: number;
};

export type Interview = {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  interviewerId: string;
  type: 'phone' | 'video' | 'onsite' | 'technical';
  scheduledAt: string;
  duration?: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  feedback?: string;
  rating?: number;
  notes?: string;
};
