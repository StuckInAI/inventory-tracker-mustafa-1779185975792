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
import { Briefcase, Plus, MapPin } from 'lucide-react';
import type { JobType, JobStatus } from '@/types';
import type { Job } from '@/types';
import styles from './Jobs.module.css';

type FormState = {
  title: string;
  clientId: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string;
};

export default function Jobs() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: '',
    clientId: '',
    department: '',
    location: '',
    type: 'Full-time',
    status: 'Open',
    description: '',
    requirements: '',
  });

  const handleSubmit = () => {
    const now = new Date().toISOString();
    const newJob: Job = {
      id: crypto.randomUUID(),
      title: form.title,
      clientId: form.clientId,
      department: form.department,
      location: form.location,
      type: form.type,
      status: form.status,
      description: form.description,
      requirements: form.requirements.split('\n').filter(Boolean),
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_JOB', payload: newJob });
    setShowModal(false);
    setForm({ title: '', clientId: '', department: '', location: '', type: 'Full-time', status: 'Open', description: '', requirements: '' });
  };

  const getStatusVariant = (status: JobStatus) => {
    switch (status) {
      case 'Open': return 'success' as const;
      case 'Closed': return 'danger' as const;
      case 'On Hold': return 'warning' as const;
      case 'Draft': return 'default' as const;
      default: return 'default' as const;
    }
  };

  const clientOptions = state.clients.map(c => ({ value: c.id, label: c.name }));

  return (
    <div className={styles.page}>
      <PageHeader
        title="Jobs"
        subtitle="Manage all job openings"
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Job
          </Button>
        }
      />

      {state.jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={40} />}
          title="No jobs yet"
          description="Create your first job opening to get started."
          action={<Button onClick={() => setShowModal(true)}>Add Job</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {state.jobs.map(job => {
            const candidateCount = state.candidates.filter(c => c.jobId === job.id).length;
            const client = state.clients.find(c => c.id === job.clientId);
            return (
              <Card key={job.id} padding="md" onClick={() => navigate(`/jobs/${job.id}`)}>
                <div className={styles.cardTop}>
                  <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
                  <span className={styles.jobType}>{job.type}</span>
                </div>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                {client && <div className={styles.clientName}>{client.name}</div>}
                <div className={styles.jobMeta}>
                  <span><MapPin size={13} /> {job.location}</span>
                  <span>{job.department}</span>
                </div>
                <div className={styles.candidateCount}>
                  {candidateCount} candidate{candidateCount !== 1 ? 's' : ''}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Job">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Job Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Senior Frontend Engineer"
          />
          <Select
            label="Client"
            value={form.clientId}
            onChange={val => setForm(f => ({ ...f, clientId: val }))}
            options={clientOptions}
          />
          <Input
            label="Department"
            value={form.department}
            onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
            placeholder="e.g. Engineering"
          />
          <Input
            label="Location"
            value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            placeholder="e.g. Remote"
          />
          <Select
            label="Type"
            value={form.type}
            onChange={val => setForm(f => ({ ...f, type: val as JobType }))}
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Freelance', label: 'Freelance' },
              { value: 'Internship', label: 'Internship' },
            ]}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={val => setForm(f => ({ ...f, status: val as JobStatus }))}
            options={[
              { value: 'Open', label: 'Open' },
              { value: 'Closed', label: 'Closed' },
              { value: 'On Hold', label: 'On Hold' },
              { value: 'Draft', label: 'Draft' },
            ]}
          />
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-gray-700)', display: 'block', marginBottom: 4 }}>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)', fontSize: 13.5, resize: 'vertical' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-gray-700)', display: 'block', marginBottom: 4 }}>Requirements (one per line)</label>
            <textarea
              value={form.requirements}
              onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
              rows={3}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)', fontSize: 13.5, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.title}>Add Job</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
