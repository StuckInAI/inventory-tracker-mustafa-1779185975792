import { useAppContext } from '@/hooks/useAppContext';
import styles from './Dashboard.module.css';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const openJobs = state.jobs.filter(j => j.status === 'open').length;
  const totalCandidates = state.candidates.length;
  const scheduledInterviews = state.interviews?.filter(i => i.status === 'scheduled').length ?? 0;
  const hiredCandidates = state.candidates.filter(c => c.status === 'hired').length;

  const recentJobs = state.jobs.slice(0, 5);

  const getJobBadgeVariant = (status: string) => {
    if (status === 'open') return 'success';
    if (status === 'draft') return 'default';
    return 'warning';
  };

  const getCandidateBadgeVariant = (status: string) => {
    if (status === 'hired') return 'success';
    if (status === 'rejected') return 'danger';
    return 'primary';
  };

  const recentActivities = state.candidates
    .flatMap(c => (c.activities ?? []).map(a => ({ ...a, candidateName: c.name, candidateId: c.id })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back, {state.currentUser.name}</p>
        </div>
      </div>

      <div className={styles.stats}>
        <StatCard title="Open Jobs" value={openJobs} icon={<Briefcase size={20} />} trend="+2 this week" />
        <StatCard title="Total Candidates" value={totalCandidates} icon={<Users size={20} />} trend="+12 this week" />
        <StatCard title="Scheduled Interviews" value={scheduledInterviews} icon={<Calendar size={20} />} trend="+3 today" />
        <StatCard title="Hired This Month" value={hiredCandidates} icon={<TrendingUp size={20} />} trend="+1 this week" />
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Jobs</h2>
          </div>
          <div className={styles.jobList}>
            {recentJobs.map(job => (
              <div key={job.id} className={styles.jobRow} onClick={() => navigate(`/jobs/${job.id}`)}>
                <div className={styles.jobInfo}>
                  <div className={styles.jobTitle}>{job.title}</div>
                  <div className={styles.jobMeta}>{job.department} · {job.location}</div>
                </div>
                <div className={styles.jobRight}>
                  <Badge variant={getJobBadgeVariant(job.status)}>{job.status}</Badge>
                  <span className={styles.candidateCount}>{job.candidatesCount ?? 0} candidates</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
          </div>
          <div className={styles.activityList}>
            {recentActivities.map(act => (
              <div key={act.id} className={styles.activityRow}>
                <Avatar initials={act.candidateName.slice(0, 2).toUpperCase()} size="sm" />
                <div className={styles.activityInfo}>
                  <div className={styles.activityText}><strong>{act.candidateName}</strong> {act.description}</div>
                  <div className={styles.activityTime}>{formatDate(act.createdAt)}</div>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className={styles.empty}>No recent activity</div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Candidates</h2>
        </div>
        <div className={styles.candidateList}>
          {state.candidates.slice(0, 6).map(c => (
            <div key={c.id} className={styles.candidateRow} onClick={() => navigate(`/candidates/${c.id}`)}>
              <Avatar initials={c.name.slice(0, 2).toUpperCase()} />
              <div className={styles.candidateInfo}>
                <div className={styles.candidateName}>{c.name}</div>
                <div className={styles.candidateMeta}>{c.currentTitle ?? ''}{c.currentCompany ? ` · ${c.currentCompany}` : ''}</div>
              </div>
              <Badge variant={getCandidateBadgeVariant(c.status)}>{c.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
