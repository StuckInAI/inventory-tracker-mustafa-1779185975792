export type Role = 'Admin' | 'Recruiter' | 'Hiring Manager' | 'Interviewer';

export type JobStatus = 'Open' | 'Closed' | 'Draft' | 'On Hold';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type CandidateStatus =
  | 'New'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected'
  | 'Withdrawn';

export type InterviewType = 'Phone Screen' | 'Video' | 'Onsite' | 'Technical' | 'Panel';
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';

export type ClientStatus = 'Active' | 'Inactive' | 'Prospect';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department: string;
  joinedAt: string;
  active: boolean;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: ClientStatus;
  logoInitials: string;
  jobsCount: number;
  placementsCount: number;
  createdAt: string;
  notes: string;
}

export interface Job {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  salary: string;
  description: string;
  requirements: string[];
  postedAt: string;
  closingDate: string;
  recruiterId: string;
  recruiterName: string;
  candidatesCount: number;
  pipeline: PipelineStage[];
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  candidateIds: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  currentTitle: string;
  currentCompany: string;
  experience: number;
  skills: string[];
  status: CandidateStatus;
  source: string;
  resumeUrl: string;
  linkedinUrl: string;
  appliedJobIds: string[];
  currentJobId: string;
  currentStage: string;
  rating: number;
  tags: string[];
  notes: Note[];
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'stage_change' | 'note_added' | 'interview_scheduled' | 'email_sent' | 'status_change' | 'application';
  description: string;
  createdAt: string;
  authorName: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number;
  interviewers: string[];
  location: string;
  meetingLink: string;
  feedback: InterviewFeedback[];
  notes: string;
}

export interface InterviewFeedback {
  id: string;
  interviewerId: string;
  interviewerName: string;
  rating: number;
  strengths: string;
  weaknesses: string;
  recommendation: 'Strong Yes' | 'Yes' | 'Maybe' | 'No' | 'Strong No';
  submittedAt: string;
}

export interface AppState {
  currentUser: TeamMember;
  team: TeamMember[];
  clients: Client[];
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
}
