import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarPlus, Users, FileText, BarChart3,
  ChevronLeft, ChevronRight, Building2
} from 'lucide-react';
import { useAppState } from '@/lib/app-context';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = {
  hr: [
    { label: 'HR Tower', path: '/', icon: LayoutDashboard },
    { label: 'Team Performance', path: '/team', icon: Users },
    { label: 'Zone Performance', path: '/zones', icon: BarChart3 },
    { label: 'Draft Tracker', path: '/drafts', icon: FileText },
    { label: 'All Tours', path: '/tours', icon: CalendarPlus },
  ],
  'flow-ops': [
    { label: 'My Dashboard', path: '/flow-ops', icon: LayoutDashboard },
    { label: 'Schedule Tour', path: '/schedule', icon: CalendarPlus },
    { label: 'My Tours', path: '/tours', icon: BarChart3 },
  ],
  tcm: [
    { label: "Today's Tours", path: '/tcm', icon: LayoutDashboard },
    { label: 'Action Queue', path: '/tcm/actions', icon: CalendarPlus },
    { label: 'My Performance', path: '/tcm/performance', icon: BarChart3 },
  ],
};

const roleLabels = { hr: 'HR Performance', 'flow-ops': 'Flow Ops', tcm: 'TCM' };
const roleColors = { hr: 'bg-role-hr', 'flow-ops': 'bg-role-flow', tcm: 'bg-role-tcm' };

export function AppSidebar() {
  const { currentRole, setCurrentRole } = useAppState();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const items = navItems[currentRole];

  return (
    <aside className={cn(
      'h-screen flex flex-col border-r border-border bg-sidebar transition-all duration-300',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
        <Building2 className="h-6 w-6 text-primary shrink-0" />
        {!collapsed && <span className="font-heading font-bold text-lg text-foreground">GHARPAYY</span>}
      </div>

      {/* Role Switcher */}
      <div className="px-2 py-3 border-b border-border">
        {(['hr', 'flow-ops', 'tcm'] as const).map(role => (
          <button
            key={role}
            onClick={() => setCurrentRole(role)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors mb-0.5',
              currentRole === role
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            )}
          >
            <span className={cn('w-2 h-2 rounded-full shrink-0', roleColors[role])} />
            {!collapsed && <span>{roleLabels[role]}</span>}
          </button>
        ))}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {items.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-border text-muted-foreground hover:text-foreground"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
