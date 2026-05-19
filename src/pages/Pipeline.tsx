import { useAppContext } from '@/hooks/useAppContext';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import Avatar from '@/components/ui/Avatar';
import type { CandidateStatus } from '@/types';
import styles from './Dashboard.module.css';

const STAGES: CandidateStatus[] = ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

const stageVariant: Record<CandidateStatus, 'default' | 'secondary' | 'primary' | 'warning' | 'success' | 'danger'> = {
  New: 'default',
  Screening: 'secondary',
  Interview: 'primary',
  Offer: 'warning',
  Hired: 'success',
  Rejected: 'danger',
};

export default function Pipeline() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader title="Pipeline" subtitle="Visual candidate pipeline by stage" />
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
        {STAGES.map(stage => {
          const stageCandidates = state.candidates.filter(c => c.status === stage);
          return (
            <div key={stage} style={{ minWidth: 220, flex: '0 0 220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Badge variant={stageVariant[stage]}>{stage}</Badge>
                <span style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>{stageCandidates.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stageCandidates.map(candidate => {
                  const job = state.jobs.find(j => j.id === candidate.jobId);
                  return (
                    <Card
                      key={candidate.id}
                      padding="sm"
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                    >
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Avatar initials={candidate.name.split(' ').map(n => n[0]).join('')} size="sm" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{candidate.name}</div>
                          {job && <div style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>{job.title}</div>}
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {stageCandidates.length === 0 && (
                  <div style={{ fontSize: 12, color: 'var(--color-gray-400)', textAlign: 'center', padding: '16px 0' }}>Empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
