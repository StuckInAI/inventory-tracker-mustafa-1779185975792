import { useState } from 'react';
import { Plus, UserCog } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import type { TeamMember } from '@/types';

export default function Team() {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    email: '',
    department: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      ...form,
      avatar: form.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
      status: 'active',
    };
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: newMember });
    setShowModal(false);
    setForm({ name: '', role: '', email: '', department: '' });
  }

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Team"
        subtitle="Manage your recruitment team members"
        actions={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Add Member</Button>}
      />

      {state.team.length === 0 ? (
        <EmptyState
          icon={<UserCog size={40} />}
          title="No team members"
          description="Add team members to collaborate on recruitment."
          action={<Button onClick={() => setShowModal(true)}>Add Member</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginTop: '24px' }}>
          {state.team.map(member => (
            <Card key={member.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar initials={member.avatar} size="lg" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{member.name}</div>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: '13px' }}>{member.role}</div>
                  <div style={{ color: 'var(--color-gray-400)', fontSize: '12px' }}>{member.department}</div>
                </div>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>{member.email}</span>
                <Badge variant={member.status === 'active' ? 'success' : 'default'}>{member.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Team Member">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <Input label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
