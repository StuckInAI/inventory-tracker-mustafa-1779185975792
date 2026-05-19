import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ArrowLeft, Building2, Phone, Mail, Globe } from 'lucide-react';

export default function ClientDetail() {
  const { id } = useParams();
  const { state } = useAppContext();
  const navigate = useNavigate();

  const client = state.clients.find(c => c.id === id);

  if (!client) {
    return (
      <div style={{ padding: '32px' }}>
        <Button variant="ghost" onClick={() => navigate('/clients')}>
          <ArrowLeft size={16} /> Back to Clients
        </Button>
        <p style={{ marginTop: '24px', color: 'var(--color-gray-500)' }}>Client not found.</p>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success' as const;
      case 'inactive': return 'danger' as const;
      default: return 'default' as const;
    }
  };

  const clientJobs = state.jobs.filter(j => j.clientId === client.id);

  return (
    <div style={{ padding: '32px' }}>
      <Button variant="ghost" onClick={() => navigate('/clients')} style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Clients
      </Button>

      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
          <Building2 size={40} color="var(--color-primary)" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700 }}>{client.name}</h1>
              {client.status && (
                <Badge variant={getStatusVariant(client.status)}>{client.status}</Badge>
              )}
            </div>
            {client.industry && (
              <p style={{ color: 'var(--color-gray-500)', marginTop: '4px' }}>{client.industry}</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {client.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gray-600)' }}>
              <Phone size={14} /> {client.phone}
            </div>
          )}
          {client.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gray-600)' }}>
              <Mail size={14} /> {client.email}
            </div>
          )}
          {client.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gray-600)' }}>
              <Globe size={14} /> {client.website}
            </div>
          )}
        </div>
      </Card>

      {clientJobs.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Associated Jobs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {clientJobs.map(job => (
              <Card key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} padding="sm">
                <div style={{ fontWeight: 600 }}>{job.title}</div>
                <div style={{ color: 'var(--color-gray-500)', fontSize: '13px' }}>{job.department} &middot; {job.location}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
