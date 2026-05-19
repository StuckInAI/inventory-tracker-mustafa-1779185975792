import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { CheckSquare, Plus, Clock } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from '@/types';

export default function Tasks() {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');
  const [form, setForm] = useState({
    title: '',
    description: '',
    assigneeId: state.currentUser.id,
    candidateId: '',
    jobId: '',
    priority: 'Medium' as TaskPriority,
    dueDate: '',
  });

  const filtered = filter === 'all' ? state.tasks : state.tasks.filter(t => t.status === filter);

  const handleAdd = () => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      assigneeId: form.assigneeId,
      candidateId: form.candidateId || undefined,
      jobId: form.jobId || undefined,
      status: 'Open',
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    setShowModal(false);
    setForm({ title: '', description: '', assigneeId: state.currentUser.id, candidateId: '', jobId: '', priority: 'Medium', dueDate: '' });
  };

  const toggleStatus = (task: Task) => {
    const next: TaskStatus = task.status === 'Done' ? 'Open' : task.status === 'Open' ? 'In Progress' : 'Done';
    dispatch({ type: 'UPDATE_TASK', payload: { ...task, status: next } });
  };

  const priorityVariant = (p: TaskPriority) =>
    p === 'High' ? 'danger' : p === 'Medium' ? 'warning' : 'default';

  const statusVariant = (s: TaskStatus) =>
    s === 'Done' ? 'success' : s === 'In Progress' ? 'primary' : 'default';

  return (
    <div style={{ padding: 32 }}>
      <PageHeader
        title="Tasks"
        subtitle="Manage recruiter to-dos and reminders"
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Task
          </Button>
        }
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'Open', 'In Progress', 'Done'] as const).map(f => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? 'primary' : 'secondary'}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<CheckSquare size={40} />} title="No tasks" description="Create a task to track follow-ups and reminders." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(task => {
            const assignee = state.team.find(m => m.id === task.assigneeId);
            const candidate = state.candidates.find(c => c.id === task.candidateId);
            const overdue = task.dueDate && task.status !== 'Done' && new Date(task.dueDate) < new Date();
            return (
              <Card key={task.id} padding="md">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={task.status === 'Done'}
                    onChange={() => toggleStatus(task)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, textDecoration: task.status === 'Done' ? 'line-through' : 'none', color: task.status === 'Done' ? 'var(--color-gray-400)' : 'var(--color-gray-800)' }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-gray-500)', marginTop: 2, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {assignee && <span>👤 {assignee.name}</span>}
                      {candidate && <span>🎯 {candidate.name}</span>}
                      {task.dueDate && (
                        <span style={{ color: overdue ? 'var(--color-danger)' : undefined, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={11} /> {new Date(task.dueDate).toLocaleDateString()}
                          {overdue && ' (overdue)'}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                  <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Task">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Follow up with candidate" />
          <Select
            label="Assignee"
            value={form.assigneeId}
            onChange={val => setForm(f => ({ ...f, assigneeId: val }))}
            options={state.team.map(m => ({ value: m.id, label: m.name }))}
          />
          <Select
            label="Related Candidate (optional)"
            value={form.candidateId}
            onChange={val => setForm(f => ({ ...f, candidateId: val }))}
            options={[{ value: '', label: '— None —' }, ...state.candidates.map(c => ({ value: c.id, label: c.name }))]}
          />
          <Select
            label="Priority"
            value={form.priority}
            onChange={val => setForm(f => ({ ...f, priority: val as TaskPriority }))}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
            ]}
          />
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-gray-700)', display: 'block', marginBottom: 4 }}>Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)', fontSize: 13.5 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.title}>Create Task</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
