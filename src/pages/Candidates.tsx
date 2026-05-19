import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Users } from 'lucide-react';
import type { CandidateStatus } from '@/types';

export default function Candidates() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new' as CandidateStatus,
    currentRole: '',
    location: '',
  });

  const handleAdd = () => {
    const now = new Date().toISOString();
    dispatch({
      type: 'ADD_CANDIDATE',
      payload: {
        id: crypto.randomUUID(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        status: form.status,
        currentRole: form.currentRole,
        location: form.location,
        avatar: form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        createdAt: now,
        updatedAt: now,
      },
    });
    setShowModal(false);
    setForm({ name: '', email: '', phone: '', status: 'new', currentRole: '', location: '' });
  };

  const getStatusVariant = (status: CandidateStatus) => {
    switch (status) {
      case 'new': return 'default';
      case 'screening': return 'secondary';
      case 'interview': return 'warning';
      case 'offer': return 'primary';
      case 'hired': return 'success';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Candidates"
        subtitle={`${state.candidates.length} total candidates`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Candidate
          </Button>
        }
      />

      {state.candidates.length === 0 ? (
        <EmptyState
          icon={<Users size={40} />}
          title="No candidates yet"
          description="Add your first candidate to get started."
          action={<Button onClick={() => setShowModal(true)}>Add Candidate</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          {state.candidates.map(candidate => (
            <Card key={candidate.id} onClick={() => navigate(`/candidates/${candidate.id}`)} padding="sm">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar initials={candidate.avatar || candidate.name.slice(0, 2).toUpperCase()} size="md" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{candidate.name}</div>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: '13px' }}>{candidate.currentRole || candidate.email}</div>
                </div>
                <Badge variant={getStatusVariant(candidate.status)}>
                  {candidate.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Candidate">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Input label="Current Role" value={form.currentRole} onChange={e => setForm(f => ({ ...f, currentRole: e.target.value }))} />
          <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          <Select
            label="Status"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as CandidateStatus }))}
            options={[
              { value: 'new', label: 'New' },
              { value: 'screening', label: 'Screening' },
              { value: 'interview', label: 'Interview' },
              { value: 'offer', label: 'Offer' },
              { value: 'hired', label: 'Hired' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
          <Button onClick={handleAdd} fullWidth>Add Candidate</Button>
        </div>
      </Modal>
    </div>
  );
}
