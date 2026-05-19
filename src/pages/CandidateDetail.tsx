import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import PageHeader from '@/components/ui/PageHeader';
import Modal from '@/components/ui/Modal';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Sparkles, FileText, Send, Calendar as CalendarIcon, Target } from 'lucide-react';
import type { CandidateStatus } from '@/types';

function getStatusVariant(status: CandidateStatus) {
  switch (status) {
    case 'New': return 'default' as const;
    case 'Screening': return 'secondary' as const;
    case 'Interview': return 'primary' as const;
    case 'Offer': return 'warning' as const;
    case 'Hired': return 'success' as const;
    case 'Rejected': return 'danger' as const;
    default: return 'default' as const;
  }
}

const SAMPLE_AI_QUESTIONS = [
  'Walk me through a complex React component you architected and the trade-offs you made.',
  'How do you approach TypeScript generics when designing reusable components?',
  'Describe a time you had to optimize a slow front-end page. What was your process?',
  'How do you handle state management decisions (Context vs Redux vs Zustand)?',
  'Tell me about a disagreement with a designer or PM and how you resolved it.',
];

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [emailOpen, setEmailOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const candidate = state.candidates.find(c => c.id === id);
  if (!candidate) return <div style={{ padding: 32 }}>Candidate not found.</div>;

  const job = state.jobs.find(j => j.id === candidate.jobId);
  const interviews = state.interviews.filter(i => i.candidateId === candidate.id);
  const activities = state.activities.filter(a => a.candidateId === candidate.id);
  const tasks = state.tasks.filter(t => t.candidateId === candidate.id);

  const handleSendEmail = () => {
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: crypto.randomUUID(),
        type: 'email',
        message: `Sent email "${emailSubject}" to ${candidate.name} via Gmail`,
        userId: state.currentUser.id,
        candidateId: candidate.id,
        createdAt: new Date().toISOString(),
      },
    });
    setEmailOpen(false);
    setEmailSubject('');
    setEmailBody('');
  };

  return (
    <div style={{ padding: 32 }}>
      <Button variant="ghost" size="sm" onClick={() => navigate('/candidates')} style={{ marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Candidates
      </Button>

      <PageHeader
        title={candidate.name}
        subtitle={candidate.email}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={() => setEmailOpen(true)}>
              <Send size={14} /> Email
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setAiOpen(true)}>
              <Sparkles size={14} /> AI Questions
            </Button>
            <Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginTop: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {candidate.aiSummary && (
            <Card padding="md">
              <h3 style={{ fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={16} color="var(--color-primary)" /> AI Summary
              </h3>
              <p style={{ color: 'var(--color-gray-700)', lineHeight: 1.6, fontSize: 13.5 }}>{candidate.aiSummary}</p>
            </Card>
          )}

          <Card padding="md">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--color-gray-700)' }}>
                <Mail size={15} /><span>{candidate.email}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--color-gray-700)' }}>
                <Phone size={15} /><span>{candidate.phone}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--color-gray-700)' }}>
                <MapPin size={15} /><span>{candidate.location}</span>
              </div>
              {job && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--color-gray-700)' }}>
                  <Briefcase size={15} /><span>{job.title}</span>
                </div>
              )}
              {candidate.source && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--color-gray-700)' }}>
                  <FileText size={15} /><span>Source: {candidate.source}</span>
                </div>
              )}
            </div>
          </Card>

          {candidate.skills && candidate.skills.length > 0 && (
            <Card padding="md">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {candidate.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </Card>
          )}

          {candidate.notes && (
            <Card padding="md">
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Notes</h3>
              <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{candidate.notes}</p>
            </Card>
          )}

          {interviews.length > 0 && (
            <Card padding="md">
              <h3 style={{ fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarIcon size={16} /> Interviews
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {interviews.map(interview => (
                  <div key={interview.id} style={{ padding: '10px 12px', background: 'var(--color-gray-50)', borderRadius: 8 }}>
                    <div style={{ fontWeight: 600 }}>{interview.type} Interview</div>
                    <div style={{ fontSize: 13, color: 'var(--color-gray-500)' }}>
                      {new Date(interview.scheduledAt).toLocaleString()} · {interview.status}
                    </div>
                    {interview.meetingLink && (
                      <a href={interview.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--color-primary)' }}>
                        Join Google Meet →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tasks.length > 0 && (
            <Card padding="md">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Related Tasks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tasks.map(task => (
                  <div key={task.id} style={{ padding: '10px 12px', background: 'var(--color-gray-50)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{task.title}</div>
                      {task.dueDate && (
                        <div style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>Due {new Date(task.dueDate).toLocaleDateString()}</div>
                      )}
                    </div>
                    <Badge variant={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'default'}>{task.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activities.length > 0 && (
            <Card padding="md">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Activity Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activities.map(act => (
                  <div key={act.id} style={{ display: 'flex', gap: 10, fontSize: 13, paddingBottom: 8, borderBottom: '1px solid var(--color-gray-100)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div>{act.message}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-gray-500)' }}>{new Date(act.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding="md">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
              <Avatar initials={candidate.name.split(' ').map(n => n[0]).join('')} size="lg" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{candidate.name}</div>
                <div style={{ color: 'var(--color-gray-500)', fontSize: 13 }}>{candidate.experience} years experience</div>
              </div>
              <Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge>
            </div>
          </Card>

          {candidate.matchScore !== undefined && (
            <Card padding="md">
              <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={15} color="var(--color-primary)" /> AI Match Score
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: candidate.matchScore >= 85 ? 'var(--color-success)' : candidate.matchScore >= 70 ? 'var(--color-warning)' : 'var(--color-gray-600)' }}>
                  {candidate.matchScore}
                </div>
                <div style={{ fontSize: 14, color: 'var(--color-gray-500)' }}>/ 100</div>
              </div>
              <div style={{ height: 6, background: 'var(--color-gray-100)', borderRadius: 9999 }}>
                <div style={{
                  height: '100%',
                  width: `${candidate.matchScore}%`,
                  background: candidate.matchScore >= 85 ? 'var(--color-success)' : candidate.matchScore >= 70 ? 'var(--color-warning)' : 'var(--color-gray-400)',
                  borderRadius: 9999,
                }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-gray-500)', marginTop: 8 }}>
                Based on skills, experience, and job requirements.
              </div>
            </Card>
          )}

          <Card padding="md">
            <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Google Workspace</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button variant="secondary" size="sm" fullWidth onClick={() => setEmailOpen(true)}>
                <Mail size={14} /> Send Gmail
              </Button>
              <Button variant="secondary" size="sm" fullWidth onClick={() => navigate('/interviews')}>
                <CalendarIcon size={14} /> Schedule via Calendar
              </Button>
              <Button variant="secondary" size="sm" fullWidth>
                <FileText size={14} /> View Drive Folder
              </Button>
              <div style={{ fontSize: 11, color: 'var(--color-gray-500)', marginTop: 4, textAlign: 'center' }}>
                Connect Google Workspace in Settings
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={emailOpen} onClose={() => setEmailOpen(false)} title={`Email ${candidate.name}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>
            To: {candidate.email} · Sending via Gmail (mock)
          </div>
          <input
            placeholder="Subject"
            value={emailSubject}
            onChange={e => setEmailSubject(e.target.value)}
            style={{ padding: '8px 12px', border: '1.5px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)', fontSize: 13.5 }}
          />
          <textarea
            placeholder="Write your message..."
            value={emailBody}
            onChange={e => setEmailBody(e.target.value)}
            rows={8}
            style={{ padding: '8px 12px', border: '1.5px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)', fontSize: 13.5, resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setEmailOpen(false)}>Cancel</Button>
            <Button onClick={handleSendEmail} disabled={!emailSubject}>
              <Send size={14} /> Send
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={aiOpen} onClose={() => setAiOpen(false)} title="AI-Generated Interview Questions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--color-gray-500)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} color="var(--color-primary)" />
            Tailored to {candidate.name} for {job?.title ?? 'this role'}
          </div>
          {SAMPLE_AI_QUESTIONS.map((q, i) => (
            <div key={i} style={{ padding: '12px 14px', background: 'var(--color-gray-50)', borderRadius: 8, fontSize: 13.5, lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--color-primary)' }}>Q{i + 1}.</strong> {q}
            </div>
          ))}
          <Button variant="secondary" onClick={() => setAiOpen(false)} style={{ marginTop: 8 }}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}
