import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Globe, Phone, Mail, Briefcase } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAppContext();

  const clients = state.clients || [];
  const client = clients.find((c: any) => c.id === id);

  if (!client) {
    return (
      <div style={{ padding: 'var(--spacing-6)' }}>
        <Button variant="ghost" onClick={() => navigate('/clients')}>
          <ArrowLeft size={16} /> Back to Clients
        </Button>
        <p style={{ marginTop: 'var(--spacing-4)', color: 'var(--color-gray-500)' }}>Client not found.</p>
      </div>
    );
  }

  const clientJobs = state.jobs.filter((j: any) => j.clientId === client.id);

  const getStatusVariant = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
    const map: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary'> = {
      active: 'success', inactive: 'default', prospect: 'warning',
    };
    return map[status] ?? 'default';
  };

  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <Button variant="ghost" onClick={() => navigate('/clients')}>
          <ArrowLeft size={16} /> Back to Clients
        </Button>
      </div>

      <PageHeader title={client.name} subtitle={client.industry || 'Client'} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-5)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)', textAlign: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div style={{ width: 56, height: 56, background: 'var(--color-primary-light)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={28} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{client.name}</div>
                {client.industry && <div style={{ color: 'var(--color-gray-600)', fontSize: 13 }}>{client.industry}</div>}
                <div style={{ marginTop: 'var(--spacing-2)' }}>
                  <Badge variant={getStatusVariant(client.status || 'active')}>{client.status || 'active'}</Badge>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {client.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-gray-600)' }}>
                  <Globe size={14} /> {client.website}
                </div>
              )}
              {client.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-gray-600)' }}>
                  <Phone size={14} /> {client.phone}
                </div>
              )}
              {client.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-gray-600)' }}>
                  <Mail size={14} /> {client.email}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Card>
            <div style={{ fontWeight: 700, marginBottom: 'var(--spacing-4)', fontSize: 14 }}>Open Jobs ({clientJobs.length})</div>
            {clientJobs.length === 0 ? (
              <p style={{ color: 'var(--color-gray-500)', fontSize: 13 }}>No jobs for this client yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {clientJobs.map((job: any) => (
                  <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} onClick={() => navigate(`/jobs/${job.id}`)}>
                    <Briefcase size={16} style={{ color: 'var(--color-gray-400)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{job.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>{job.location}</div>
                    </div>
                    <Badge variant="default">{job.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {client.notes && (
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 'var(--spacing-3)', fontSize: 14 }}>Notes</div>
              <p style={{ fontSize: 13, color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{client.notes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
