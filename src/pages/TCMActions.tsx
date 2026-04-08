import { useAppState } from '@/lib/app-context';
import { StatusBadge, OutcomeBadge } from '@/components/StatusBadge';
import { Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TCMActions() {
  const { tours, setTours } = useAppState();
  const myTours = tours.filter(t => t.assignedTo === 'm5' || t.assignedTo === 'm6');

  const now = new Date();
  const currentHour = now.getHours();

  const toConfirm = myTours.filter(t => t.status === 'scheduled');
  const missed = myTours.filter(t => t.status === 'no-show');
  const needsOutcome = myTours.filter(t => t.status === 'completed' && !t.outcome);
  const draftPush = myTours.filter(t => t.outcome === 'draft');

  const updateTour = (id: string, updates: Partial<typeof tours[0]>) => {
    setTours(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <h1 className="text-2xl font-heading font-bold text-foreground">Action Queue</h1>

      {/* Confirm */}
      <Section title="📞 Confirm Attendance" count={toConfirm.length} color="text-primary">
        {toConfirm.map(t => (
          <ActionRow key={t.id} tour={t}>
            <Button size="sm" onClick={() => updateTour(t.id, { status: 'confirmed' })}>Confirm</Button>
          </ActionRow>
        ))}
      </Section>

      {/* Missed */}
      <Section title="❌ Missed — Follow Up" count={missed.length} color="text-danger">
        {missed.map(t => (
          <ActionRow key={t.id} tour={t}>
            <button className="p-2 rounded-md bg-danger/10 text-danger hover:bg-danger/20">
              <Phone className="h-3.5 w-3.5" />
            </button>
          </ActionRow>
        ))}
      </Section>

      {/* Needs Outcome */}
      <Section title="📝 Update Outcome" count={needsOutcome.length} color="text-role-hr">
        {needsOutcome.map(t => (
          <ActionRow key={t.id} tour={t}>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => updateTour(t.id, { outcome: 'draft' })} className="h-7 text-xs">Draft</Button>
              <Button size="sm" variant="ghost" onClick={() => updateTour(t.id, { outcome: 'follow-up' })} className="h-7 text-xs">Follow-up</Button>
              <Button size="sm" variant="ghost" onClick={() => updateTour(t.id, { outcome: 'rejected' })} className="h-7 text-xs">Reject</Button>
            </div>
          </ActionRow>
        ))}
      </Section>

      {/* Draft Push */}
      <Section title="📄 Push for Draft Agreement" count={draftPush.length} color="text-role-hr">
        {draftPush.map(t => (
          <ActionRow key={t.id} tour={t}>
            <Button size="sm" variant="outline">Send Agreement</Button>
          </ActionRow>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, count, color, children }: { title: string; count: number; color: string; children: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <h3 className={`font-heading font-semibold text-sm ${color}`}>{title}</h3>
        <span className="text-xs text-muted-foreground">({count})</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ActionRow({ tour, children }: { tour: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-2/50 hover:bg-accent/30 transition-colors">
      <div>
        <span className="font-medium text-foreground text-sm">{tour.leadName}</span>
        <span className="text-muted-foreground text-xs ml-2">{tour.propertyName}</span>
        <span className="text-muted-foreground text-xs ml-2">· {tour.tourTime}</span>
      </div>
      {children}
    </div>
  );
}
