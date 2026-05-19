import { useState } from 'react';
import { Plus, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import type { Job } from '@/types';
import styles from './Jobs.module.css';

const statusVariant: Record<string, 'success' | 'warning' | 'default'> = {
  open: 'success',
  closed: 'default',
  draft: 'warning',
};

export default function Jobs() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time' as Job['type'],
    status: 'open' as Job['status'],
    description: '',
  });

  const handleAdd = () => {
    const now = new Date().toISOString();
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      status: form.status,
      description: form.description,
      requirements: [],
      createdAt: now,
      updatedAt: now,
      applicantCount: 0,
    };
    dispatch({ type: 'ADD_JOB', payload: newJob });
    setShowModal(false);
    setForm({ title: '', department: '', location: '', type: 'full-time', status: 'open', description: '' });
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Jobs"
        subtitle={`${state.jobs.length} total positions`}
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
          description="Create your first job posting to get started."
          action={<Button onClick={() => setShowModal(true)}>Add Job</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {state.jobs.map(job => (
            <div key={job.id} className={styles.card} onClick={() => navigate(`/jobs/${job.id}`)  }>
              <div className={styles.cardHeader}>
                <span className={styles.jobTitle}>{job.title}</span>
                <Badge variant={statusVariant[job.status] ?? 'default'}>{job.status}</Badge>
              </div>
              <div className={styles.meta}>
                <span>{job.department}</span>
                <span>&middot;</span>
                <span>{job.location}</span>
                <span>&middot;</span>
                <span>{job.type}</span>
              </div>
              <div className={styles.applicants}>{job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Job">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Job Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <Input label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          <Input label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.title}>Add Job</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
