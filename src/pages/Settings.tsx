import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function Settings() {
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@company.com');
  const [notifications, setNotifications] = useState(true);

  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)', maxWidth: 640 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
            <User size={20} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Profile Settings</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input
              label="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
            />
            <Input
              label="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
            />
            <Button style={{ alignSelf: 'flex-start' } as React.CSSProperties}>Save Changes</Button>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
            <Bell size={20} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Notifications</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-3)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Email Notifications</div>
              <div style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>Receive updates about candidates and jobs</div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 9999,
                border: 'none',
                background: notifications ? 'var(--color-primary)' : 'var(--color-gray-300)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute',
                top: 2,
                left: notifications ? 22 : 2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'white',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
            <Shield size={20} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Security</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-4)' }}>
            Manage your password and account security settings.
          </div>
          <Button variant="outline">Change Password</Button>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
            <Palette size={20} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Appearance</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-gray-600)' }}>
            Theme customization coming soon.
          </div>
        </Card>
      </div>
    </div>
  );
}
