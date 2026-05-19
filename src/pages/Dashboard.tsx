import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const hiredCount = useMemo(
    () => state.candidates.filter(c => c.status === 'hired').length,
    [state.candidates]
  );

  const openJobsCount = useMemo(
    () => state.jobs.filter(j => j.status === 'open').length,
    [state.jobs]
  );

  const scheduledInterviews = useMemo(
    () => state.interviews.filter(i => i.status === 'scheduled').length,
    [state.interviews]
  );

  const recentCandidates = useMemo(
    () => [...state.candidates].slice(0, 5),
    [state.candidates]
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Welcome back, {state.currentUser.name}</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          title="Open Jobs"
          value={openJobsCount}
          icon={<Briefcase size={20} />}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          title="Total Candidates"
          value={state.candidates.length}
          icon={<Users size={20} />}
          trend={{ value: 8, direction: 'up' }}
        />
        <StatCard
          title="Interviews Scheduled"
          value={scheduledInterviews}
          icon={<Calendar size={20} />}
        />
        <StatCard
          title="Hired This Month"
          value={hiredCount}
          icon={<TrendingUp size={20} />}
          trend={{ value: 5, direction: 'up' }}
        />
      </div>

      <div className={styles.mainGrid}>
        <Card padding="none">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Candidates</h2>
          </div>
          <div className={styles.list}>
            {recentCandidates.length === 0 && (
              <div className={styles.emptyList}>No candidates yet</div>
            )}
            {recentCandidates.map(candidate => (
              <div
                key={candidate.id}
                className={styles.listItem}
                onClick={() => navigate(`/candidates/${candidate.id}`)}
              >
                <Avatar
                  initials={candidate.avatar || candidate.name.slice(0, 2).toUpperCase()}
                  size="sm"
                />
                <div className={styles.listItemInfo}>
                  <span className={styles.listItemName}>{candidate.name}</span>
                  <span className={styles.listItemSub}>
                    {candidate.currentRole || candidate.email}
                    {candidate.stage ? ` · ${candidate.stage}` : ''}
                  </span>
                </div>
                <span className={`${styles.badge} ${styles[`badge_${candidate.status}`]}`}>
                  {candidate.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="none">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Open Positions</h2>
          </div>
          <div className={styles.list}>
            {state.jobs.filter(j => j.status === 'open').slice(0, 5).length === 0 && (
              <div className={styles.emptyList}>No open jobs</div>
            )}
            {state.jobs.filter(j => j.status === 'open').slice(0, 5).map(job => (
              <div
                key={job.id}
                className={styles.listItem}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className={styles.jobIcon}>
                  <Briefcase size={16} />
                </div>
                <div className={styles.listItemInfo}>
                  <span className={styles.listItemName}>{job.title}</span>
                  <span className={styles.listItemSub}>{job.department} &middot; {job.location}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
