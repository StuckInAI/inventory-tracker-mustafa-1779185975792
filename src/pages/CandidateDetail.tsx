import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import PageHeader from '@/components/ui/PageHeader';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import type { CandidateStatus } from '@/types';

function getStatusVariant(status: CandidateStatus) {
  switch (status) {
    case 'New': return 'default' as const;
    case 'Screening': return 'secondary' as const;
    case 'Interview': return 'primary' as const;
    case 'Offer': return 'warning' as const;
    case 'Hired': return 'success' as const;
    case 'Rejected': return 'danger' as const;
    default: return 'default' as const;
  }
}

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();

  const candidate = state.candidates.find(c => c.id === id);
  if (!candidate) return <div style={{ padding: 32 }}>Candidate not found.</div>;

  const job = state.jobs.find(j => j.id === candidate.jobId);
  const interviews = state.interviews.filter(i => i.candidateId === candidate.id);

  return (
    <div style={{ padding: 32 }}>
      <Button variant="ghost" size="sm" onClick={() => navigate('/candidates')} style={{ marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Candidates
      </Button>

      <PageHeader
        title={candidate.name}
        subtitle={candidate.email}
        action={<Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginTop: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding="md">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--color-gray-700)' }}>
                <Mail size={15} /><span>{candidate.email}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--color-gray-700)' }}>
                <Phone size={15} /><span>{candidate.phone}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--color-gray-700)' }}>
                <MapPin size={15} /><span>{candidate.location}</span>
              </div>
              {job && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--color-gray-700)' }}>
                  <Briefcase size={15} /><span>{job.title}</span>
                </div>
              )}
            </div>
          </Card>

          {candidate.skills && candidate.skills.length > 0 && (
            <Card padding="md">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {candidate.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </Card>
          )}

          {candidate.notes && (
            <Card padding="md">
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Notes</h3>
              <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{candidate.notes}</p>
            </Card>
          )}

          {interviews.length > 0 && (
            <Card padding="md">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Interviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {interviews.map(interview => (
                  <div key={interview.id} style={{ padding: '10px 12px', background: 'var(--color-gray-50)', borderRadius: 8 }}>
                    <div style={{ fontWeight: 600 }}>{interview.type} Interview</div>
                    <div style={{ fontSize: 13, color: 'var(--color-gray-500)' }}>
                      {new Date(interview.scheduledAt).toLocaleString()} · {interview.status}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card padding="md">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
              <Avatar initials={candidate.name.split(' ').map(n => n[0]).join('')} size="lg" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{candidate.name}</div>
                <div style={{ color: 'var(--color-gray-500)', fontSize: 13 }}>{candidate.experience} years experience</div>
              </div>
              <Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
