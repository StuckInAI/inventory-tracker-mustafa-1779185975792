import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { Plus, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import styles from '@/pages/Jobs.module.css';

export default function Interviews() {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    candidateId: '',
    jobId: '',
    scheduledAt: '',
    type: 'phone',
    notes: '',
  });

  const interviews = state.interviews ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_INTERVIEW',
      payload: {
        id: Date.now().toString(),
        candidateId: form.candidateId,
        jobId: form.jobId,
        scheduledAt: form.scheduledAt,
        type: form.type,
        notes: form.notes,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      },
    });
    setShowModal(false);
    setForm({ candidateId: '', jobId: '', scheduledAt: '', type: 'phone', notes: '' });
  };

  const getStatusVariant = (status: string) => {
    if (status === 'completed') return 'success';
    if (status === 'cancelled') return 'danger';
    return 'primary';
  };

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Interviews"
        subtitle={`${interviews.length} interviews scheduled`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Schedule Interview</Button>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        {interviews.map(interview => {
          const candidate = state.candidates.find(c => c.id === interview.candidateId);
          const job = state.jobs.find(j => j.id === interview.jobId);
          return (
            <div key={interview.id} style={{ background: 'white', border: '1px solid var(--color-gray-200)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Calendar size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--color-gray-800)' }}>{candidate?.name ?? 'Unknown'}</div>
                <div style={{ fontSize: 13, color: 'var(--color-gray-500)' }}>{job?.title ?? 'Unknown Job'} · {interview.type}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-gray-600)' }}>{formatDate(interview.scheduledAt)}</div>
              <Badge variant={getStatusVariant(interview.status)}>{interview.status}</Badge>
            </div>
          );
        })}
        {interviews.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-gray-400)' }}>No interviews scheduled yet.</div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Schedule Interview">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Select
            label="Candidate"
            value={form.candidateId}
            onChange={v => setForm(f => ({ ...f, candidateId: v }))}
            options={state.candidates.map(c => ({ value: c.id, label: c.name }))}
            required
          />
          <Select
            label="Job"
            value={form.jobId}
            onChange={v => setForm(f => ({ ...f, jobId: v }))}
            options={state.jobs.map(j => ({ value: j.id, label: j.title }))}
            required
          />
          <Input
            label="Scheduled At"
            type="datetime-local"
            value={form.scheduledAt}
            onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
            required
          />
          <Select
            label="Type"
            value={form.type}
            onChange={v => setForm(f => ({ ...f, type: v }))}
            options={[
              { value: 'phone', label: 'Phone' },
              { value: 'video', label: 'Video' },
              { value: 'onsite', label: 'On-site' },
            ]}
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} type="button">Cancel</Button>
            <Button type="submit">Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
