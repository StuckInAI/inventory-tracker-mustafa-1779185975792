import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Search } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import type { Client } from '@/types';

export default function Clients() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', industry: '', contact: '', email: '' });

  const filtered = state.clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    const newClient: Client = {
      id: `c${Date.now()}`,
      name: form.name,
      industry: form.industry,
      contact: form.contact,
      email: form.email,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: 'ADD_CLIENT', payload: newClient });
    setShowModal(false);
    setForm({ name: '', industry: '', contact: '', email: '' });
  }

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Clients"
        subtitle="Manage your client relationships"
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Client
          </Button>
        }
      />

      <div style={{ marginBottom: '20px' }}>
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
          description="Add your first client to get started."
          action={<Button onClick={() => setShowModal(true)}>Add Client</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filtered.map(client => (
            <Card key={client.id} onClick={() => navigate(`/clients/${client.id}`)}>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{client.name}</div>
              <div style={{ color: 'var(--color-gray-500)', fontSize: '13px', marginBottom: '4px' }}>{client.industry}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-gray-600)', marginBottom: '4px' }}>Contact: {client.contact}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-gray-600)', marginBottom: '12px' }}>{client.email}</div>
              <Badge variant={client.status === 'active' ? 'success' : 'default'}>{client.status}</Badge>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Client">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Company Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Industry" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
          <Input label="Contact Person" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" required />
          <Button onClick={handleAdd} fullWidth>Add Client</Button>
        </div>
      </Modal>
    </div>
  );
}
