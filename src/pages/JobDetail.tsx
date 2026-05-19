import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Users, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import styles from './JobDetail.module.css';
import { formatDate } from '@/lib/utils';
import type { JobStatus } from '@/types';

const statusVariantMap: Record<JobStatus, 'success' | 'danger' | 'default' | 'warning'> = {
  Open: 'success', Closed: 'danger', Draft: 'default', 'On Hold': 'warning',
};

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'pipeline'>('overview');

  const job = state.jobs.find(j => j.id === id);
  if (!job) return <div className={styles.notFound}>Job not found.</div>;

  const candidates = state.candidates.filter(c => c.currentJobId === job.id);

  function handleDelete() {
    if (window.confirm('Delete this job?')) {
      dispatch({ type: 'DELETE_JOB', payload: job.id });
      navigate('/jobs');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.backRow}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')}>
          <ArrowLeft size={15} /> Back to Jobs
        </Button>
      </div>

      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.clientBadge}>{job.clientName}</div>
          <h1 className={styles.title}>{job.title}</h1>
          <div className={styles.meta}>
            <span><MapPin size={13} /> {job.location}</span>
            <span><Briefcase size={13} /> {job.type}</span>
            <span><Users size={13} /> {job.candidatesCount} candidates</span>
            <span><Calendar size={13} /> Posted {formatDate(job.postedAt)}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Badge variant={statusVariantMap[job.status]}>{job.status}</Badge>
          <Button variant="outline" size="sm"><Edit2 size={14} /> Edit</Button>
          <Button variant="danger" size="sm" onClick={handleDelete}><Trash2 size={14} /> Delete</Button>
        </div>
      </div>

      <div className={styles.tabs}>
        {(['overview', 'candidates', 'pipeline'] as const).map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'candidates' && <span className={styles.tabCount}>{candidates.length}</span>}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className={styles.overviewGrid}>
          <Card>
            <h3 className={styles.sectionTitle}>Job Description</h3>
            <p className={styles.description}>{job.description}</p>
            {job.requirements.length > 0 && (
              <>
                <h4 className={styles.reqTitle}>Requirements</h4>
                <ul className={styles.reqList}>
                  {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </>
            )}
          </Card>
          <div>
            <Card className={styles.sideCard}>
              <h3 className={styles.sectionTitle}>Details</h3>
              <div className={styles.detailRows}>
                <div className={styles.detailRow}><span>Salary</span><strong>{job.salary || '—'}</strong></div>
                <div className={styles.detailRow}><span>Department</span><strong>{job.department || '—'}</strong></div>
                <div className={styles.detailRow}><span>Recruiter</span><strong>{job.recruiterName}</strong></div>
                <div className={styles.detailRow}><span>Closes</span><strong>{formatDate(job.closingDate)}</strong></div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'candidates' && (
        <Card>
          {candidates.length === 0 ? (
            <p className={styles.empty}>No candidates for this job yet.</p>
          ) : (
            <div className={styles.candidateTable}>
              {candidates.map(c => (
                <div key={c.id} className={styles.candidateRow} onClick={() => navigate(`/candidates/${c.id}`)}>
                  <Avatar initials={c.name.split(' ').map((n: string) => n[0]).join('')} size="sm" />
                  <div className={styles.candidateInfo}>
                    <div className={styles.candidateName}>{c.name}</div>
                    <div className={styles.candidateMeta}>{c.currentTitle} · {c.currentCompany}</div>
                  </div>
                  <div className={styles.stage}>{c.currentStage}</div>
                  <Badge variant={c.status === 'Hired' ? 'success' : c.status === 'Rejected' ? 'danger' : 'primary'}>{c.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'pipeline' && (
        <div className={styles.pipeline}>
          {job.pipeline.map(stage => {
            const stageCandidates = state.candidates.filter(c => stage.candidateIds.includes(c.id));
            return (
              <div key={stage.id} className={styles.pipelineStage}>
                <div className={styles.stageHeader}>
                  <span className={styles.stageName}>{stage.name}</span>
                  <span className={styles.stageCount}>{stageCandidates.length}</span>
                </div>
                <div className={styles.stageCards}>
                  {stageCandidates.map(c => (
                    <div key={c.id} className={styles.pipelineCard} onClick={() => navigate(`/candidates/${c.id}`)}>          
                      <Avatar initials={c.name.split(' ').map((n: string) => n[0]).join('')} size="sm" />
                      <div>
                        <div className={styles.pipelineCardName}>{c.name}</div>
                        <div className={styles.pipelineCardRole}>{c.currentTitle}</div>
                      </div>
                    </div>
                  ))}
                  {stageCandidates.length === 0 && <div className={styles.emptyStage}>No candidates</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
