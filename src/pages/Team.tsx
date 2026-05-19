import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { Plus, Search, UserCog } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import styles from './Team.module.css';

export default function Team() {
  const { state } = useAppContext();
  const [search, setSearch] = useState('');

  const filtered = state.team.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()) ||
    (m.department ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <PageHeader
        title="Team"
        subtitle={`${state.team.length} members`}
        actions={
          <Button size="sm" onClick={() => {}}>
            <Plus size={15} /> Add Member
          </Button>
        }
      />

      <div className={styles.filters}>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search team members..."
          icon={<Search size={15} />}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<UserCog size={40} />}
          title="No team members found"
          description="Try adjusting your search."
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map(member => (
            <div key={member.id} className={styles.memberCard}>
              <Avatar
                initials={member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                size="lg"
              />
              <div className={styles.memberInfo}>
                <div className={styles.memberName}>{member.name}</div>
                <div className={styles.memberRole}>{member.role}</div>
                {member.department && (
                  <Badge variant="secondary">{member.department}</Badge>
                )}
              </div>
              <div className={styles.memberContact}>
                <div className={styles.memberEmail}>{member.email}</div>
                {member.jobIds && member.jobIds.length > 0 && (
                  <div className={styles.memberJobs}>{member.jobIds.length} job{member.jobIds.length !== 1 ? 's' : ''}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
