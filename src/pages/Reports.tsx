import { BarChart3, Briefcase, Users, FileText } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';

export default function Reports() {
  const { state } = useAppContext();

  const totalJobs = state.jobs.length;
  const totalCandidates = state.candidates.length;
  const totalApplications = state.applications.length;
  const hired = state.applications.filter(a => a.stage === 'hired').length;
  const conversionRate = totalApplications > 0 ? ((hired / totalApplications) * 100).toFixed(1) + '%' : '0%';

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader title="Reports" subtitle="Recruitment analytics and insights" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard
          label="Total Jobs"
          value={totalJobs}
          icon={<Briefcase size={20} />}
        />
        <StatCard
          label="Candidates"
          value={totalCandidates}
          icon={<Users size={20} />}
        />
        <StatCard
          label="Applications"
          value={totalApplications}
          icon={<FileText size={20} />}
        />
        <StatCard
          label="Conversion Rate"
          value={conversionRate}
          icon={<BarChart3 size={20} />}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card>
          <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>Applications by Stage</h3>
          {['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'].map(stage => {
            const count = state.applications.filter(a => a.stage === stage).length;
            const pct = totalApplications > 0 ? (count / totalApplications) * 100 : 0;
            return (
              <div key={stage} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                  <span style={{ textTransform: 'capitalize' }}>{stage}</span>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ height: '6px', background: 'var(--color-gray-100)', borderRadius: '9999px' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-primary)', borderRadius: '9999px' }} />
                </div>
              </div>
            );
          })}
        </Card>

        <Card>
          <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>Jobs by Status</h3>
          {['open', 'closed', 'draft', 'on-hold'].map(status => {
            const count = state.jobs.filter(j => j.status === status).length;
            return (
              <div key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-gray-100)', fontSize: '13px' }}>
                <span style={{ textTransform: 'capitalize' }}>{status}</span>
                <span style={{ fontWeight: 700 }}>{count}</span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
