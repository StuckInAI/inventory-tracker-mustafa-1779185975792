import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import type { Interview } from '@/types';

export default function Interviews() {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    applicationId: '',
    jobId: '',
    candidateId: '',
    type: 'video' as Interview['type'],
    scheduledAt: '',
  });

  function handleAdd() {
    const newInterview: Interview = {
      id: `iv${Date.now()}`,
      applicationId: form.applicationId,
      jobId: form.jobId,
      candidateId: form.candidateId,
      interviewerId: state.currentUser.id,
      type: form.type,
      scheduledAt: form.scheduledAt,
      status: 'scheduled',
    };
    dispatch({ type: 'ADD_INTERVIEW', payload: newInterview });
    setShowModal(false);
  }

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Interviews"
        subtitle="Schedule and manage interviews"
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
          description="Schedule your first interview."
          action={<Button onClick={() => setShowModal(true)}>Schedule Interview</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {state.interviews.map(interview => {
            const candidate = state.candidates.find(c => c.id === interview.candidateId);
            const job = state.jobs.find(j => j.id === interview.jobId);
            return (
              <Card key={interview.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{candidate?.name ?? 'Unknown'}</div>
                    <div style={{ color: 'var(--color-gray-500)', fontSize: '13px' }}>{job?.title ?? 'Unknown'}</div>
                    <div style={{ fontSize: '13px', marginTop: '4px' }}>{new Date(interview.scheduledAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Badge variant="secondary">{interview.type}</Badge>
                    <Badge variant={interview.status === 'scheduled' ? 'primary' : interview.status === 'completed' ? 'success' : 'danger'}>
                      {interview.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
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
            label="Interview Type"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value as Interview['type'] }))}
            options={[
              { value: 'phone', label: 'Phone' },
              { value: 'video', label: 'Video' },
              { value: 'onsite', label: 'On-site' },
              { value: 'technical', label: 'Technical' },
            ]}
          />
          <Button onClick={handleAdd} fullWidth>Schedule</Button>
        </div>
      </Modal>
    </div>
  );
}
