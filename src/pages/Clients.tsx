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

export default function Clients() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    industry: '',
    contactName: '',
    phone: '',
    email: '',
  });

  const handleAdd = () => {
    const now = new Date().toISOString();
    dispatch({
      type: 'ADD_CLIENT',
      payload: {
        id: crypto.randomUUID(),
        name: form.name,
        industry: form.industry,
        contactName: form.contactName,
        phone: form.phone,
        email: form.email,
        status: 'active',
        createdAt: now,
      },
    });
    setShowModal(false);
    setForm({ name: '', industry: '', contactName: '', phone: '', email: '' });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success' as const;
      case 'inactive': return 'danger' as const;
      default: return 'default' as const;
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Clients"
        subtitle={`${state.clients.length} total clients`}
        actions={
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
          {state.clients.map(client => (
            <Card key={client.id} onClick={() => navigate(`/clients/${client.id}`)} padding="sm">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Building2 size={24} color="var(--color-primary)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{client.name}</div>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: '13px' }}>{client.industry}</div>
                </div>
                {client.status && (
                  <Badge variant={getStatusVariant(client.status)}>{client.status}</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Client">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Company Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Industry" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
          <Input label="Contact Name" value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Button onClick={handleAdd} fullWidth>Add Client</Button>
        </div>
      </Modal>
    </div>
  );
}
