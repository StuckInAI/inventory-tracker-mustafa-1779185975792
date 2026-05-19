import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import type { Interview } from '@/types';
import styles from './Dashboard.module.css';

export default function Interviews() {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    candidateId: '',
    jobId: '',
    scheduledAt: '',
    type: 'Technical',
    notes: '',
  });

  const candidateOptions = state.candidates.map(c => ({ value: c.id, label: c.name }));
  const jobOptions = state.jobs.map(j => ({ value: j.id, label: j.title }));

  const handleAdd = () => {
    const now = new Date().toISOString();
    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      candidateId: form.candidateId,
      jobId: form.jobId,
      scheduledAt: form.scheduledAt,
      type: form.type,
      notes: form.notes,
      status: 'scheduled',
      createdAt: now,
    };
    dispatch({ type: 'ADD_INTERVIEW', payload: newInterview });
    setShowModal(false);
    setForm({ candidateId: '', jobId: '', scheduledAt: '', type: 'Technical', notes: '' });
  };

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Interviews"
        subtitle={`${state.interviews.length} total`}
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
              <div key={interview.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>
                      {candidate ? candidate.name : 'Unknown Candidate'}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>
                      {job ? job.title : 'Unknown Job'} &middot; {interview.type}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>
                      {new Date(interview.scheduledAt).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant={interview.status === 'scheduled' ? 'primary' : interview.status === 'completed' ? 'success' : 'danger'}>
                    {interview.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Schedule Interview">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Candidate</label>
            <select
              value={form.candidateId}
              onChange={e => setForm(f => ({ ...f, candidateId: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #d1d5db', borderRadius: 6, fontSize: 13.5 }}
            >
              <option value="">Select candidate...</option>
              {candidateOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Job</label>
            <select
              value={form.jobId}
              onChange={e => setForm(f => ({ ...f, jobId: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #d1d5db', borderRadius: 6, fontSize: 13.5 }}
            >
              <option value="">Select job...</option>
              {jobOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <Input label="Scheduled At" type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} />
          <Input label="Interview Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
          <Input label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.candidateId || !form.jobId || !form.scheduledAt}>Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
