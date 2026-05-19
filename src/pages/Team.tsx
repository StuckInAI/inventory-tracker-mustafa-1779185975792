import React, { useState } from 'react';
import { UserCog, Plus, Mail, Shield } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';

export default function Team() {
  const { state } = useAppContext();

  const teamMembers = state.teamMembers || [];

  const getRoleVariant = (role: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
    const map: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary'> = {
      admin: 'danger',
      manager: 'primary',
      recruiter: 'success',
      viewer: 'default',
    };
    return map[role?.toLowerCase()] ?? 'default';
  };

  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <PageHeader
        title="Team"
        subtitle={`${teamMembers.length} team members`}
        action={
          <Button>
            <Plus size={16} />
            Invite Member
          </Button>
        }
      />

      {teamMembers.length === 0 ? (
        <EmptyState
          icon={<UserCog size={40} />}
          title="No team members"
          description="Invite colleagues to collaborate on recruitment."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          {teamMembers.map((member: any) => (
            <Card key={member.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
                <Avatar
                  initials={member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  size="md"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{member.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-gray-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.email}</div>
                </div>
                <Badge variant={getRoleVariant(member.role)}>{member.role}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {member.email && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-gray-500)' }}>
                    <Mail size={12} /> {member.email}
                  </span>
                )}
                {member.permissions && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-gray-500)' }}>
                    <Shield size={12} /> {Array.isArray(member.permissions) ? member.permissions.join(', ') : member.permissions}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
