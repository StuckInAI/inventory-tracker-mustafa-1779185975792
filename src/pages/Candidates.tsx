import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import Avatar from '@/components/ui/Avatar';
import { Users, Plus } from 'lucide-react';
import type { CandidateStatus } from '@/types';
import type { Candidate } from '@/types';
import styles from './Jobs.module.css';

type FormState = {
  name: string;
  email: string;
  phone: string;
  jobId: string;
  status: CandidateStatus;
  skills: string;
  experience: string;
  location: string;
  notes: string;
};

export default function Candidates() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    jobId: '',
    status: 'New',
    skills: '',
    experience: '',
    location: '',
    notes: '',
  });

  const handleSubmit = () => {
    const now = new Date().toISOString();
    const newCandidate: Candidate = {
      id: crypto.randomUUID(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      jobId: form.jobId,
      status: form.status,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      experience: parseInt(form.experience) || 0,
      location: form.location,
      notes: form.notes,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_CANDIDATE', payload: newCandidate });
    setShowModal(false);
    setForm({ name: '', email: '', phone: '', jobId: '', status: 'New', skills: '', experience: '', location: '', notes: '' });
  };

  const getStatusVariant = (status: CandidateStatus) => {
    switch (status) {
      case 'New': return 'default' as const;
      case 'Screening': return 'secondary' as const;
      case 'Interview': return 'primary' as const;
      case 'Offer': return 'warning' as const;
      case 'Hired': return 'success' as const;
      case 'Rejected': return 'danger' as const;
      default: return 'default' as const;
    }
  };

  const jobOptions = state.jobs.map(j => ({ value: j.id, label: j.title }));

  return (
    <div className={styles.page}>
      <PageHeader
        title="Candidates"
        subtitle="Manage all candidates"
        action={
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
        <div className={styles.grid}>
          {state.candidates.map(candidate => {
            const job = state.jobs.find(j => j.id === candidate.jobId);
            return (
              <Card key={candidate.id} padding="md" onClick={() => navigate(`/candidates/${candidate.id}`)}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Avatar initials={candidate.name.split(' ').map(n => n[0]).join('')} size="md" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{candidate.name}</div>
                    <div style={{ color: 'var(--color-gray-500)', fontSize: 13 }}>{candidate.email}</div>
                    {job && <div style={{ color: 'var(--color-gray-600)', fontSize: 13, marginTop: 4 }}>{job.title}</div>}
                    <div style={{ marginTop: 8 }}>
                      <Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Candidate">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Doe" />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555-0000" />
          <Select
            label="Job"
            value={form.jobId}
            onChange={val => setForm(f => ({ ...f, jobId: val }))}
            options={jobOptions}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={val => setForm(f => ({ ...f, status: val as CandidateStatus }))}
            options={[
              { value: 'New', label: 'New' },
              { value: 'Screening', label: 'Screening' },
              { value: 'Interview', label: 'Interview' },
              { value: 'Offer', label: 'Offer' },
              { value: 'Hired', label: 'Hired' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
          />
          <Input label="Skills (comma-separated)" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="React, TypeScript" />
          <Input label="Years of Experience" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} placeholder="5" />
          <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Austin, TX" />
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-gray-700)', display: 'block', marginBottom: 4 }}>Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)', fontSize: 13.5, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.name || !form.email}>Add Candidate</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
