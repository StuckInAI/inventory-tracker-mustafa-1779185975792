import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Settings() {
  const { state } = useAppContext();
  const [name, setName] = useState(state.currentUser.name);
  const [email, setEmail] = useState(state.currentUser.email ?? '');

  return (
    <div style={{ padding: '32px' }}>
      <PageHeader title="Settings" subtitle="Manage your account settings" />

      <Card style={{ maxWidth: '560px' } as React.CSSProperties}>
        <h3 style={{ marginBottom: '20px', fontSize: '15px', fontWeight: 700 }}>Profile Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
          />
          <Button style={{ alignSelf: 'flex-start' }}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
