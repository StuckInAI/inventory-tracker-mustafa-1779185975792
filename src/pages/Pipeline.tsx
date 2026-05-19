import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import Avatar from '@/components/ui/Avatar';
import type { CandidateStatus } from '@/types';

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
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<CandidateStatus | null>(null);

  const handleDrop = (stage: CandidateStatus) => {
    if (dragId) {
      dispatch({ type: 'MOVE_CANDIDATE_STAGE', payload: { id: dragId, status: stage } });
      const candidate = state.candidates.find(c => c.id === dragId);
      if (candidate) {
        dispatch({
          type: 'ADD_ACTIVITY',
          payload: {
            id: crypto.randomUUID(),
            type: 'stage_change',
            message: `${candidate.name} moved to ${stage} stage`,
            userId: state.currentUser.id,
            candidateId: candidate.id,
            createdAt: new Date().toISOString(),
          },
        });
      }
    }
    setDragId(null);
    setDragOverStage(null);
  };

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader title="Hiring Pipeline" subtitle="Drag candidates between stages to update their status" />
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
        {STAGES.map(stage => {
          const stageCandidates = state.candidates.filter(c => c.status === stage);
          const isOver = dragOverStage === stage;
          return (
            <div
              key={stage}
              style={{
                minWidth: 260,
                flex: '0 0 260px',
                background: isOver ? 'var(--color-primary-light)' : 'var(--color-gray-50)',
                borderRadius: 12,
                padding: 12,
                transition: 'background 0.15s',
                border: isOver ? '2px dashed var(--color-primary)' : '2px dashed transparent',
              }}
              onDragOver={e => { e.preventDefault(); setDragOverStage(stage); }}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={() => handleDrop(stage)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <Badge variant={stageVariant[stage]}>{stage}</Badge>
                <span style={{ fontSize: 12, color: 'var(--color-gray-500)', fontWeight: 600 }}>{stageCandidates.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stageCandidates.map(candidate => {
                  const job = state.jobs.find(j => j.id === candidate.jobId);
                  return (
                    <div
                      key={candidate.id}
                      draggable
                      onDragStart={() => setDragId(candidate.id)}
                      onDragEnd={() => { setDragId(null); setDragOverStage(null); }}
                      style={{ cursor: 'grab' }}
                    >
                      <Card
                        padding="sm"
                        onClick={() => navigate(`/candidates/${candidate.id}`)}
                      >
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <Avatar initials={candidate.name.split(' ').map(n => n[0]).join('')} size="sm" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{candidate.name}</div>
                            {job && <div style={{ fontSize: 12, color: 'var(--color-gray-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>}
                          </div>
                          {candidate.matchScore !== undefined && (
                            <div style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: candidate.matchScore >= 85 ? 'var(--color-success-light)' : candidate.matchScore >= 70 ? 'var(--color-warning-light)' : 'var(--color-gray-100)',
                              color: candidate.matchScore >= 85 ? 'var(--color-success)' : candidate.matchScore >= 70 ? 'var(--color-warning)' : 'var(--color-gray-600)',
                            }}>
                              {candidate.matchScore}%
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  );
                })}
                {stageCandidates.length === 0 && (
                  <div style={{ fontSize: 12, color: 'var(--color-gray-400)', textAlign: 'center', padding: '20px 0' }}>Drop here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
