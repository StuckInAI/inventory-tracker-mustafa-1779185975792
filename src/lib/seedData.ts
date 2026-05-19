import { AppState, TeamMember, Client, Job, Candidate, Interview } from '@/types';

const team: TeamMember[] = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex@talentflow.io', role: 'Admin', avatar: 'AM', department: 'Operations', joinedAt: '2022-01-10', active: true },
  { id: 'u2', name: 'Jamie Chen', email: 'jamie@talentflow.io', role: 'Recruiter', avatar: 'JC', department: 'Recruiting', joinedAt: '2022-03-15', active: true },
  { id: 'u3', name: 'Sam Rivera', email: 'sam@talentflow.io', role: 'Recruiter', avatar: 'SR', department: 'Recruiting', joinedAt: '2022-06-01', active: true },
  { id: 'u4', name: 'Taylor Brooks', email: 'taylor@talentflow.io', role: 'Hiring Manager', avatar: 'TB', department: 'Engineering', joinedAt: '2023-01-20', active: true },
  { id: 'u5', name: 'Jordan Kim', email: 'jordan@talentflow.io', role: 'Interviewer', avatar: 'JK', department: 'Engineering', joinedAt: '2023-04-05', active: true },
  { id: 'u6', name: 'Casey Lee', email: 'casey@talentflow.io', role: 'Recruiter', avatar: 'CL', department: 'Recruiting', joinedAt: '2023-07-12', active: true },
];

const clients: Client[] = [
  { id: 'c1', name: 'Acme Corp', industry: 'Technology', website: 'acmecorp.com', contactName: 'Diana Prince', contactEmail: 'diana@acmecorp.com', contactPhone: '+1-555-0101', status: 'Active', logoInitials: 'AC', jobsCount: 4, placementsCount: 12, createdAt: '2022-02-01', notes: 'Key enterprise client. Prefers senior engineers.' },
  { id: 'c2', name: 'Nexus Health', industry: 'Healthcare', website: 'nexushealth.com', contactName: 'Bruce Banner', contactEmail: 'bruce@nexushealth.com', contactPhone: '+1-555-0202', status: 'Active', logoInitials: 'NH', jobsCount: 3, placementsCount: 8, createdAt: '2022-05-15', notes: 'Expanding rapidly. Needs clinical and tech talent.' },
  { id: 'c3', name: 'FinEdge', industry: 'Finance', website: 'finedge.io', contactName: 'Natasha Romanoff', contactEmail: 'natasha@finedge.io', contactPhone: '+1-555-0303', status: 'Active', logoInitials: 'FE', jobsCount: 2, placementsCount: 5, createdAt: '2022-08-20', notes: 'High compliance requirements.' },
  { id: 'c4', name: 'GreenPath', industry: 'Energy', website: 'greenpath.co', contactName: 'Tony Stark', contactEmail: 'tony@greenpath.co', contactPhone: '+1-555-0404', status: 'Prospect', logoInitials: 'GP', jobsCount: 1, placementsCount: 0, createdAt: '2023-09-01', notes: 'New prospect. Intro call scheduled.' },
  { id: 'c5', name: 'RetailBoost', industry: 'Retail', website: 'retailboost.com', contactName: 'Steve Rogers', contactEmail: 'steve@retailboost.com', contactPhone: '+1-555-0505', status: 'Inactive', logoInitials: 'RB', jobsCount: 0, placementsCount: 3, createdAt: '2021-11-10', notes: 'Previously active. Re-engage Q1.' },
];

const jobs: Job[] = [
  {
    id: 'j1', title: 'Senior Frontend Engineer', clientId: 'c1', clientName: 'Acme Corp',
    department: 'Engineering', location: 'San Francisco, CA (Hybrid)', type: 'Full-time',
    status: 'Open', salary: '$130,000 – $160,000',
    description: 'We are looking for a Senior Frontend Engineer to join our product team.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Experience with design systems'],
    postedAt: '2024-01-15', closingDate: '2024-03-01', recruiterId: 'u2', recruiterName: 'Jamie Chen',
    candidatesCount: 14,
    pipeline: [
      { id: 'p1-1', name: 'Applied', order: 1, candidateIds: ['cand1', 'cand3'] },
      { id: 'p1-2', name: 'Phone Screen', order: 2, candidateIds: ['cand2'] },
      { id: 'p1-3', name: 'Technical Interview', order: 3, candidateIds: ['cand4'] },
      { id: 'p1-4', name: 'Final Round', order: 4, candidateIds: [] },
      { id: 'p1-5', name: 'Offer', order: 5, candidateIds: [] },
    ]
  },
  {
    id: 'j2', title: 'Product Manager', clientId: 'c1', clientName: 'Acme Corp',
    department: 'Product', location: 'Remote', type: 'Full-time',
    status: 'Open', salary: '$120,000 – $150,000',
    description: 'Drive product strategy and roadmap for our core platform.',
    requirements: ['3+ years PM experience', 'B2B SaaS background', 'Strong analytical skills'],
    postedAt: '2024-01-20', closingDate: '2024-02-28', recruiterId: 'u3', recruiterName: 'Sam Rivera',
    candidatesCount: 9,
    pipeline: [
      { id: 'p2-1', name: 'Applied', order: 1, candidateIds: ['cand5'] },
      { id: 'p2-2', name: 'Phone Screen', order: 2, candidateIds: ['cand6'] },
      { id: 'p2-3', name: 'Case Study', order: 3, candidateIds: [] },
      { id: 'p2-4', name: 'Final Round', order: 4, candidateIds: [] },
      { id: 'p2-5', name: 'Offer', order: 5, candidateIds: [] },
    ]
  },
  {
    id: 'j3', title: 'Data Scientist', clientId: 'c2', clientName: 'Nexus Health',
    department: 'Data', location: 'New York, NY', type: 'Full-time',
    status: 'Open', salary: '$110,000 – $140,000',
    description: 'Build ML models to improve patient outcomes.',
    requirements: ['Python, SQL', 'ML/AI experience', 'Healthcare domain a plus'],
    postedAt: '2024-01-25', closingDate: '2024-03-15', recruiterId: 'u2', recruiterName: 'Jamie Chen',
    candidatesCount: 7,
    pipeline: [
      { id: 'p3-1', name: 'Applied', order: 1, candidateIds: ['cand7'] },
      { id: 'p3-2', name: 'Screen', order: 2, candidateIds: [] },
      { id: 'p3-3', name: 'Technical', order: 3, candidateIds: [] },
      { id: 'p3-4', name: 'Offer', order: 4, candidateIds: [] },
    ]
  },
  {
    id: 'j4', title: 'Compliance Officer', clientId: 'c3', clientName: 'FinEdge',
    department: 'Legal', location: 'Chicago, IL', type: 'Full-time',
    status: 'Open', salary: '$95,000 – $120,000',
    description: 'Ensure regulatory compliance across all financial operations.',
    requirements: ['5+ years compliance experience', 'FINRA/SEC knowledge', 'JD preferred'],
    postedAt: '2024-02-01', closingDate: '2024-03-30', recruiterId: 'u6', recruiterName: 'Casey Lee',
    candidatesCount: 5,
    pipeline: [
      { id: 'p4-1', name: 'Applied', order: 1, candidateIds: [] },
      { id: 'p4-2', name: 'Screen', order: 2, candidateIds: [] },
      { id: 'p4-3', name: 'Interview', order: 3, candidateIds: [] },
      { id: 'p4-4', name: 'Offer', order: 4, candidateIds: [] },
    ]
  },
  {
    id: 'j5', title: 'Renewable Energy Analyst', clientId: 'c4', clientName: 'GreenPath',
    department: 'Operations', location: 'Austin, TX (Hybrid)', type: 'Contract',
    status: 'Draft', salary: '$70 – $90/hr',
    description: 'Analyse energy market trends and model renewable projects.',
    requirements: ['Energy sector experience', 'Financial modelling', 'Excel/Python'],
    postedAt: '2024-02-10', closingDate: '2024-04-01', recruiterId: 'u3', recruiterName: 'Sam Rivera',
    candidatesCount: 2,
    pipeline: [
      { id: 'p5-1', name: 'Applied', order: 1, candidateIds: [] },
      { id: 'p5-2', name: 'Screen', order: 2, candidateIds: [] },
      { id: 'p5-3', name: 'Interview', order: 3, candidateIds: [] },
      { id: 'p5-4', name: 'Offer', order: 4, candidateIds: [] },
    ]
  },
];

const candidates: Candidate[] = [
  {
    id: 'cand1', name: 'Priya Patel', email: 'priya.patel@email.com', phone: '+1-555-1001',
    location: 'San Francisco, CA', currentTitle: 'Frontend Engineer', currentCompany: 'Startup Inc',
    experience: 6, skills: ['React', 'TypeScript', 'GraphQL', 'CSS'],
    status: 'Screening', source: 'LinkedIn', resumeUrl: '', linkedinUrl: 'linkedin.com/in/priyapatel',
    appliedJobIds: ['j1'], currentJobId: 'j1', currentStage: 'Applied', rating: 4,
    tags: ['Strong React', 'Remote OK'],
    notes: [{ id: 'n1', authorId: 'u2', authorName: 'Jamie Chen', content: 'Strong portfolio. Follow up on availability.', createdAt: '2024-01-16' }],
    activities: [
      { id: 'a1', type: 'application', description: 'Applied for Senior Frontend Engineer at Acme Corp', createdAt: '2024-01-15', authorName: 'System' },
      { id: 'a2', type: 'note_added', description: 'Note added by Jamie Chen', createdAt: '2024-01-16', authorName: 'Jamie Chen' },
    ],
    createdAt: '2024-01-15', updatedAt: '2024-01-16'
  },
  {
    id: 'cand2', name: 'Marcus Johnson', email: 'marcus.j@email.com', phone: '+1-555-1002',
    location: 'Oakland, CA', currentTitle: 'Senior UI Developer', currentCompany: 'TechCo',
    experience: 8, skills: ['React', 'Vue', 'TypeScript', 'Node.js'],
    status: 'Interview', source: 'Referral', resumeUrl: '', linkedinUrl: '',
    appliedJobIds: ['j1'], currentJobId: 'j1', currentStage: 'Phone Screen', rating: 5,
    tags: ['Top candidate', 'Fast mover'],
    notes: [],
    activities: [
      { id: 'a3', type: 'application', description: 'Referred by Jordan Kim for Senior Frontend Engineer', createdAt: '2024-01-17', authorName: 'Jordan Kim' },
      { id: 'a4', type: 'interview_scheduled', description: 'Phone screen scheduled', createdAt: '2024-01-20', authorName: 'Jamie Chen' },
    ],
    createdAt: '2024-01-17', updatedAt: '2024-01-20'
  },
  {
    id: 'cand3', name: 'Sofia Torres', email: 'sofia.t@email.com', phone: '+1-555-1003',
    location: 'Los Angeles, CA', currentTitle: 'UI/UX Developer', currentCompany: 'Agency XYZ',
    experience: 4, skills: ['React', 'Figma', 'CSS', 'JavaScript'],
    status: 'New', source: 'Job Board', resumeUrl: '', linkedinUrl: '',
    appliedJobIds: ['j1'], currentJobId: 'j1', currentStage: 'Applied', rating: 3,
    tags: [],
    notes: [],
    activities: [{ id: 'a5', type: 'application', description: 'Applied via Indeed', createdAt: '2024-01-18', authorName: 'System' }],
    createdAt: '2024-01-18', updatedAt: '2024-01-18'
  },
  {
    id: 'cand4', name: 'Aiden Park', email: 'aiden.park@email.com', phone: '+1-555-1004',
    location: 'Seattle, WA', currentTitle: 'Staff Engineer', currentCompany: 'BigTech',
    experience: 10, skills: ['React', 'TypeScript', 'AWS', 'System Design'],
    status: 'Interview', source: 'Direct Outreach', resumeUrl: '', linkedinUrl: '',
    appliedJobIds: ['j1'], currentJobId: 'j1', currentStage: 'Technical Interview', rating: 5,
    tags: ['Senior', 'High potential'],
    notes: [{ id: 'n2', authorId: 'u2', authorName: 'Jamie Chen', content: 'Exceptional system design skills. Strong hire.', createdAt: '2024-01-25' }],
    activities: [
      { id: 'a6', type: 'application', description: 'Direct outreach by Jamie Chen', createdAt: '2024-01-19', authorName: 'Jamie Chen' },
      { id: 'a7', type: 'stage_change', description: 'Moved to Technical Interview', createdAt: '2024-01-25', authorName: 'Jamie Chen' },
    ],
    createdAt: '2024-01-19', updatedAt: '2024-01-25'
  },
  {
    id: 'cand5', name: 'Lena Schmidt', email: 'lena.schmidt@email.com', phone: '+1-555-1005',
    location: 'New York, NY', currentTitle: 'Product Manager', currentCompany: 'SaaS Co',
    experience: 5, skills: ['Product Strategy', 'Agile', 'SQL', 'Figma'],
    status: 'Screening', source: 'LinkedIn', resumeUrl: '', linkedinUrl: '',
    appliedJobIds: ['j2'], currentJobId: 'j2', currentStage: 'Applied', rating: 4,
    tags: ['B2B SaaS'],
    notes: [],
    activities: [{ id: 'a8', type: 'application', description: 'Applied for Product Manager at Acme Corp', createdAt: '2024-01-22', authorName: 'System' }],
    createdAt: '2024-01-22', updatedAt: '2024-01-22'
  },
  {
    id: 'cand6', name: 'Omar Hassan', email: 'omar.h@email.com', phone: '+1-555-1006',
    location: 'Austin, TX', currentTitle: 'Senior PM', currentCompany: 'Enterprise Corp',
    experience: 7, skills: ['Product Roadmap', 'OKRs', 'Analytics', 'Stakeholder Mgmt'],
    status: 'Interview', source: 'Referral', resumeUrl: '', linkedinUrl: '',
    appliedJobIds: ['j2'], currentJobId: 'j2', currentStage: 'Phone Screen', rating: 4,
    tags: ['Enterprise background'],
    notes: [],
    activities: [{ id: 'a9', type: 'application', description: 'Referred for Product Manager role', createdAt: '2024-01-23', authorName: 'Sam Rivera' }],
    createdAt: '2024-01-23', updatedAt: '2024-01-23'
  },
  {
    id: 'cand7', name: 'Yuki Tanaka', email: 'yuki.t@email.com', phone: '+1-555-1007',
    location: 'Boston, MA', currentTitle: 'Data Scientist', currentCompany: 'BioTech Labs',
    experience: 4, skills: ['Python', 'ML', 'TensorFlow', 'SQL', 'R'],
    status: 'Screening', source: 'Job Board', resumeUrl: '', linkedinUrl: '',
    appliedJobIds: ['j3'], currentJobId: 'j3', currentStage: 'Applied', rating: 4,
    tags: ['Healthcare background', 'ML focus'],
    notes: [],
    activities: [{ id: 'a10', type: 'application', description: 'Applied for Data Scientist at Nexus Health', createdAt: '2024-01-26', authorName: 'System' }],
    createdAt: '2024-01-26', updatedAt: '2024-01-26'
  },
];

const interviews: Interview[] = [
  {
    id: 'int1', candidateId: 'cand2', candidateName: 'Marcus Johnson',
    jobId: 'j1', jobTitle: 'Senior Frontend Engineer', clientName: 'Acme Corp',
    type: 'Phone Screen', status: 'Scheduled', scheduledAt: '2024-02-15T10:00:00',
    duration: 45, interviewers: ['u2'], location: '', meetingLink: 'https://meet.google.com/abc-defg',
    feedback: [], notes: 'Focus on React architecture experience.'
  },
  {
    id: 'int2', candidateId: 'cand4', candidateName: 'Aiden Park',
    jobId: 'j1', jobTitle: 'Senior Frontend Engineer', clientName: 'Acme Corp',
    type: 'Technical', status: 'Scheduled', scheduledAt: '2024-02-16T14:00:00',
    duration: 90, interviewers: ['u4', 'u5'], location: 'Acme HQ, Room 3B', meetingLink: '',
    feedback: [], notes: 'System design + live coding.'
  },
  {
    id: 'int3', candidateId: 'cand6', candidateName: 'Omar Hassan',
    jobId: 'j2', jobTitle: 'Product Manager', clientName: 'Acme Corp',
    type: 'Video', status: 'Completed', scheduledAt: '2024-02-10T11:00:00',
    duration: 60, interviewers: ['u3', 'u4'], location: '', meetingLink: 'https://zoom.us/j/xyz',
    feedback: [
      { id: 'f1', interviewerId: 'u3', interviewerName: 'Sam Rivera', rating: 4, strengths: 'Strong roadmapping skills', weaknesses: 'Could improve on data-driven decisions', recommendation: 'Yes', submittedAt: '2024-02-10' }
    ],
    notes: 'Good cultural fit.'
  },
];

export const seedData: AppState = {
  currentUser: team[0],
  team,
  clients,
  jobs,
  candidates,
  interviews,
};
