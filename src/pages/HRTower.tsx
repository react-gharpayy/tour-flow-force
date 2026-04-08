import { useState, useEffect } from 'react';
import { useAppState } from '@/lib/app-context';
import { MetricCard } from '@/components/MetricCard';
import { HourlyHeatmap } from '@/components/HourlyHeatmap';
import { DateRangeToggle } from '@/components/DateRangeToggle';
import { StatusBadge, OutcomeBadge } from '@/components/StatusBadge';
import { getZonePerformance, getMemberPerformance } from '@/lib/mock-data';
import { DateRange } from '@/lib/types';
import { CalendarCheck, Users, TrendingUp, FileText, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HRTower() {
  const { tours } = useAppState();
  const [dateRange, setDateRange] = useState<DateRange>('today');
  const [, setTick] = useState(0);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const total = tours.length;
  const completed = tours.filter(t => t.status === 'completed').length;
  const showUps = tours.filter(t => t.showUp === true).length;
  const showUpRate = total > 0 ? Math.round((showUps / total) * 100) : 0;
  const drafts = tours.filter(t => t.outcome === 'draft').length;
  const sameDayTours = tours.filter(t => t.tourDate === new Date().toISOString().split('T')[0]).length;
  const sameDayRate = total > 0 ? Math.round((sameDayTours / total) * 100) : 0;
  const draftRate = completed > 0 ? Math.round((drafts / completed) * 100) : 0;

  const zonePerf = getZonePerformance(tours);
  const memberPerf = getMemberPerformance(tours);

  // Red flags
  const lowShowUp = memberPerf.filter(m => m.showUpRate < 50 && m.toursScheduled > 0);
  const noUpdates = tours.filter(t => t.status === 'completed' && !t.outcome);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">HR Control Tower</h1>
          <p className="text-sm text-muted-foreground mt-1">Full visibility. Real-time performance tracking.</p>
        </div>
        <DateRangeToggle value={dateRange} onChange={setDateRange} />
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard label="Tours Scheduled" value={total} color="blue" icon={<CalendarCheck className="h-4 w-4" />} />
        <MetricCard label="Tours Completed" value={completed} color="green" icon={<Users className="h-4 w-4" />} />
        <MetricCard label="Show-Up Rate" value={`${showUpRate}%`} color={showUpRate >= 70 ? 'green' : 'red'} icon={<TrendingUp className="h-4 w-4" />} />
        <MetricCard label="Same-Day %" value={`${sameDayRate}%`} color="amber" />
        <MetricCard label="Tour → Draft %" value={`${draftRate}%`} color="amber" icon={<FileText className="h-4 w-4" />} />
      </div>

      {/* Red Flags */}
      {(lowShowUp.length > 0 || noUpdates.length > 0) && (
        <div className="glass-card p-4 border-danger/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <h3 className="font-heading font-semibold text-sm text-danger">Red Flags</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {lowShowUp.length > 0 && (
              <div className="text-muted-foreground">
                <span className="text-danger font-medium">{lowShowUp.length}</span> members with show-up rate &lt; 50%
              </div>
            )}
            {noUpdates.length > 0 && (
              <div className="text-muted-foreground">
                <span className="text-danger font-medium">{noUpdates.length}</span> completed tours with no outcome update
              </div>
            )}
          </div>
        </div>
      )}

      {/* Heatmap + Zone Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HourlyHeatmap />
        
        {/* Zone Performance */}
        <div className="glass-card p-5">
          <h3 className="font-heading font-semibold text-sm mb-4 text-foreground">Zone Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 font-medium">Zone</th>
                  <th className="text-center py-2 font-medium">Tours</th>
                  <th className="text-center py-2 font-medium">Done</th>
                  <th className="text-center py-2 font-medium">Show%</th>
                  <th className="text-center py-2 font-medium">Drafts</th>
                </tr>
              </thead>
              <tbody>
                {zonePerf.map(z => (
                  <tr key={z.zoneId} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-2.5 font-medium text-foreground">{z.zoneName.split(' — ')[1]}</td>
                    <td className="text-center text-muted-foreground">{z.toursScheduled}</td>
                    <td className="text-center text-muted-foreground">{z.toursCompleted}</td>
                    <td className={cn('text-center font-medium', z.showUpRate >= 70 ? 'text-role-tcm' : z.showUpRate >= 50 ? 'text-role-hr' : 'text-danger')}>
                      {z.showUpRate}%
                    </td>
                    <td className="text-center text-role-hr font-medium">{z.drafts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Live Activity - Recent Tours */}
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-4 text-foreground">Live Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 font-medium">Time</th>
                <th className="text-left py-2 font-medium">Lead</th>
                <th className="text-left py-2 font-medium">Property</th>
                <th className="text-left py-2 font-medium">TCM</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-left py-2 font-medium">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {tours.slice(0, 15).map(t => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2 text-muted-foreground">{t.tourTime}</td>
                  <td className="py-2 font-medium text-foreground">{t.leadName}</td>
                  <td className="py-2 text-muted-foreground">{t.propertyName}</td>
                  <td className="py-2 text-muted-foreground">{t.assignedToName}</td>
                  <td className="py-2"><StatusBadge status={t.status} /></td>
                  <td className="py-2"><OutcomeBadge outcome={t.outcome} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
