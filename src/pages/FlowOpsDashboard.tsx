import { useAppState } from '@/lib/app-context';
import { MetricCard } from '@/components/MetricCard';
import { CalendarCheck, Phone, TrendingUp, FileText } from 'lucide-react';

export default function FlowOpsDashboard() {
  const { tours } = useAppState();
  // Simulating "my" tours (first flow-ops member)
  const myTours = tours.filter(t => t.scheduledBy === 'm1');
  const completed = myTours.filter(t => t.status === 'completed').length;
  const showUps = myTours.filter(t => t.showUp === true).length;
  const drafts = myTours.filter(t => t.outcome === 'draft').length;
  const pending = myTours.filter(t => t.status === 'scheduled').length;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Flow Ops Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your scheduling performance today</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="My Tours" value={myTours.length} color="blue" icon={<CalendarCheck className="h-4 w-4" />} />
        <MetricCard label="Pending" value={pending} color="amber" icon={<Phone className="h-4 w-4" />} />
        <MetricCard label="Show-Ups" value={showUps} color="green" icon={<TrendingUp className="h-4 w-4" />} />
        <MetricCard label="Drafts" value={drafts} color="amber" icon={<FileText className="h-4 w-4" />} />
      </div>

      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-4 text-foreground">Tours I Scheduled</h3>
        <div className="space-y-2">
          {myTours.map(t => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-2/50 hover:bg-accent/30 transition-colors">
              <div>
                <span className="font-medium text-foreground">{t.leadName}</span>
                <span className="text-muted-foreground text-sm ml-3">{t.propertyName} · {t.area}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{t.tourTime}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'completed' ? 'bg-success/15 text-success' : t.status === 'confirmed' ? 'bg-tcm/15 text-role-tcm' : 'bg-primary/15 text-primary'}`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
