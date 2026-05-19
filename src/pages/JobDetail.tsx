import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowLeft, MapPin, Briefcase, Users, DollarSign } from 'lucide-react';
import type { CandidateStatus } from '@/types';
import styles from './JobDetail.module.css';

function getCandidateVariant(status: CandidateStatus) {
  switch (status) {
    case 'New': return 'default';
    case 'Screening': return 'secondary';
    case 'Interview': return 'primary';
    case 'Offer': return 'warning';
    case 'Hired': return 'success';
    case 'Rejected': return 'danger';
    default: return 'default';
  }
}

function getJobStatusVariant(status: string) {
  switch (status) {
    case 'Open': return 'success' as const;
    case 'Closed': return 'danger' as const;
    case 'On Hold': return 'warning' as const;
    case 'Draft': return 'default' as const;
    default: return 'default' as const;
  }
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();

  const job = state.jobs.find(j => j.id === id);
  if (!job) return <div style={{ padding: 32 }}>Job not found.</div>;

  const candidates = state.candidates.filter(c => c.jobId === job.id);
  const client = state.clients.find(c => c.id === job.clientId);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')}>
          <ArrowLeft size={16} /> Back to Jobs
        </Button>
      </div>

      <PageHeader
        title={job.title}
        subtitle={client ? `Client: ${client.name}` : undefined}
        action={<Badge variant={getJobStatusVariant(job.status)}>{job.status}</Badge>}
      />

      <div className={styles.layout}>
        <div className={styles.main}>
          <Card padding="md">
            <h3 className={styles.sectionTitle}>Job Description</h3>
            <p className={styles.description}>{job.description}</p>

            {job.requirements && job.requirements.length > 0 && (
              <>
                <h3 className={styles.sectionTitle} style={{ marginTop: 20 }}>Requirements</h3>
                <ul className={styles.reqList}>
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </>
            )}
          </Card>

          <Card padding="none" style={{ marginTop: 20 }}>
            <div className={styles.candidatesHeader}>
              <h3 className={styles.sectionTitle}>Candidates ({candidates.length})</h3>
            </div>
            {candidates.length === 0 ? (
              <EmptyState
                title="No candidates yet"
                description="Candidates applied to this job will appear here."
              />
            ) : (
              candidates.map(candidate => (
                <div
                  key={candidate.id}
                  className={styles.candidateRow}
                  onClick={() => navigate(`/candidates/${candidate.id}`)}
                >
                  <Avatar
                    initials={candidate.name.split(' ').map(n => n[0]).join('')}
                    size="sm"
                  />
                  <div className={styles.candidateInfo}>
                    <div className={styles.candidateName}>{candidate.name}</div>
                    <div className={styles.candidateSub}>{candidate.email}</div>
                  </div>
                  <Badge variant={getCandidateVariant(candidate.status) as any}>
                    {candidate.status}
                  </Badge>
                </div>
              ))
            )}
          </Card>
        </div>

        <div className={styles.sidebar}>
          <Card padding="md">
            <h3 className={styles.sectionTitle}>Job Details</h3>
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <MapPin size={15} className={styles.detailIcon} />
                <span>{job.location}</span>
              </div>
              <div className={styles.detailItem}>
                <Briefcase size={15} className={styles.detailIcon} />
                <span>{job.type}</span>
              </div>
              <div className={styles.detailItem}>
                <Users size={15} className={styles.detailIcon} />
                <span>{candidates.length} candidate{candidates.length !== 1 ? 's' : ''}</span>
              </div>
              {job.salaryMin && job.salaryMax && (
                <div className={styles.detailItem}>
                  <DollarSign size={15} className={styles.detailIcon} />
                  <strong>
                    {job.salaryCurrency ?? '$'}{job.salaryMin.toLocaleString()} – {job.salaryCurrency ?? '$'}{job.salaryMax.toLocaleString()}
                  </strong>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
