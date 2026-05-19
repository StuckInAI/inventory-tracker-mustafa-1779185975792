import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Briefcase } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import styles from './Jobs.module.css';
import type { Job } from '@/types';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' },
  { value: 'on-hold', label: 'On Hold' },
];

const JOB_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const JOB_STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' },
  { value: 'on-hold', label: 'On Hold' },
];

const BADGE_MAP: Record<string, 'success' | 'danger' | 'default' | 'warning'> = {
  open: 'success',
  closed: 'danger',
  draft: 'default',
  'on-hold': 'warning',
};

export default function Jobs() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    status: 'open',
    description: '',
    salary: '',
    clientId: '',
  });

  const filtered = state.jobs.filter(j => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newJob: Job = {
      id: `job-${Date.now()}`,
      ...form,
      postedAt: new Date().toISOString(),
      applicants: 0,
    };
    dispatch({ type: 'ADD_JOB', payload: newJob });
    setShowModal(false);
    setForm({ title: '', department: '', location: '', type: 'full-time', status: 'open', description: '', salary: '', clientId: '' });
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Jobs"
        subtitle="Manage open positions and job listings"
        actions={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Add Job</Button>}
      />

      <div className={styles.filters}>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs..."
          icon={<Search size={15} />}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
          placeholder="All Statuses"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={40} />}
          title="No jobs found"
          description="Add a new job listing or adjust your filters."
          action={<Button onClick={() => setShowModal(true)}>Add Job</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map(job => (
            <Card key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className={styles.jobCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <Badge variant={BADGE_MAP[job.status] || 'default'}>{job.status}</Badge>
              </div>
              <div className={styles.jobMeta}>
                <span>{job.department}</span>
                <span>·</span>
                <span>{job.location}</span>
                <span>·</span>
                <span>{job.type}</span>
              </div>
              {job.salary && <div className={styles.salary}>{job.salary}</div>}
              <div className={styles.applicants}>{job.applicants} applicant{job.applicants !== 1 ? 's' : ''}</div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Job">
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input label="Job Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <Input label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required />
          <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
          <Select
            label="Job Type"
            value={form.type}
            options={JOB_TYPE_OPTIONS}
            onChange={v => setForm(f => ({ ...f, type: v }))}
          />
          <Select
            label="Status"
            value={form.status}
            options={JOB_STATUS_OPTIONS}
            onChange={v => setForm(f => ({ ...f, status: v }))}
          />
          <Input label="Salary" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Add Job</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
