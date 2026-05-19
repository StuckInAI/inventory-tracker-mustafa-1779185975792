import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import type { Interview } from '@/types';

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

  const INTERVIEW_TYPE_OPTIONS = [
    { value: 'phone', label: 'Phone' },
    { value: 'video', label: 'Video' },
    { value: 'onsite', label: 'On-site' },
    { value: 'technical', label: 'Technical' },
  ];

  const candidateOptions = state.candidates.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }));
  const jobOptions = state.jobs.map(j => ({ value: j.id, label: j.title }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      ...form,
      status: 'scheduled',
    };
    dispatch({ type: 'ADD_INTERVIEW', payload: newInterview });
    setShowModal(false);
    setForm({ candidateId: '', jobId: '', scheduledAt: '', type: 'phone', notes: '' });
  }

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Interviews"
        subtitle="Schedule and manage candidate interviews"
        actions={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Schedule Interview</Button>}
      />

      {state.interviews.length === 0 ? (
        <EmptyState
          icon={<Calendar size={40} />}
          title="No interviews scheduled"
          description="Schedule your first interview to get started."
          action={<Button onClick={() => setShowModal(true)}>Schedule Interview</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          {state.interviews.map(interview => {
            const candidate = state.candidates.find(c => c.id === interview.candidateId);
            const job = state.jobs.find(j => j.id === interview.jobId);
            return (
              <Card key={interview.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>
                      {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown Candidate'}
                    </div>
                    <div style={{ color: 'var(--color-gray-500)', fontSize: '13px', marginTop: '4px' }}>
                      {job?.title || 'Unknown Job'} · {interview.type}
                    </div>
                    {interview.notes && (
                      <div style={{ color: 'var(--color-gray-600)', fontSize: '13px', marginTop: '8px' }}>
                        {interview.notes}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Badge variant={interview.status === 'scheduled' ? 'primary' : interview.status === 'completed' ? 'success' : 'danger'}>
                      {interview.status}
                    </Badge>
                    <div style={{ color: 'var(--color-gray-500)', fontSize: '12px', marginTop: '6px' }}>
                      {formatDate(interview.scheduledAt)}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Select
            label="Candidate"
            value={form.candidateId}
            options={candidateOptions}
            onChange={v => setForm(f => ({ ...f, candidateId: v }))}
            placeholder="Select candidate"
            required
          />
          <Select
            label="Job"
            value={form.jobId}
            options={jobOptions}
            onChange={v => setForm(f => ({ ...f, jobId: v }))}
            placeholder="Select job"
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
            label="Interview Type"
            value={form.type}
            options={INTERVIEW_TYPE_OPTIONS}
            onChange={v => setForm(f => ({ ...f, type: v }))}
          />
          <Textarea
            label="Notes"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Add any notes..."
          />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
