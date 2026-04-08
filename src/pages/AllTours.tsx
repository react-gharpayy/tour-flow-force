import { useAppState } from '@/lib/app-context';
import { StatusBadge, OutcomeBadge } from '@/components/StatusBadge';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TourStatus, TourOutcome } from '@/lib/types';

export default function AllTours() {
  const { tours, setTours } = useAppState();
  const [statusFilter, setStatusFilter] = useState<TourStatus | 'all'>('all');
  const [outcomeFilter, setOutcomeFilter] = useState<TourOutcome | 'all'>('all');

  const filtered = tours.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (outcomeFilter !== 'all' && t.outcome !== outcomeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <h1 className="text-2xl font-heading font-bold text-foreground">All Tours</h1>

      <div className="flex gap-3 flex-wrap">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground">
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="no-show">No Show</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={outcomeFilter ?? 'all'} onChange={e => setOutcomeFilter(e.target.value === 'all' ? 'all' : e.target.value as TourOutcome)} className="bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground">
          <option value="all">All Outcomes</option>
          <option value="draft">Draft</option>
          <option value="follow-up">Follow-up</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-surface-2/50">
                <th className="text-left py-3 px-4 font-medium">Time</th>
                <th className="text-left py-3 px-2 font-medium">Lead</th>
                <th className="text-left py-3 px-2 font-medium">Property</th>
                <th className="text-left py-3 px-2 font-medium">Area</th>
                <th className="text-left py-3 px-2 font-medium">TCM</th>
                <th className="text-left py-3 px-2 font-medium">Scheduled By</th>
                <th className="text-left py-3 px-2 font-medium">Source</th>
                <th className="text-left py-3 px-2 font-medium">Status</th>
                <th className="text-left py-3 px-2 font-medium">Show-Up</th>
                <th className="text-left py-3 px-2 font-medium">Outcome</th>
                <th className="text-left py-3 px-2 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2 px-4 text-muted-foreground">{t.tourTime}</td>
                  <td className="py-2 px-2 font-medium text-foreground">{t.leadName}</td>
                  <td className="py-2 px-2 text-muted-foreground">{t.propertyName}</td>
                  <td className="py-2 px-2 text-muted-foreground">{t.area}</td>
                  <td className="py-2 px-2 text-muted-foreground">{t.assignedToName}</td>
                  <td className="py-2 px-2 text-muted-foreground">{t.scheduledByName}</td>
                  <td className="py-2 px-2 text-muted-foreground capitalize">{t.bookingSource}</td>
                  <td className="py-2 px-2"><StatusBadge status={t.status} /></td>
                  <td className="py-2 px-2">{t.showUp === true ? '✅' : t.showUp === false ? '❌' : '—'}</td>
                  <td className="py-2 px-2"><OutcomeBadge outcome={t.outcome} /></td>
                  <td className="py-2 px-2 text-muted-foreground text-xs max-w-[150px] truncate">{t.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
