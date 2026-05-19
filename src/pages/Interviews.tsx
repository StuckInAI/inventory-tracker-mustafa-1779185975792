import React, { useState } from 'react';
import { Calendar, Clock, User, Briefcase } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

export default function Interviews() {
  const { state } = useAppContext();

  const interviews = state.interviews || [];

  const getStatusVariant = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
    const map: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary'> = {
      scheduled: 'primary',
      completed: 'success',
      cancelled: 'danger',
      pending: 'warning',
    };
    return map[status] ?? 'default';
  };

  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <PageHeader
        title="Interviews"
        subtitle={`${interviews.length} scheduled interviews`}
        action={
          <Button>
            <Calendar size={16} />
            Schedule Interview
          </Button>
        }
      />

      {interviews.length === 0 ? (
        <EmptyState
          icon={<Calendar size={40} />}
          title="No interviews scheduled"
          description="Schedule interviews with candidates to see them here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {interviews.map((interview: any) => {
            const candidate = state.candidates.find(c => c.id === interview.candidateId);
            const job = state.jobs.find(j => j.id === interview.jobId);
            return (
              <Card key={interview.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{interview.type || 'Interview'}</span>
                      <Badge variant={getStatusVariant(interview.status)}>{interview.status}</Badge>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-gray-500)' }}>
                        <User size={12} /> {candidate?.name || 'Unknown Candidate'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-gray-500)' }}>
                        <Briefcase size={12} /> {job?.title || 'Unknown Job'}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {interview.date && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-gray-700)' }}>
                        <Calendar size={14} />
                        {new Date(interview.date).toLocaleDateString()}
                      </div>
                    )}
                    {interview.time && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-gray-500)', marginTop: 2 }}>
                        <Clock size={12} /> {interview.time}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
