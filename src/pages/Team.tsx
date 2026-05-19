import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import { Plus } from 'lucide-react';
import styles from './Jobs.module.css';

export default function Team() {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: '', department: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    dispatch({
      type: 'ADD_TEAM_MEMBER',
      payload: {
        id: Date.now().toString(),
        name: form.name,
        email: form.email,
        role: form.role,
        department: form.department,
        avatar: initials,
        createdAt: new Date().toISOString(),
      },
    });
    setShowModal(false);
    setForm({ name: '', email: '', role: '', department: '' });
  };

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader
        title="Team"
        subtitle={`${state.team.length} members`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Add Member</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '24px' }}>
        {state.team.map(member => (
          <div key={member.id} style={{ background: 'white', border: '1px solid var(--color-gray-200)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar initials={member.avatar} size="lg" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-gray-800)' }}>{member.name}</div>
              <div style={{ fontSize: 13, color: 'var(--color-gray-500)' }}>{member.role}</div>
              <div style={{ fontSize: 12, color: 'var(--color-gray-400)', marginTop: 4 }}>{member.email}</div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Team Member">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <Input label="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required />
          <Input label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} type="button">Cancel</Button>
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
