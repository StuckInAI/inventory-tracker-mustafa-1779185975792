import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { Calendar, Plus } from 'lucide-react';
import type { InterviewType, InterviewStatus } from '@/types';
import styles from '@/pages/Dashboard.module.css';
import type { Interview } from '@/types';

type FormState = {
  candidateId: string;
  jobId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  notes: string;
};

export default function Interviews() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({
    candidateId: '',
    jobId: '',
    type: 'Phone',
    status: 'Scheduled',
    scheduledAt: '',
    notes: '',
  });

  const handleSubmit = () => {
    const now = new Date().toISOString();
    const newInterview: Interview = {
      id: crypto.randomUUID(),
      candidateId: form.candidateId,
      jobId: form.jobId,
      type: form.type,
      status: form.status,
      scheduledAt: form.scheduledAt,
      notes: form.notes,
      createdAt: now,
    };
    dispatch({ type: 'ADD_INTERVIEW', payload: newInterview });
    setShowModal(false);
    setForm({ candidateId: '', jobId: '', type: 'Phone', status: 'Scheduled', scheduledAt: '', notes: '' });
  };

  const getStatusVariant = (status: InterviewStatus) => {
    switch (status) {
      case 'Scheduled': return 'primary' as const;
      case 'Completed': return 'success' as const;
      case 'Cancelled': return 'danger' as const;
      case 'No Show': return 'warning' as const;
      default: return 'default' as const;
    }
  };

  const candidateOptions = state.candidates.map(c => ({ value: c.id, label: c.name }));
  const jobOptions = state.jobs.map(j => ({ value: j.id, label: j.title }));

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Interviews"
        subtitle="Manage scheduled interviews"
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Schedule Interview
          </Button>
        }
      />

      {state.interviews.length === 0 ? (
        <EmptyState
          icon={<Calendar size={40} />}
          title="No interviews scheduled"
          description="Schedule your first interview to get started."
          action={<Button onClick={() => setShowModal(true)}>Schedule Interview</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {state.interviews.map(interview => {
            const candidate = state.candidates.find(c => c.id === interview.candidateId);
            const job = state.jobs.find(j => j.id === interview.jobId);
            return (
              <Card key={interview.id} padding="md">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>
                      {candidate?.name ?? 'Unknown Candidate'}
                    </div>
                    <div style={{ color: 'var(--color-gray-500)', fontSize: 13, marginTop: 4 }}>
                      {job?.title ?? 'Unknown Job'} · {interview.type} · {new Date(interview.scheduledAt).toLocaleString()}
                    </div>
                    {interview.notes && (
                      <div style={{ color: 'var(--color-gray-600)', fontSize: 13, marginTop: 4 }}>
                        {interview.notes}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Badge variant={getStatusVariant(interview.status)}>{interview.status}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => candidate && navigate(`/candidates/${candidate.id}`)}>View</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select
            label="Candidate"
            value={form.candidateId}
            onChange={val => setForm(f => ({ ...f, candidateId: val }))}
            options={candidateOptions}
          />
          <Select
            label="Job"
            value={form.jobId}
            onChange={val => setForm(f => ({ ...f, jobId: val }))}
            options={jobOptions}
          />
          <Select
            label="Interview Type"
            value={form.type}
            onChange={val => setForm(f => ({ ...f, type: val as InterviewType }))}
            options={[
              { value: 'Phone', label: 'Phone' },
              { value: 'Video', label: 'Video' },
              { value: 'On-site', label: 'On-site' },
              { value: 'Technical', label: 'Technical' },
            ]}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={val => setForm(f => ({ ...f, status: val as InterviewStatus }))}
            options={[
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Cancelled', label: 'Cancelled' },
              { value: 'No Show', label: 'No Show' },
            ]}
          />
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-gray-700)', display: 'block', marginBottom: 4 }}>Scheduled At</label>
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)', fontSize: 13.5 }}
            />
          </div>
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
            <Button onClick={handleSubmit} disabled={!form.candidateId || !form.jobId || !form.scheduledAt}>Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
