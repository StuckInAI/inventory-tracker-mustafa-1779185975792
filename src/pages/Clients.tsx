import { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import type { Client } from '@/types';
import styles from '@/pages/Jobs.module.css';

export default function Clients() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    industry: '',
    contactName: '',
    contactEmail: '',
  });

  const handleAdd = () => {
    const now = new Date().toISOString();
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: form.name,
      industry: form.industry,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_CLIENT', payload: newClient });
    setShowModal(false);
    setForm({ name: '', industry: '', contactName: '', contactEmail: '' });
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Clients"
        subtitle={`${state.clients.length} clients`}
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
        <div className={styles.grid}>
          {state.clients.map(client => (
            <div key={client.id} className={styles.card} onClick={() => navigate(`/clients/${client.id}`)}>
              <div className={styles.cardHeader}>
                <span className={styles.jobTitle}>{client.name}</span>
              </div>
              <div className={styles.meta}>
                <span>{client.industry}</span>
                <span>&middot;</span>
                <span>{client.contactName}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Client">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Company Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Industry" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
          <Input label="Contact Name" value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} />
          <Input label="Contact Email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name}>Add Client</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
