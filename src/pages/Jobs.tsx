import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Search } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import styles from './Jobs.module.css';
import type { Job } from '@/types';

export default function Jobs() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    clientId: '',
    location: '',
    type: 'full-time' as Job['type'],
    department: '',
    salary: '',
    description: '',
  });

  const filtered = state.jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    const recruiter = state.team.find(m => m.id === state.currentUser.id);
    const newJob: Job = {
      id: `j${Date.now()}`,
      title: form.title,
      clientId: form.clientId,
      location: form.location,
      type: form.type,
      status: 'open',
      department: form.department,
      salary: form.salary,
      description: form.description,
      recruiterId: recruiter?.id ?? state.currentUser.id,
      createdAt: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
    };
    dispatch({ type: 'ADD_JOB', payload: newJob });
    setShowModal(false);
    setForm({ title: '', clientId: '', location: '', type: 'full-time', department: '', salary: '', description: '' });
  }

  const statusVariant = (status: Job['status']) => {
    if (status === 'open') return 'success';
    if (status === 'closed') return 'danger';
    if (status === 'on-hold') return 'warning';
    return 'default';
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Jobs"
        subtitle="Manage open positions"
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Job
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs..."
          icon={<Search size={16} />}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={40} />}
          title="No jobs found"
          description="Create your first job posting."
          action={<Button onClick={() => setShowModal(true)}>Add Job</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map(job => {
            const client = state.clients.find(c => c.id === job.clientId);
            return (
              <Card key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}>
                <div className={styles.jobTitle}>{job.title}</div>
                <div className={styles.jobMeta}>{client?.name ?? 'Unknown Client'} &bull; {job.department}</div>
                <div className={styles.jobMeta}>{job.location} &bull; {job.type}</div>
                {job.salary && <div className={styles.salary}>{job.salary}</div>}
                <div className={styles.footer}>
                  <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
                  <span className={styles.applicants}>{job.applicantsCount ?? 0} applicants</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Job">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Job Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <Select
            label="Client"
            value={form.clientId}
            onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
            options={state.clients.map(c => ({ value: c.id, label: c.name }))}
          />
          <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          <Select
            label="Type"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value as Job['type'] }))}
            options={[
              { value: 'full-time', label: 'Full-time' },
              { value: 'part-time', label: 'Part-time' },
              { value: 'contract', label: 'Contract' },
              { value: 'remote', label: 'Remote' },
            ]}
          />
          <Input label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          <Input label="Salary Range" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
          <Button onClick={handleAdd} fullWidth>Add Job</Button>
        </div>
      </Modal>
    </div>
  );
}
