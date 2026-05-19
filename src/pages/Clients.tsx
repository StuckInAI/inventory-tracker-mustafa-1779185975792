import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Building2 } from 'lucide-react';
import type { Client } from '@/types';

export default function Clients() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    industry: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    website: '',
  });

  const handleAdd = () => {
    const now = new Date().toISOString();
    const newClient: Client = {
      id: crypto.randomUUID(),
      name: form.name,
      industry: form.industry,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      website: form.website,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_CLIENT', payload: newClient });
    setShowModal(false);
    setForm({ name: '', industry: '', contactName: '', contactPhone: '', contactEmail: '', website: '' });
  };

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Clients"
        subtitle={`${state.clients.length} total clients`}
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Client
          </Button>
        }
      />

      {state.clients.length === 0 ? (
        <EmptyState
          icon={<Building2 size={40} />}
          title="No clients yet"
          description="Add your first client to get started."
          action={<Button onClick={() => setShowModal(true)}>Add Client</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          {state.clients.map(client => {
            const clientJobs = state.jobs.filter(j => j.clientId === client.id);
            const openJobs = clientJobs.filter(j => j.status === 'Open').length;
            return (
              <Card key={client.id} onClick={() => navigate(`/clients/${client.id}`)} padding="md">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Building2 size={24} color="var(--color-primary)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{client.name}</div>
                    <div style={{ color: 'var(--color-gray-500)', fontSize: '13px' }}>{client.industry} · {client.contactName}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Badge variant="secondary">{clientJobs.length} job{clientJobs.length !== 1 ? 's' : ''}</Badge>
                    {openJobs > 0 && <Badge variant="success">{openJobs} open</Badge>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Client">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Company Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Industry" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
          <Input label="Contact Name" value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} />
          <Input label="Contact Phone" value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} />
          <Input label="Contact Email" type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} />
          <Input label="Website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name}>Add Client</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
