import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowLeft, Mail, Phone, Globe, Building2, User } from 'lucide-react';
import type { JobStatus } from '@/types';

function getJobStatusVariant(status: JobStatus) {
  switch (status) {
    case 'Open': return 'success' as const;
    case 'Closed': return 'danger' as const;
    case 'On Hold': return 'warning' as const;
    case 'Draft': return 'default' as const;
    default: return 'default' as const;
  }
}

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();

  const client = state.clients.find(c => c.id === id);
  if (!client) return <div style={{ padding: 32 }}>Client not found.</div>;

  const clientJobs = state.jobs.filter(j => j.clientId === client.id);
  const clientCandidates = state.candidates.filter(c =>
    clientJobs.some(j => j.id === c.jobId)
  );

  return (
    <div style={{ padding: 32 }}>
      <Button variant="ghost" size="sm" onClick={() => navigate('/clients')} style={{ marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Clients
      </Button>

      <PageHeader title={client.name} subtitle={client.industry} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginTop: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding="md">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Open Positions ({clientJobs.length})</h3>
            {clientJobs.length === 0 ? (
              <EmptyState title="No jobs" description="This client has no jobs yet." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {clientJobs.map(job => {
                  const count = state.candidates.filter(c => c.jobId === job.id).length;
                  return (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      style={{ padding: '12px 14px', background: 'var(--color-gray-50)', borderRadius: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{job.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>
                          {job.location} · {job.type} · {count} candidate{count !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <Badge variant={getJobStatusVariant(job.status)}>{job.status}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {client.notes && (
            <Card padding="md">
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Notes</h3>
              <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{client.notes}</p>
            </Card>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding="md">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', marginBottom: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={28} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{client.name}</div>
                <div style={{ color: 'var(--color-gray-500)', fontSize: 13 }}>{client.industry}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: 'var(--color-gray-700)' }}>
              {client.contactName && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <User size={15} /><span>{client.contactName}</span>
                </div>
              )}
              {client.contactEmail && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Mail size={15} /><span>{client.contactEmail}</span>
                </div>
              )}
              {client.contactPhone && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Phone size={15} /><span>{client.contactPhone}</span>
                </div>
              )}
              {client.website && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Globe size={15} /><a href={client.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>{client.website}</a>
                </div>
              )}
            </div>
          </Card>

          <Card padding="md">
            <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
              <span>Total Jobs</span>
              <strong>{clientJobs.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
              <span>Open Jobs</span>
              <strong>{clientJobs.filter(j => j.status === 'Open').length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
              <span>Total Candidates</span>
              <strong>{clientCandidates.length}</strong>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
