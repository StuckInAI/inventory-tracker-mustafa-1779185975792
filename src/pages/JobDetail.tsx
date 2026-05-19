import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { ArrowLeft, MapPin, Briefcase, Users, Calendar } from 'lucide-react';
import styles from './JobDetail.module.css';
import { formatDate } from '@/lib/utils';

export default function JobDetail() {
  const { id } = useParams();
  const { state } = useAppContext();
  const navigate = useNavigate();

  const job = state.jobs.find(j => j.id === id);
  if (!job) return <div style={{ padding: 32 }}>Job not found.</div>;

  const candidates = state.candidates.filter(c => c.currentJobId === job.id);

  const getStatusVariant = (status: string) => {
    if (status === 'open') return 'success' as const;
    if (status === 'draft') return 'default' as const;
    return 'warning' as const;
  };

  const getCandidateStatusVariant = (status: string) => {
    if (status === 'hired') return 'success' as const;
    if (status === 'rejected') return 'danger' as const;
    return 'primary' as const;
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Button variant="ghost" onClick={() => navigate('/jobs')}><ArrowLeft size={16} /> Back to Jobs</Button>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.jobTitle}>{job.title}</h1>
          <div className={styles.jobMeta}>
            {job.clientName && <div className={styles.clientBadge}>{job.clientName}</div>}
            <span><Briefcase size={13} /> {job.department}</span>
            <span><MapPin size={13} /> {job.location}</span>
            <span><Users size={13} /> {job.candidatesCount ?? candidates.length} candidates</span>
            {job.postedAt && <span><Calendar size={13} /> Posted {formatDate(job.postedAt)}</span>}
          </div>
        </div>
        <div className={styles.heroRight}>
          <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.main}>
          {job.description && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.desc}>{job.description}</p>
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

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Candidates ({candidates.length})</h2>
            <div className={styles.candidateList}>
              {candidates.map(c => (
                <div key={c.id} className={styles.candidateCard} onClick={() => navigate(`/candidates/${c.id}`)}>
                  <Avatar initials={c.name.slice(0, 2).toUpperCase()} />
                  <div className={styles.candidateInfo}>
                    <div className={styles.candidateName}>{c.name}</div>
                    <div className={styles.candidateMeta}>{c.currentTitle ?? ''}{c.currentCompany ? ` · ${c.currentCompany}` : ''}</div>
                  </div>
                  <div className={styles.candidateRight}>
                    {c.currentStage && <div className={styles.stage}>{c.currentStage}</div>}
                    <Badge variant={getCandidateStatusVariant(c.status)}>{c.status}</Badge>
                  </div>
                </div>
              ))}
              {candidates.length === 0 && <div className={styles.empty}>No candidates yet.</div>}
            </div>
          </div>

          {job.pipeline && job.pipeline.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Pipeline</h2>
              <div className={styles.pipeline}>
                {job.pipeline.map(stage => {
                  const stageCandidates = state.candidates.filter(c => stage.candidateIds?.includes(c.id));
                  return (
                    <div key={stage.id} className={styles.pipelineStage}>
                      <div className={styles.pipelineStageName}>{stage.name} <span className={styles.pipelineCount}>{stageCandidates.length}</span></div>
                      <div className={styles.pipelineCards}>
                        {stageCandidates.map(c => (
                          <div key={c.id} className={styles.pipelineCard} onClick={() => navigate(`/candidates/${c.id}`)}>
                            <Avatar initials={c.name.slice(0, 2).toUpperCase()} size="sm" />
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
        </div>

        <div className={styles.sidebar}>
          <div className={styles.detailCard}>
            <h3 className={styles.detailTitle}>Details</h3>
            <div className={styles.detailRow}><span>Type</span><strong>{job.type}</strong></div>
            {job.salary && <div className={styles.detailRow}><span>Salary</span><strong>{job.salary}</strong></div>}
            {job.recruiterName && <div className={styles.detailRow}><span>Recruiter</span><strong>{job.recruiterName}</strong></div>}
            {job.closingDate && <div className={styles.detailRow}><span>Closes</span><strong>{formatDate(job.closingDate)}</strong></div>}
            <div className={styles.detailRow}><span>Posted</span><strong>{formatDate(job.createdAt)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
