import { useState } from 'react';
import { Plus, UserCog } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import Avatar from '@/components/ui/Avatar';
import type { TeamMember } from '@/types';
import styles from './Jobs.module.css';

export default function Team() {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
  });

  const handleAdd = () => {
    const now = new Date().toISOString();
    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: form.name,
      email: form.email,
      role: form.role,
      department: form.department,
      avatar: form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      joinedAt: now,
    };
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: newMember });
    setShowModal(false);
    setForm({ name: '', email: '', role: '', department: '' });
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Team"
        subtitle={`${state.team.length} members`}
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Member
          </Button>
        }
      />

      {state.team.length === 0 ? (
        <EmptyState
          icon={<UserCog size={40} />}
          title="No team members yet"
          description="Add your first team member to get started."
          action={<Button onClick={() => setShowModal(true)}>Add Member</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {state.team.map(member => (
            <div key={member.id} className={styles.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar initials={member.avatar ?? member.name.slice(0, 2).toUpperCase()} size="md" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{member.name}</div>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>{member.role}</div>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: '#6b7280' }}>{member.email}</div>
              {member.department && <div style={{ fontSize: 13, color: '#6b7280' }}>{member.department}</div>}
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Team Member">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input label="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <Input label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name}>Add Member</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
