import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Plus, Globe, Phone } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

export default function Clients() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const clients = state.clients || [];
  const filtered = clients.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
    const map: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary'> = {
      active: 'success',
      inactive: 'default',
      prospect: 'warning',
    };
    return map[status] ?? 'default';
  };

  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} total clients`}
        action={
          <Button>
            <Plus size={16} />
            Add Client
          </Button>
        }
      />

      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search clients..."
          icon={<Search size={16} />}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 size={40} />}
          title="No clients found"
          description="Try adjusting your search or add a new client."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          {filtered.map((client: any) => (
            <Card key={client.id} onClick={() => navigate(`/clients/${client.id}`)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ width: 40, height: 40, background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={20} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{client.name}</div>
                    {client.industry && <div style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>{client.industry}</div>}
                  </div>
                </div>
                <Badge variant={getStatusVariant(client.status || 'active')}>{client.status || 'active'}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {client.website && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-gray-500)' }}>
                    <Globe size={12} /> {client.website}
                  </span>
                )}
                {client.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-gray-500)' }}>
                    <Phone size={12} /> {client.phone}
                  </span>
                )}
                {client.openJobs !== undefined && (
                  <div style={{ marginTop: 'var(--spacing-2)', fontSize: 12, color: 'var(--color-gray-600)' }}>
                    {client.openJobs} open position{client.openJobs !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
