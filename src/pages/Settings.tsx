import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Mail, Calendar, FolderOpen, Shield, Bell, Zap, Check } from 'lucide-react';

export default function Settings() {
  const { state } = useAppContext();
  const [name, setName] = useState(state.currentUser.name);
  const [email, setEmail] = useState(state.currentUser.email ?? '');
  const [integrations, setIntegrations] = useState({
    gmail: true,
    calendar: true,
    drive: false,
  });
  const [notifications, setNotifications] = useState({
    newCandidate: true,
    interviewReminders: true,
    taskDue: true,
    stageChanges: false,
  });

  return (
    <div style={{ padding: '32px', maxWidth: 900 }}>
      <PageHeader title="Settings" subtitle="Manage your account, integrations, and notifications" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card padding="md">
          <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 700 }}>Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-gray-700)', display: 'block', marginBottom: 4 }}>Role</label>
              <Badge variant="primary">{state.currentUser.role}</Badge>
            </div>
            <Button style={{ alignSelf: 'flex-start' }}>Save Changes</Button>
          </div>
        </Card>

        <Card padding="md">
          <h3 style={{ marginBottom: 4, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={16} /> Google Workspace Integrations
          </h3>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 13, marginBottom: 16 }}>
            Connect Google services to send emails, schedule interviews, and store resumes.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { key: 'gmail' as const, icon: Mail, label: 'Gmail', desc: 'Send and track emails to candidates' },
              { key: 'calendar' as const, icon: Calendar, label: 'Google Calendar', desc: 'Schedule interviews and sync events' },
              { key: 'drive' as const, icon: FolderOpen, label: 'Google Drive', desc: 'Store and manage candidate resumes' },
            ].map(({ key, icon: Icon, label, desc }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--color-gray-200)', borderRadius: 8 }}>
                <Icon size={20} color="var(--color-primary)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>{desc}</div>
                </div>
                {integrations[key] ? (
                  <>
                    <Badge variant="success"><Check size={11} /> Connected</Badge>
                    <Button size="sm" variant="ghost" onClick={() => setIntegrations(i => ({ ...i, [key]: false }))}>Disconnect</Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setIntegrations(i => ({ ...i, [key]: true }))}>Connect</Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md">
          <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={16} /> Notifications
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { key: 'newCandidate' as const, label: 'New candidate applications' },
              { key: 'interviewReminders' as const, label: 'Interview reminders (1 hour before)' },
              { key: 'taskDue' as const, label: 'Tasks approaching due date' },
              { key: 'stageChanges' as const, label: 'Candidate stage changes' },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={e => setNotifications(n => ({ ...n, [key]: e.target.checked }))}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                {label}
              </label>
            ))}
          </div>
        </Card>

        <Card padding="md">
          <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} /> Role-Based Access Control
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            {[
              { role: 'Admin', perms: 'Full access — manage users, settings, all data' },
              { role: 'Recruiter', perms: 'Manage candidates, jobs, interviews, send emails' },
              { role: 'Hiring Manager', perms: 'Review candidates, leave feedback, approve offers' },
              { role: 'Interviewer', perms: 'View assigned interviews, submit scorecards' },
            ].map(r => (
              <div key={r.role} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--color-gray-50)', borderRadius: 8 }}>
                <Badge variant="primary">{r.role}</Badge>
                <span style={{ color: 'var(--color-gray-600)', textAlign: 'right' }}>{r.perms}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
