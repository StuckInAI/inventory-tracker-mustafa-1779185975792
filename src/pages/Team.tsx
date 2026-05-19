import { useState } from 'react';
import { UserCog, Plus } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import type { TeamMember } from '@/types';

export default function Team() {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', email: '' });

  function handleAdd() {
    const newMember: TeamMember = {
      id: `u${Date.now()}`,
      name: form.name,
      role: form.role,
      avatar: form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      email: form.email,
    };
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: newMember });
    setShowModal(false);
    setForm({ name: '', role: '', email: '' });
  }

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Team"
        subtitle="Manage your recruitment team"
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Member
          </Button>
        }
      />

      {state.team.length === 0 ? (
        <EmptyState
          icon={<UserCog size={40} />}
          title="No team members"
          description="Add your first team member."
          action={<Button onClick={() => setShowModal(true)}>Add Member</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {state.team.map(member => (
            <Card key={member.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar initials={member.avatar} size="lg" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{member.name}</div>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: '13px' }}>{member.role}</div>
                  {member.email && <div style={{ color: 'var(--color-gray-400)', fontSize: '12px', marginTop: '4px' }}>{member.email}</div>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Team Member">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" />
          <Button onClick={handleAdd} fullWidth>Add Member</Button>
        </div>
      </Modal>
    </div>
  );
}
