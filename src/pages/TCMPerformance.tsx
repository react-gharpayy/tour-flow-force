import { useAppState } from '@/lib/app-context';
import { MetricCard } from '@/components/MetricCard';
import { CalendarCheck, TrendingUp, FileText } from 'lucide-react';

export default function TCMPerformance() {
  const { tours } = useAppState();
  const myTours = tours.filter(t => t.assignedTo === 'm5' || t.assignedTo === 'm6');
  const completed = myTours.filter(t => t.status === 'completed').length;
  const showUps = myTours.filter(t => t.showUp === true).length;
  const drafts = myTours.filter(t => t.outcome === 'draft').length;

  return (
    <div className="space-y-6 animate-slide-up">
      <h1 className="text-2xl font-heading font-bold text-foreground">My Performance</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Tours" value={myTours.length} color="green" icon={<CalendarCheck className="h-4 w-4" />} />
        <MetricCard label="Completed" value={completed} color="green" icon={<TrendingUp className="h-4 w-4" />} />
        <MetricCard label="Show-Up %" value={myTours.length > 0 ? `${Math.round((showUps / myTours.length) * 100)}%` : '0%'} color="green" />
        <MetricCard label="Drafts Created" value={drafts} color="amber" icon={<FileText className="h-4 w-4" />} />
      </div>

      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-4 text-foreground">Daily Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Tours Assigned</span>
            <span className="text-foreground font-medium">{myTours.length}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Tours Completed</span>
            <span className="text-foreground font-medium">{completed}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">No-Shows</span>
            <span className="text-danger font-medium">{myTours.filter(t => t.showUp === false).length}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Pending Updates</span>
            <span className="text-role-hr font-medium">{myTours.filter(t => t.status === 'completed' && !t.outcome).length}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Draft Conversion</span>
            <span className="text-role-hr font-medium">{completed > 0 ? `${Math.round((drafts / completed) * 100)}%` : '0%'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
