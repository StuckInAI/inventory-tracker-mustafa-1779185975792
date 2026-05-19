import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const openJobs = state.jobs.filter(j => j.status === 'Open');
  const totalCandidates = state.candidates.length;
  const scheduledInterviews = state.interviews.filter(i => i.status === 'Scheduled');
  const hiredCandidates = state.candidates.filter(c => c.status === 'Hired');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Open': return 'success' as const;
      case 'Closed': return 'danger' as const;
      case 'On Hold': return 'warning' as const;
      case 'Draft': return 'default' as const;
      default: return 'default' as const;
    }
  };

  const getCandidateVariant = (status: string) => {
    switch (status) {
      case 'New': return 'default' as const;
      case 'Screening': return 'secondary' as const;
      case 'Interview': return 'primary' as const;
      case 'Offer': return 'warning' as const;
      case 'Hired': return 'success' as const;
      case 'Rejected': return 'danger' as const;
      default: return 'default' as const;
    }
  };

  const recentCandidates = [...state.candidates]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening today."
      />

      <div className={styles.stats}>
        <StatCard
          icon={<Briefcase size={20} />}
          label="Open Jobs"
          value={openJobs.length}
          color="primary"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Total Candidates"
          value={totalCandidates}
          color="secondary"
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="Scheduled Interviews"
          value={scheduledInterviews.length}
          color="warning"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Hired This Period"
          value={hiredCandidates.length}
          color="success"
        />
      </div>

      <div className={styles.grid}>
        <Card padding="none">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Active Jobs</h2>
          </div>
          {openJobs.slice(0, 5).length === 0 && (
            <EmptyState title="No open jobs" description="Create a new job to get started." />
          )}
          {openJobs.slice(0, 5).map(job => (
            <div
              key={job.id}
              className={styles.listItem}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div>
                <div className={styles.itemTitle}>{job.title}</div>
                <div className={styles.itemSub}>{job.location} · {job.type}</div>
              </div>
              <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
            </div>
          ))}
        </Card>

        <Card padding="none">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Candidates</h2>
          </div>
          {recentCandidates.length === 0 && (
            <EmptyState title="No candidates yet" description="Candidates will appear here." />
          )}
          {recentCandidates.map(candidate => (
            <div
              key={candidate.id}
              className={styles.listItem}
              onClick={() => navigate(`/candidates/${candidate.id}`)}
            >
              <div className={styles.candidateRow}>
                <Avatar initials={candidate.name.split(' ').map(n => n[0]).join('')} size="sm" />
                <div>
                  <div className={styles.itemTitle}>{candidate.name}</div>
                  <div className={styles.itemSub}>
                    {candidate.status}
                    {candidate.stage ? ` · ${candidate.stage}` : ''}
                  </div>
                </div>
              </div>
              <Badge variant={getCandidateVariant(candidate.status)}>{candidate.status}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
