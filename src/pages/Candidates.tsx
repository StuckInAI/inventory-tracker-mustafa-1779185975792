import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import type { Candidate } from '@/types';

export default function Candidates() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', title: '', location: '' });

  const filtered = state.candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    const newCandidate: Candidate = {
      id: `ca${Date.now()}`,
      name: form.name,
      email: form.email,
      title: form.title,
      location: form.location,
      avatar: form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: 'ADD_CANDIDATE', payload: newCandidate });
    setShowModal(false);
    setForm({ name: '', email: '', title: '', location: '' });
  }

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Candidates"
        subtitle="Manage your candidate pipeline"
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Candidate
          </Button>
        }
      />

      <div style={{ marginBottom: '20px' }}>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search candidates..."
          icon={<Search size={16} />}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={40} />}
          title="No candidates found"
          description="Add your first candidate to get started."
          action={<Button onClick={() => setShowModal(true)}>Add Candidate</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filtered.map(candidate => (
            <Card key={candidate.id} onClick={() => navigate(`/candidates/${candidate.id}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Avatar initials={candidate.avatar} size="md" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{candidate.name}</div>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: '13px' }}>{candidate.title}</div>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-gray-600)', marginBottom: '8px' }}>{candidate.email}</div>
              {candidate.location && <div style={{ fontSize: '13px', color: 'var(--color-gray-500)' }}>{candidate.location}</div>}
              <div style={{ marginTop: '12px' }}>
                <Badge variant={candidate.status === 'active' ? 'success' : candidate.status === 'hired' ? 'primary' : 'danger'}>
                  {candidate.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Candidate">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" required />
          <Input label="Job Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          <Button onClick={handleAdd} fullWidth>Add Candidate</Button>
        </div>
      </Modal>
    </div>
  );
}
