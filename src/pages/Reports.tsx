import { BarChart3, Briefcase, Users, Calendar, TrendingUp, Clock, Target, Award } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import type { CandidateStatus, JobStatus } from '@/types';

export default function Reports() {
  const { state } = useAppContext();

  const totalJobs = state.jobs.length;
  const totalCandidates = state.candidates.length;
  const totalInterviews = state.interviews.length;
  const hired = state.candidates.filter(c => c.status === 'Hired').length;
  const conversionRate = totalCandidates > 0 ? ((hired / totalCandidates) * 100).toFixed(1) + '%' : '0%';

  const stages: CandidateStatus[] = ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
  const jobStatuses: JobStatus[] = ['Open', 'Closed', 'On Hold', 'Draft'];

  // Time-to-hire (average days between candidate creation and hire — using updatedAt as proxy)
  const hiredCandidates = state.candidates.filter(c => c.status === 'Hired');
  const avgTimeToHire = hiredCandidates.length > 0
    ? Math.round(
        hiredCandidates.reduce((sum, c) => {
          const days = (new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / hiredCandidates.length
      )
    : 0;

  // Top clients by candidate volume
  const clientStats = state.clients.map(client => {
    const clientJobs = state.jobs.filter(j => j.clientId === client.id);
    const clientCandidates = state.candidates.filter(c =>
      clientJobs.some(j => j.id === c.jobId)
    );
    return { client, jobCount: clientJobs.length, candidateCount: clientCandidates.length };
  }).sort((a, b) => b.candidateCount - a.candidateCount);

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader title="Reports & Analytics" subtitle="Recruitment performance and insights" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Total Jobs" value={totalJobs} icon={<Briefcase size={20} />} color="primary" />
        <StatCard label="Candidates" value={totalCandidates} icon={<Users size={20} />} color="secondary" />
        <StatCard label="Interviews" value={totalInterviews} icon={<Calendar size={20} />} color="warning" />
        <StatCard label="Hired" value={hired} icon={<Award size={20} />} color="success" />
        <StatCard label="Conversion Rate" value={conversionRate} icon={<Target size={20} />} color="primary" />
        <StatCard label="Avg. Time to Hire" value={`${avgTimeToHire}d`} icon={<Clock size={20} />} color="secondary" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <Card padding="md">
          <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={16} /> Candidates by Stage
          </h3>
          {stages.map(stage => {
            const count = state.candidates.filter(c => c.status === stage).length;
            const pct = totalCandidates > 0 ? (count / totalCandidates) * 100 : 0;
            return (
              <div key={stage} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                  <span>{stage}</span>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ height: '6px', background: 'var(--color-gray-100)', borderRadius: '9999px' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-primary)', borderRadius: '9999px', transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })}
        </Card>

        <Card padding="md">
          <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Briefcase size={16} /> Jobs by Status
          </h3>
          {jobStatuses.map(status => {
            const count = state.jobs.filter(j => j.status === status).length;
            const pct = totalJobs > 0 ? (count / totalJobs) * 100 : 0;
            return (
              <div key={status} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                  <span>{status}</span>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ height: '6px', background: 'var(--color-gray-100)', borderRadius: '9999px' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-secondary)', borderRadius: '9999px', transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      <Card padding="md">
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={16} /> Top Clients by Pipeline Volume
        </h3>
        {clientStats.length === 0 ? (
          <div style={{ color: 'var(--color-gray-500)', fontSize: 13 }}>No client data available.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {clientStats.map(({ client, jobCount, candidateCount }) => (
              <div key={client.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--color-gray-50)', borderRadius: 8, fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{client.name}</div>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: 12 }}>{client.industry}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div><strong>{jobCount}</strong> jobs</div>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: 12 }}>{candidateCount} candidates</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
