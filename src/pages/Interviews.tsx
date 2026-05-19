import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Calendar } from 'lucide-react';
import type { InterviewType, InterviewStatus } from '@/types';

export default function Interviews() {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    candidateId: '',
    jobId: '',
    type: 'video' as InterviewType,
    status: 'scheduled' as InterviewStatus,
    scheduledAt: '',
    notes: '',
  });

  const handleAdd = () => {
    const now = new Date().toISOString();
    dispatch({
      type: 'ADD_INTERVIEW',
      payload: {
        id: crypto.randomUUID(),
        candidateId: form.candidateId,
        jobId: form.jobId,
        type: form.type,
        status: form.status,
        scheduledAt: form.scheduledAt,
        notes: form.notes,
        createdAt: now,
        updatedAt: now,
      },
    });
    setShowModal(false);
    setForm({ candidateId: '', jobId: '', type: 'video', status: 'scheduled', scheduledAt: '', notes: '' });
  };

  const getStatusVariant = (status: InterviewStatus) => {
    switch (status) {
      case 'scheduled': return 'primary' as const;
      case 'completed': return 'success' as const;
      case 'cancelled': return 'danger' as const;
      case 'no_show': return 'warning' as const;
      default: return 'default' as const;
    }
  };

  const getCandidateName = (id: string) => {
    const c = state.candidates.find(c => c.id === id);
    return c ? c.name : 'Unknown';
  };

  const getJobTitle = (id?: string) => {
    if (!id) return '';
    const j = state.jobs.find(j => j.id === id);
    return j ? j.title : '';
  };

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Interviews"
        subtitle={`${state.interviews.length} total interviews`}
        actions={
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          {state.interviews.map(interview => (
            <Card key={interview.id} padding="sm">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={24} color="var(--color-primary)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{getCandidateName(interview.candidateId)}</div>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: '13px' }}>
                    {getJobTitle(interview.jobId)}
                    {interview.scheduledAt ? ` · ${new Date(interview.scheduledAt).toLocaleString()}` : ''}
                  </div>
                </div>
                <Badge variant={getStatusVariant(interview.status)}>{interview.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Select
            label="Candidate"
            value={form.candidateId}
            onChange={e => setForm(f => ({ ...f, candidateId: e.target.value }))}
            options={state.candidates.map(c => ({ value: c.id, label: c.name }))}
          />
          <Select
            label="Job"
            value={form.jobId}
            onChange={e => setForm(f => ({ ...f, jobId: e.target.value }))}
            options={state.jobs.map(j => ({ value: j.id, label: j.title }))}
          />
          <Select
            label="Type"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value as InterviewType }))}
            options={[
              { value: 'phone', label: 'Phone' },
              { value: 'video', label: 'Video' },
              { value: 'onsite', label: 'Onsite' },
              { value: 'technical', label: 'Technical' },
            ]}
          />
          <Input
            label="Scheduled Date & Time"
            type="datetime-local"
            value={form.scheduledAt}
            onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
          />
          <Button onClick={handleAdd} fullWidth>Schedule Interview</Button>
        </div>
      </Modal>
    </div>
  );
}
