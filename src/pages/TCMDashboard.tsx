import { useState, useEffect } from 'react';
import { useAppState } from '@/lib/app-context';
import { MetricCard } from '@/components/MetricCard';
import { StatusBadge, OutcomeBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Phone, TrendingUp, FileText, Clock } from 'lucide-react';
import { TourStatus, TourOutcome } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function TCMDashboard() {
  const { tours, setTours } = useAppState();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  // Simulating "my" tours as TCM
  const myTours = tours.filter(t => t.assignedTo === 'm5' || t.assignedTo === 'm6');
  const todayTours = myTours.sort((a, b) => a.tourTime.localeCompare(b.tourTime));
  const completed = myTours.filter(t => t.status === 'completed').length;
  const showUps = myTours.filter(t => t.showUp === true).length;
  const drafts = myTours.filter(t => t.outcome === 'draft').length;

  const now = new Date();
  const currentHour = now.getHours();
  const upcoming = myTours.filter(t => {
    const h = parseInt(t.tourTime.split(':')[0]);
    return h >= currentHour && h <= currentHour + 2 && t.status !== 'completed' && t.status !== 'cancelled';
  });

  const needsAction = myTours.filter(t => t.status === 'completed' && !t.outcome);

  const updateTour = (tourId: string, updates: Partial<typeof tours[0]>) => {
    setTours(prev => prev.map(t => t.id === tourId ? { ...t, ...updates } : t));
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Today's Tours</h1>
        <p className="text-sm text-muted-foreground mt-1">Your execution panel for today</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="My Tours" value={myTours.length} color="green" icon={<CalendarCheck className="h-4 w-4" />} />
        <MetricCard label="Completed" value={completed} color="green" icon={<TrendingUp className="h-4 w-4" />} />
        <MetricCard label="Show-Up %" value={myTours.length > 0 ? `${Math.round((showUps / myTours.length) * 100)}%` : '0%'} color={showUps / myTours.length >= 0.7 ? 'green' : 'red'} />
        <MetricCard label="Drafts" value={drafts} color="amber" icon={<FileText className="h-4 w-4" />} />
      </div>

      {/* Upcoming - Action Required */}
      {upcoming.length > 0 && (
        <div className="glass-card p-5 border-primary/30">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-primary animate-pulse-glow" />
            <h3 className="font-heading font-semibold text-sm text-primary">Upcoming — Confirm Now</h3>
          </div>
          <div className="space-y-2">
            {upcoming.map(t => (
              <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-primary/5">
                <div>
                  <span className="font-medium text-foreground">{t.leadName}</span>
                  <span className="text-muted-foreground text-sm ml-2">{t.propertyName}</span>
                  <span className="text-muted-foreground text-xs ml-2">{t.tourTime}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateTour(t.id, { status: 'confirmed' })}>
                    Confirm
                  </Button>
                  <button className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20" title="Call">
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Needs Outcome */}
      {needsAction.length > 0 && (
        <div className="glass-card p-5 border-hr/30">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-role-hr" />
            <h3 className="font-heading font-semibold text-sm text-role-hr">Update Outcome</h3>
          </div>
          <div className="space-y-3">
            {needsAction.map(t => (
              <TourOutcomeRow key={t.id} tour={t} onUpdate={updateTour} />
            ))}
          </div>
        </div>
      )}

      {/* All Today's Tours */}
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-4 text-foreground">Full Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 font-medium">Time</th>
                <th className="text-left py-2 font-medium">Lead</th>
                <th className="text-left py-2 font-medium">Property</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-left py-2 font-medium">Show-Up</th>
                <th className="text-left py-2 font-medium">Outcome</th>
                <th className="text-left py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todayTours.map(t => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2 text-muted-foreground">{t.tourTime}</td>
                  <td className="py-2 font-medium text-foreground">{t.leadName}</td>
                  <td className="py-2 text-muted-foreground">{t.propertyName}</td>
                  <td className="py-2"><StatusBadge status={t.status} /></td>
                  <td className="py-2">{t.showUp === true ? '✅' : t.showUp === false ? '❌' : '—'}</td>
                  <td className="py-2"><OutcomeBadge outcome={t.outcome} /></td>
                  <td className="py-2">
                    <div className="flex gap-1">
                      {t.status === 'scheduled' && (
                        <Button size="sm" variant="ghost" onClick={() => updateTour(t.id, { status: 'confirmed' })} className="h-7 text-xs">Confirm</Button>
                      )}
                      {t.status === 'confirmed' && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => updateTour(t.id, { status: 'completed', showUp: true })} className="h-7 text-xs text-role-tcm">Show</Button>
                          <Button size="sm" variant="ghost" onClick={() => updateTour(t.id, { status: 'no-show', showUp: false })} className="h-7 text-xs text-danger">No Show</Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TourOutcomeRow({ tour, onUpdate }: { tour: any; onUpdate: (id: string, u: any) => void }) {
  const [remarks, setRemarks] = useState('');

  const setOutcome = (outcome: TourOutcome) => {
    onUpdate(tour.id, { outcome, remarks });
    toast.success(`Tour outcome set to ${outcome}`);
  };

  return (
    <div className="px-4 py-3 rounded-lg bg-surface-2/50 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium text-foreground">{tour.leadName}</span>
          <span className="text-muted-foreground text-sm ml-2">{tour.propertyName}</span>
        </div>
      </div>
      <Textarea
        placeholder="Add remarks — objections, feedback, next steps..."
        value={remarks}
        onChange={e => setRemarks(e.target.value)}
        className="bg-surface-3 border-border text-sm h-16 resize-none"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setOutcome('draft')} className="bg-hr/20 text-role-hr hover:bg-hr/30 border-0">Draft</Button>
        <Button size="sm" onClick={() => setOutcome('follow-up')} variant="outline" className="text-primary">Follow-up</Button>
        <Button size="sm" onClick={() => setOutcome('rejected')} variant="outline" className="text-danger">Rejected</Button>
      </div>
    </div>
  );
}
