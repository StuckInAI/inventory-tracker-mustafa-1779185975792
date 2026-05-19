import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Search, Briefcase, MapPin, Users, Clock } from 'lucide-react';
import styles from './Jobs.module.css';
import { formatDate } from '@/lib/utils';

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
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusVariant = (status: string) => {
    if (status === 'open') return 'success' as const;
    if (status === 'draft') return 'default' as const;
    return 'warning' as const;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_JOB',
      payload: {
        id: Date.now().toString(),
        title: form.title,
        department: form.department,
        location: form.location,
        type: form.type,
        status: form.status as 'open' | 'closed' | 'draft' | 'on-hold',
        description: form.description,
        requirements: [],
        salary: form.salary,
        clientId: form.clientId || undefined,
        candidatesCount: 0,
        postedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    setShowModal(false);
    setForm({ title: '', department: '', location: '', type: 'full-time', status: 'open', description: '', salary: '', clientId: '' });
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Jobs"
        subtitle={`${filtered.length} job${filtered.length !== 1 ? 's' : ''} found`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Add Job</Button>}
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
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'open', label: 'Open' },
            { value: 'closed', label: 'Closed' },
            { value: 'draft', label: 'Draft' },
            { value: 'on-hold', label: 'On Hold' },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={40} />}
          title="No jobs found"
          description="Try adjusting your search or add a new job."
          action={<Button onClick={() => setShowModal(true)}>Add Job</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map(job => (
            <div key={job.id} className={styles.card} onClick={() => navigate(`/jobs/${job.id}`)}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>{job.title}</div>
                <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
              </div>
              <div className={styles.cardMeta}>
                <span><Briefcase size={13} /> {job.department}</span>
                <span><MapPin size={13} /> {job.location}</span>
                {job.candidatesCount !== undefined && <span><Users size={13} /> {job.candidatesCount} candidates</span>}
                {job.postedAt && <span><Clock size={13} /> {formatDate(job.postedAt)}</span>}
              </div>
              {job.salary && <div className={styles.salary}>{job.salary}</div>}
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Job">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Job Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <Input label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required />
          <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
          <Select
            label="Type"
            value={form.type}
            onChange={v => setForm(f => ({ ...f, type: v }))}
            options={[
              { value: 'full-time', label: 'Full-time' },
              { value: 'part-time', label: 'Part-time' },
              { value: 'contract', label: 'Contract' },
              { value: 'internship', label: 'Internship' },
            ]}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v }))}
            options={[
              { value: 'open', label: 'Open' },
              { value: 'closed', label: 'Closed' },
              { value: 'draft', label: 'Draft' },
              { value: 'on-hold', label: 'On Hold' },
            ]}
          />
          <Input label="Salary Range" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} type="button">Cancel</Button>
            <Button type="submit">Add Job</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
