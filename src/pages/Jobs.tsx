import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import { Plus, Search, Briefcase } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import styles from './Jobs.module.css';
import type { Job } from '@/types';

function getStatusVariant(status: string) {
  switch (status) {
    case 'open': return 'success';
    case 'closed': return 'danger';
    case 'draft': return 'default';
    case 'on-hold': return 'warning';
    default: return 'default';
  }
}

export default function Jobs() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = state.jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.page}>
      <PageHeader
        title="Jobs"
        subtitle={`${state.jobs.length} open positions`}
        actions={
          <Button size="sm" onClick={() => {}}>
            <Plus size={15} /> New Job
          </Button>
        }
      />

      <div className={styles.filters}>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs..."
          icon={<Search size={15} />}
        />
        <div className={styles.statusTabs}>
          {['all', 'open', 'closed', 'draft', 'on-hold'].map(s => (
            <button
              key={s}
              className={`${styles.tab} ${statusFilter === s ? styles.tabActive : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={40} />}
          title="No jobs found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((job: Job) => (
            <div key={job.id} className={styles.jobCard} onClick={() => navigate(`/jobs/${job.id}`)}>
              <div className={styles.jobCardHeader}>
                <div className={styles.jobTitle}>{job.title}</div>
                <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
              </div>
              <div className={styles.jobMeta}>
                <span>{job.department}</span>
                <span>{job.location}</span>
                <span>{job.type}</span>
              </div>
              {job.clientName && <div className={styles.client}>{job.clientName}</div>}
              <div className={styles.jobFooter}>
                <span>{(job.candidatesCount ?? 0)} candidates</span>
                {job.postedAt && <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
