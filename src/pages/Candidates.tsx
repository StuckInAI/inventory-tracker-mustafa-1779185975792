import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Plus, Mail, Phone, MapPin } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';

export default function Candidates() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = state.candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.currentTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    const map: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary'> = {
      active: 'success',
      inactive: 'default',
      placed: 'primary',
      blacklisted: 'danger',
    };
    return map[status] ?? 'default';
  };

  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <PageHeader
        title="Candidates"
        subtitle={`${state.candidates.length} total candidates`}
        action={
          <Button>
            <Plus size={16} />
            Add Candidate
          </Button>
        }
      />

      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search candidates..."
          icon={<Search size={16} />}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={40} />}
          title="No candidates found"
          description="Try adjusting your search criteria."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {filtered.map(candidate => (
            <Card key={candidate.id} onClick={() => navigate(`/candidates/${candidate.id}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                <Avatar initials={candidate.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)} size="md" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{candidate.name}</span>
                    <Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge>
                  </div>
                  {candidate.currentTitle && (
                    <div style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 2 }}>{candidate.currentTitle}</div>
                  )}
                  <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 4, flexWrap: 'wrap' }}>
                    {candidate.email && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-gray-500)' }}>
                        <Mail size={12} /> {candidate.email}
                      </span>
                    )}
                    {candidate.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-gray-500)' }}>
                        <Phone size={12} /> {candidate.phone}
                      </span>
                    )}
                    {candidate.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-gray-500)' }}>
                        <MapPin size={12} /> {candidate.location}
                      </span>
                    )}
                  </div>
                </div>
                {candidate.skills && candidate.skills.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 200 }}>
                    {candidate.skills.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                    {candidate.skills.length > 3 && (
                      <Badge variant="outline">+{candidate.skills.length - 3}</Badge>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
