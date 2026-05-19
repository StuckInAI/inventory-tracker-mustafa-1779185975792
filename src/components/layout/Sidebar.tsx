import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitBranch,
  Calendar,
  Building2,
  BarChart3,
  Settings,
  UserCog,
  ChevronRight,
} from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import styles from './Sidebar.module.css';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/candidates', icon: Users, label: 'Candidates' },
  { to: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { to: '/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/clients', icon: Building2, label: 'Clients' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/team', icon: UserCog, label: 'Team' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { state } = useAppContext();
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandIcon}>TF</div>
        <div>
          <div className={styles.brandName}>TalentFlow</div>
          <div className={styles.brandSub}>ATS Platform</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={clsx(styles.navItem, isActive && styles.navItemActive)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {isActive && <ChevronRight size={14} className={styles.chevron} />}
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userAvatar}>{state.currentUser.avatar}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{state.currentUser.name}</div>
          <div className={styles.userRole}>{state.currentUser.role}</div>
        </div>
      </div>
    </aside>
  );
}
