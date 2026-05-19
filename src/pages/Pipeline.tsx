import React, { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

export default function Pipeline() {
  const { state } = useAppContext();

  const getStageApplications = (stage: string) =>
    state.applications.filter(a => a.stage === stage);

  const getVariant = (stage: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
    const map: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary'> = {
      Applied: 'default',
      Screening: 'secondary',
      Interview: 'primary',
      Offer: 'warning',
      Hired: 'success',
      Rejected: 'danger',
    };
    return map[stage] ?? 'default';
  };

  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <PageHeader
        title="Pipeline"
        subtitle="Track candidates through your hiring process"
      />
      <div style={{ display: 'flex', gap: 'var(--spacing-4)', overflowX: 'auto', paddingBottom: 'var(--spacing-4)' }}>
        {STAGES.map(stage => {
          const apps = getStageApplications(stage);
          return (
            <div key={stage} style={{ minWidth: 220, flex: '0 0 220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <Badge variant={getVariant(stage)}>{stage}</Badge>
                <span style={{ fontSize: 12, color: 'var(--color-gray-500)', fontWeight: 600 }}>{apps.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                {apps.map(app => {
                  const candidate = state.candidates.find(c => c.id === app.candidateId);
                  const job = state.jobs.find(j => j.id === app.jobId);
                  return (
                    <Card key={app.id} padding="sm">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <Avatar
                          initials={(candidate?.name || 'UN').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          size="sm"
                        />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {candidate?.name || 'Unknown'}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--color-gray-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {job?.title || 'Unknown Job'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {apps.length === 0 && (
                  <div style={{ padding: 'var(--spacing-4)', textAlign: 'center', color: 'var(--color-gray-400)', fontSize: 12, border: '1px dashed var(--color-gray-200)', borderRadius: 'var(--radius-md)' }}>
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
