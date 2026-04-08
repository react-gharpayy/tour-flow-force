import { useAppState } from '@/lib/app-context';
import { StatusBadge } from '@/components/StatusBadge';
import { Phone, FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DraftTracker() {
  const { tours, setTours } = useAppState();
  const draftTours = tours.filter(t => t.outcome === 'draft');

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Draft Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">{draftTours.length} tours with outcome "Draft" — need rent agreement follow-up</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-surface-2/50">
                <th className="text-left py-3 px-4 font-medium">Lead</th>
                <th className="text-left py-3 px-2 font-medium">Phone</th>
                <th className="text-left py-3 px-2 font-medium">Property</th>
                <th className="text-left py-3 px-2 font-medium">TCM</th>
                <th className="text-left py-3 px-2 font-medium">Tour Date</th>
                <th className="text-left py-3 px-2 font-medium">Budget</th>
                <th className="text-left py-3 px-2 font-medium">Remarks</th>
                <th className="text-left py-3 px-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {draftTours.map(t => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-foreground">{t.leadName}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{t.phone}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{t.propertyName}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{t.assignedToName}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{t.tourDate}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">₹{t.budget.toLocaleString()}</td>
                  <td className="py-2.5 px-2 text-muted-foreground text-xs">{t.remarks || '—'}</td>
                  <td className="py-2.5 px-2">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Call">
                        <Phone className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-md bg-hr/10 text-role-hr hover:bg-hr/20 transition-colors" title="Send Agreement">
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {draftTours.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">No drafts to track</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
