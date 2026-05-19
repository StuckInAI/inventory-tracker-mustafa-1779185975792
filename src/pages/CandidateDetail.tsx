import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAppContext();

  const candidate = state.candidates.find(c => c.id === id);

  if (!candidate) {
    return (
      <div style={{ padding: 'var(--spacing-6)' }}>
        <Button variant="ghost" onClick={() => navigate('/candidates')}>
          <ArrowLeft size={16} /> Back to Candidates
        </Button>
        <p style={{ marginTop: 'var(--spacing-4)', color: 'var(--color-gray-500)' }}>Candidate not found.</p>
      </div>
    );
  }

  const applications = state.applications.filter(a => a.candidateId === candidate.id);

  const getStatusVariant = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
    const map: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary'> = {
      active: 'success', inactive: 'default', placed: 'primary', blacklisted: 'danger',
    };
    return map[status] ?? 'default';
  };

  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <Button variant="ghost" onClick={() => navigate('/candidates')}>
          <ArrowLeft size={16} /> Back to Candidates
        </Button>
      </div>

      <PageHeader
        title={candidate.name}
        subtitle={candidate.currentTitle || 'Candidate'}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-5)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)', textAlign: 'center' }}>
              <Avatar initials={candidate.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)} size="lg" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{candidate.name}</div>
                {candidate.currentTitle && <div style={{ color: 'var(--color-gray-600)', fontSize: 13 }}>{candidate.currentTitle}</div>}
                <div style={{ marginTop: 'var(--spacing-2)' }}>
                  <Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {candidate.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-gray-600)' }}>
                  <Mail size={14} /> {candidate.email}
                </div>
              )}
              {candidate.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-gray-600)' }}>
                  <Phone size={14} /> {candidate.phone}
                </div>
              )}
              {candidate.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-gray-600)' }}>
                  <MapPin size={14} /> {candidate.location}
                </div>
              )}
            </div>
          </Card>

          {candidate.skills && candidate.skills.length > 0 && (
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 'var(--spacing-3)', fontSize: 14 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {candidate.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Card>
            <div style={{ fontWeight: 700, marginBottom: 'var(--spacing-4)', fontSize: 14 }}>Applications ({applications.length})</div>
            {applications.length === 0 ? (
              <p style={{ color: 'var(--color-gray-500)', fontSize: 13 }}>No applications yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {applications.map(app => {
                  const job = state.jobs.find(j => j.id === app.jobId);
                  return (
                    <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                      <Briefcase size={16} style={{ color: 'var(--color-gray-400)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{job?.title || 'Unknown Job'}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>{app.stage}</div>
                      </div>
                      <Badge variant="default">{app.stage}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {candidate.notes && (
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 'var(--spacing-3)', fontSize: 14 }}>Notes</div>
              <p style={{ fontSize: 13, color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{candidate.notes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
