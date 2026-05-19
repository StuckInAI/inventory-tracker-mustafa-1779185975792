import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Briefcase, MapPin, Clock, Users } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { generateId, formatDate } from '@/lib/utils';
import type { Job, JobStatus, JobType } from '@/types';
import styles from './Jobs.module.css';

const statusVariantMap: Record<JobStatus, 'success' | 'danger' | 'default' | 'warning'> = {
  Open: 'success',
  Closed: 'danger',
  Draft: 'default',
  'On Hold': 'warning',
};

const emptyForm = {
  title: '', clientId: '', department: '', location: '', type: 'Full-time' as JobType,
  status: 'Open' as JobStatus, salary: '', description: '', requirements: '', closingDate: '',
};

export default function Jobs() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return state.jobs.filter(j => {
      const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.clientName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || j.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [state.jobs, search, statusFilter]);

  function handleCreate() {
    if (!form.title || !form.clientId) return;
    const client = state.clients.find(c => c.id === form.clientId);
    const recruiter = state.team.find(m => m.id === state.currentUser.id);
    const newJob: Job = {
      id: generateId(),
      title: form.title,
      clientId: form.clientId,
      clientName: client ? client.name : '',
      department: form.department,
      location: form.location,
      type: form.type,
      status: form.status,
      salary: form.salary,
      description: form.description,
      requirements: form.requirements.split('\n').filter(Boolean),
      postedAt: new Date().toISOString().split('T')[0],
      closingDate: form.closingDate,
      recruiterId: state.currentUser.id,
      recruiterName: recruiter ? recruiter.name : '',
      candidatesCount: 0,
      pipeline: [
        { id: generateId(), name: 'Applied', order: 1, candidateIds: [] },
        { id: generateId(), name: 'Phone Screen', order: 2, candidateIds: [] },
        { id: generateId(), name: 'Interview', order: 3, candidateIds: [] },
        { id: generateId(), name: 'Offer', order: 4, candidateIds: [] },
      ],
    };
    dispatch({ type: 'ADD_JOB', payload: newJob });
    setShowModal(false);
    setForm(emptyForm);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Jobs"
        subtitle={`${state.jobs.filter(j => j.status === 'Open').length} open positions across ${state.clients.length} clients`}
        actions={
          <Button onClick={() => setShowModal(true)}><Plus size={15} /> New Job</Button>
        }
      />

      <div className={styles.filters}>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs or clients..."
          icon={<Search size={14} />}
          className={styles.searchInput}
        />
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          options={[
            { value: 'Open', label: 'Open' },
            { value: 'Draft', label: 'Draft' },
            { value: 'On Hold', label: 'On Hold' },
            { value: 'Closed', label: 'Closed' },
          ]}
          placeholder="All Statuses"
          className={styles.filterSelect}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={40} />}
          title="No jobs found"
          description="Create your first job posting to get started."
          action={<Button onClick={() => setShowModal(true)}><Plus size={14} /> New Job</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map(job => (
            <div key={job.id} className={styles.jobCard} onClick={() => navigate(`/jobs/${job.id}`)}>
              <div className={styles.jobCardHeader}>
                <div className={styles.jobTitle}>{job.title}</div>
                <Badge variant={statusVariantMap[job.status]}>{job.status}</Badge>
              </div>
              <div className={styles.jobClient}>{job.clientName}</div>
              <div className={styles.jobMeta}>
                <span><MapPin size={12} /> {job.location}</span>
                <span><Briefcase size={12} /> {job.type}</span>
                <span><Clock size={12} /> Closes {formatDate(job.closingDate)}</span>
              </div>
              <div className={styles.jobFooter}>
                <span className={styles.salary}>{job.salary}</span>
                <span className={styles.candidateCount}><Users size={12} /> {job.candidatesCount} candidates</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create New Job" size="lg">
        <div className={styles.form}>
          <div className={styles.formRow}>
            <Input label="Job Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Senior Frontend Engineer" required />
            <Select
              label="Client"
              value={form.clientId}
              onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
              options={state.clients.map(c => ({ value: c.id, label: c.name }))}
              placeholder="Select client"
              required
            />
          </div>
          <div className={styles.formRow}>
            <Input label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Engineering" />
            <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Remote" />
          </div>
          <div className={styles.formRow}>
            <Select label="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as JobType }))} options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Internship', label: 'Internship' },
            ]} />
            <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as JobStatus }))} options={[
              { value: 'Open', label: 'Open' },
              { value: 'Draft', label: 'Draft' },
              { value: 'On Hold', label: 'On Hold' },
            ]} />
          </div>
          <div className={styles.formRow}>
            <Input label="Salary Range" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} placeholder="e.g. $100k–$130k" />
            <Input label="Closing Date" value={form.closingDate} onChange={e => setForm(f => ({ ...f, closingDate: e.target.value }))} type="date" />
          </div>
          <div className={styles.formActions}>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.title || !form.clientId}>Create Job</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
