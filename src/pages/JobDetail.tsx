import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import { Users, MapPin, Briefcase, Calendar, ArrowLeft, DollarSign, Building2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import styles from './JobDetail.module.css';
import type { CandidateStatus } from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getJobStatusVariant(status: string) {
  switch (status) {
    case 'open': return 'success';
    case 'closed': return 'danger';
    case 'draft': return 'default';
    case 'on-hold': return 'warning';
    default: return 'default';
  }
}

function getCandidateStatusVariant(status: CandidateStatus) {
  switch (status) {
    case 'new': return 'default';
    case 'screening': return 'secondary';
    case 'interview': return 'primary';
    case 'offer': return 'warning';
    case 'hired': return 'success';
    case 'rejected': return 'danger';
    default: return 'default';
  }
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAppContext();

  const job = state.jobs.find(j => j.id === id);
  if (!job) return <div className={styles.notFound}>Job not found.</div>;

  const candidates = state.candidates.filter(c => c.currentJobId === job.id || c.jobId === job.id);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/jobs')}>
          <ArrowLeft size={16} /> Back to Jobs
        </button>
        <div className={styles.headerMain}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{job.title}</h1>
            <Badge variant={getJobStatusVariant(job.status)}>{job.status}</Badge>
          </div>
          <div className={styles.meta}>
            {job.clientName && <div className={styles.clientBadge}>{job.clientName}</div>}
            <span><MapPin size={13} /> {job.location}</span>
            <span><Briefcase size={13} /> {job.department}</span>
            <span><Users size={13} /> {job.candidatesCount ?? candidates.length} candidates</span>
            {job.postedAt && <span><Calendar size={13} /> Posted {formatDate(job.postedAt)}</span>}
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm">Edit Job</Button>
          <Button size="sm">Add Candidate</Button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.main}>
          {candidates.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Candidates ({candidates.length})</h2>
              <div className={styles.candidateList}>
                {candidates.map(c => (
                  <div key={c.id} className={styles.candidateCard} onClick={() => navigate(`/candidates/${c.id}`)}
                  >
                    <Avatar initials={c.name.split(' ').map(n => n[0]).join('').slice(0, 2)} size="md" />
                    <div className={styles.candidateInfo}>
                      <div className={styles.candidateName}>{c.name}</div>
                      <div className={styles.candidateMeta}>{c.currentTitle ?? ''}{c.currentCompany ? ` · ${c.currentCompany}` : ''}</div>
                    </div>
                    <div className={styles.candidateBadges}>
                      {c.currentStage && <div className={styles.stage}>{c.currentStage}</div>}
                      <Badge variant={getCandidateStatusVariant(c.status)}>{c.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {job.pipeline && job.pipeline.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Pipeline Stages</h2>
              <div className={styles.pipelineBoard}>
                {job.pipeline.map(stage => {
                  const stageCandidates = candidates.filter(c => c.currentStage === stage);
                  return (
                    <div key={stage} className={styles.pipelineColumn}>
                      <div className={styles.pipelineColumnHeader}>
                        <span>{stage}</span>
                        <span className={styles.pipelineCount}>{stageCandidates.length}</span>
                      </div>
                      <div className={styles.pipelineCards}>
                        {stageCandidates.map(c => (
                          <div key={c.id} className={styles.pipelineCard} onClick={() => navigate(`/candidates/${c.id}`)}>
                            <Avatar initials={c.name.split(' ').map(n => n[0]).join('').slice(0, 2)} size="sm" />
                            <div>
                              <div className={styles.pipelineCardName}>{c.name}</div>
                              <div className={styles.pipelineCardRole}>{c.currentTitle ?? ''}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {job.description && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.description}>{job.description}</p>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Requirements</h2>
              <ul className={styles.reqList}>
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.detailCard}>
            <h3 className={styles.detailTitle}>Details</h3>
            <div className={styles.detailRow}><span>Status</span><Badge variant={getJobStatusVariant(job.status)}>{job.status}</Badge></div>
            <div className={styles.detailRow}><span>Type</span><strong>{job.type}</strong></div>
            <div className={styles.detailRow}><span>Department</span><strong>{job.department}</strong></div>
            <div className={styles.detailRow}><span>Location</span><strong>{job.location}</strong></div>
            {job.salary && (
              <div className={styles.detailRow}>
                <span>Salary</span>
                <strong>{job.salary.currency}{job.salary.min.toLocaleString()} – {job.salary.currency}{job.salary.max.toLocaleString()}</strong>
              </div>
            )}
            {job.recruiterName && <div className={styles.detailRow}><span>Recruiter</span><strong>{job.recruiterName}</strong></div>}
            {job.closingDate && <div className={styles.detailRow}><span>Closes</span><strong>{formatDate(job.closingDate)}</strong></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
