import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Calendar, Building2, TrendingUp, Clock } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import PageHeader from '@/components/ui/PageHeader';
import { formatDate, timeAgo } from '@/lib/utils';
import styles from './Dashboard.module.css';
import type { CandidateStatus } from '@/types';

const statusVariant: Record<CandidateStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary'> = {
  New: 'default',
  Screening: 'secondary',
  Interview: 'primary',
  Offer: 'warning',
  Hired: 'success',
  Rejected: 'danger',
  Withdrawn: 'default',
};

export default function Dashboard() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const stats = useMemo(() => ({
    openJobs: state.jobs.filter(j => j.status === 'Open').length,
    totalCandidates: state.candidates.length,
    scheduledInterviews: state.interviews.filter(i => i.status === 'Scheduled').length,
    activeClients: state.clients.filter(c => c.status === 'Active').length,
  }), [state]);

  const recentCandidates = useMemo(() =>
    [...state.candidates]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
  , [state.candidates]);

  const upcomingInterviews = useMemo(() =>
    state.interviews
      .filter(i => i.status === 'Scheduled')
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 4)
  , [state.interviews]);

  const recentJobs = useMemo(() =>
    [...state.jobs]
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
      .slice(0, 4)
  , [state.jobs]);

  return (
    <div className={styles.page}>
      <PageHeader
        title={`Good morning, ${state.currentUser.name.split(' ')[0]} 👋`}
        subtitle="Here's what's happening with your recruitment pipeline today."
      />

      <div className={styles.statsGrid}>
        <StatCard label="Open Jobs" value={stats.openJobs} icon={<Briefcase size={20} />} trend="2 this week" trendUp color="primary" />
        <StatCard label="Total Candidates" value={stats.totalCandidates} icon={<Users size={20} />} trend="7 this week" trendUp color="secondary" />
        <StatCard label="Scheduled Interviews" value={stats.scheduledInterviews} icon={<Calendar size={20} />} color="warning" />
        <StatCard label="Active Clients" value={stats.activeClients} icon={<Building2 size={20} />} color="success" />
      </div>

      <div className={styles.grid}>
        <Card className={styles.recentCandidates}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}><Users size={16} /> Recent Candidates</h2>
            <button className={styles.viewAll} onClick={() => navigate('/candidates')}>View All</button>
          </div>
          <div className={styles.candidateList}>
            {recentCandidates.map(c => (
              <div key={c.id} className={styles.candidateRow} onClick={() => navigate(`/candidates/${c.id}`)}>
                <Avatar initials={c.name.split(' ').map(n => n[0]).join('')} size="sm" />
                <div className={styles.candidateInfo}>
                  <div className={styles.candidateName}>{c.name}</div>
                  <div className={styles.candidateMeta}>{c.currentTitle} · {c.currentCompany}</div>
                </div>
                <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <div className={styles.rightCol}>
          <Card>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Calendar size={16} /> Upcoming Interviews</h2>
              <button className={styles.viewAll} onClick={() => navigate('/interviews')}>View All</button>
            </div>
            {upcomingInterviews.length === 0 ? (
              <p className={styles.empty}>No upcoming interviews.</p>
            ) : (
              <div className={styles.interviewList}>
                {upcomingInterviews.map(interview => (
                  <div key={interview.id} className={styles.interviewRow}>
                    <div className={styles.interviewTime}>
                      <Clock size={13} />
                      {new Date(interview.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' '}
                      {new Date(interview.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className={styles.interviewName}>{interview.candidateName}</div>
                    <div className={styles.interviewRole}>{interview.jobTitle}</div>
                    <Badge variant="secondary">{interview.type}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><TrendingUp size={16} /> Active Jobs</h2>
              <button className={styles.viewAll} onClick={() => navigate('/jobs')}>View All</button>
            </div>
            <div className={styles.jobList}>
              {recentJobs.map(job => (
                <div key={job.id} className={styles.jobRow} onClick={() => navigate(`/jobs/${job.id}`)}>
                  <div>
                    <div className={styles.jobTitle}>{job.title}</div>
                    <div className={styles.jobMeta}>{job.clientName} · {formatDate(job.postedAt)}</div>
                  </div>
                  <div className={styles.jobRight}>
                    <span className={styles.jobCandidates}>{job.candidatesCount} candidates</span>
                    <Badge variant={job.status === 'Open' ? 'success' : job.status === 'Draft' ? 'default' : 'warning'}>{job.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className={styles.activityCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}><Clock size={16} /> Recent Activity</h2>
        </div>
        <div className={styles.activityList}>
          {state.candidates.flatMap(c => c.activities.map(a => ({ ...a, candidateName: c.name, candidateId: c.id }))).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8).map(act => (
            <div key={act.id} className={styles.activityRow}>
              <div className={styles.activityDot} />
              <div className={styles.activityContent}>
                <span className={styles.activityName} onClick={() => navigate(`/candidates/${act.candidateId}`)}>{act.candidateName}</span>
                {' — '}{act.description}
              </div>
              <div className={styles.activityTime}>{timeAgo(act.createdAt)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
