import { useMemo } from 'react';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import StatCard from '@/components/ui/StatCard';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { state } = useAppContext();

  const openJobs = useMemo(() => state.jobs.filter(j => j.status === 'open').length, [state.jobs]);
  const totalCandidates = useMemo(() => state.candidates.length, [state.candidates]);
  const scheduledInterviews = useMemo(
    () => state.interviews.filter(i => i.status === 'scheduled').length,
    [state.interviews]
  );
  const hiredCandidates = useMemo(
    () => state.candidates.filter(c => c.stage === 'hired').length,
    [state.candidates]
  );

  const recentJobs = useMemo(() => state.jobs.slice(0, 5), [state.jobs]);
  const recentCandidates = useMemo(() => state.candidates.slice(0, 5), [state.candidates]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome back, {state.currentUser.name}</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Open Jobs" value={openJobs} icon={<Briefcase size={20} />} trend="+2 this week" />
        <StatCard label="Total Candidates" value={totalCandidates} icon={<Users size={20} />} trend="+12 this week" />
        <StatCard label="Scheduled Interviews" value={scheduledInterviews} icon={<Calendar size={20} />} trend="+3 today" />
        <StatCard label="Hired This Month" value={hiredCandidates} icon={<TrendingUp size={20} />} trend="+1 this week" />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Jobs</h2>
          <div className={styles.list}>
            {recentJobs.map(job => (
              <div key={job.id} className={styles.listItem}>
                <div className={styles.listItemMain}>
                  <span className={styles.listItemTitle}>{job.title}</span>
                  <span className={styles.listItemSub}>{job.department} &middot; {job.location}</span>
                </div>
                <span className={`${styles.badge} ${styles[`badge_${job.status}`]}`}>{job.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Candidates</h2>
          <div className={styles.list}>
            {recentCandidates.map(candidate => (
              <div key={candidate.id} className={styles.listItem}>
                <div className={styles.listItemMain}>
                  <span className={styles.listItemTitle}>{candidate.name}</span>
                  <span className={styles.listItemSub}>{candidate.currentRole} &middot; {candidate.stage}</span>
                </div>
                <span className={`${styles.badge} ${styles[`badge_${candidate.stage}`]}`}>{candidate.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
