import React from 'react';
import { BarChart3, TrendingUp, Users, Briefcase, CheckCircle } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';

export default function Reports() {
  const { state } = useAppContext();

  const totalJobs = state.jobs.length;
  const totalCandidates = state.candidates.length;
  const totalApplications = state.applications.length;
  const hiredCount = state.applications.filter(a => a.stage === 'Hired').length;
  const conversionRate = totalApplications > 0 ? ((hiredCount / totalApplications) * 100).toFixed(1) : '0';

  const stageBreakdown = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map(stage => ({
    stage,
    count: state.applications.filter(a => a.stage === stage).length,
  }));

  const maxCount = Math.max(...stageBreakdown.map(s => s.count), 1);

  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <PageHeader
        title="Reports"
        subtitle="Analytics and insights for your recruitment pipeline"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <StatCard
          title="Total Jobs"
          value={totalJobs}
          icon={<Briefcase size={20} />}
        />
        <StatCard
          title="Candidates"
          value={totalCandidates}
          icon={<Users size={20} />}
        />
        <StatCard
          title="Applications"
          value={totalApplications}
          icon={<BarChart3 size={20} />}
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={<TrendingUp size={20} />}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-5)' }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 'var(--spacing-4)' }}>Pipeline Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {stageBreakdown.map(({ stage, count }) => (
              <div key={stage}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-gray-700)' }}>{stage}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ height: 6, background: 'var(--color-gray-100)', borderRadius: 9999 }}>
                  <div style={{ height: '100%', width: `${(count / maxCount) * 100}%`, background: 'var(--color-primary)', borderRadius: 9999, transition: 'width 0.3s' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 'var(--spacing-4)' }}>Hiring Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', background: 'var(--color-success-light)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle size={20} style={{ color: '#15803d' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{hiredCount}</div>
                <div style={{ fontSize: 12, color: '#15803d' }}>Total Hired</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-gray-600)', lineHeight: 1.7 }}>
              <div>Active Jobs: <strong>{state.jobs.filter(j => j.status === 'active').length}</strong></div>
              <div>Total Clients: <strong>{(state.clients || []).length}</strong></div>
              <div>Avg. Applications/Job: <strong>{totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : '0'}</strong></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
