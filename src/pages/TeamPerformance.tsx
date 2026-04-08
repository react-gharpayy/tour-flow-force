import { useState } from 'react';
import { useAppState } from '@/lib/app-context';
import { getMemberPerformance, zones } from '@/lib/mock-data';
import { DateRangeToggle } from '@/components/DateRangeToggle';
import { DateRange, MemberPerformance } from '@/lib/types';
import { cn } from '@/lib/utils';
import { StatusBadge, OutcomeBadge } from '@/components/StatusBadge';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

export default function TeamPerformance() {
  const { tours } = useAppState();
  const [dateRange, setDateRange] = useState<DateRange>('today');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof MemberPerformance>('showUpRate');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterZone, setFilterZone] = useState<string>('all');

  const memberPerf = getMemberPerformance(tours);
  const filtered = filterZone === 'all' ? memberPerf : memberPerf.filter(m => m.zoneName.includes(filterZone));
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'number' && typeof bv === 'number') return sortAsc ? av - bv : bv - av;
    return 0;
  });

  const memberTours = selectedMember ? tours.filter(t => t.assignedTo === selectedMember || t.scheduledBy === selectedMember) : [];

  const handleSort = (key: keyof MemberPerformance) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortIcon = ({ field }: { field: keyof MemberPerformance }) => {
    if (sortKey !== field) return null;
    return sortAsc ? <ChevronUp className="h-3 w-3 inline" /> : <ChevronDown className="h-3 w-3 inline" />;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-foreground">Team Performance</h1>
        <div className="flex items-center gap-3">
          <select
            value={filterZone}
            onChange={e => setFilterZone(e.target.value)}
            className="bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground"
          >
            <option value="all">All Zones</option>
            {zones.map(z => (
              <option key={z.id} value={z.area}>{z.area}</option>
            ))}
          </select>
          <DateRangeToggle value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-surface-2/50">
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-2 font-medium">Role</th>
                <th className="text-left py-3 px-2 font-medium">Zone</th>
                <th className="text-center py-3 px-2 font-medium cursor-pointer" onClick={() => handleSort('leadsAdded')}>Leads <SortIcon field="leadsAdded" /></th>
                <th className="text-center py-3 px-2 font-medium cursor-pointer" onClick={() => handleSort('toursScheduled')}>Tours <SortIcon field="toursScheduled" /></th>
                <th className="text-center py-3 px-2 font-medium cursor-pointer" onClick={() => handleSort('toursCompleted')}>Done <SortIcon field="toursCompleted" /></th>
                <th className="text-center py-3 px-2 font-medium cursor-pointer" onClick={() => handleSort('showUpRate')}>Show% <SortIcon field="showUpRate" /></th>
                <th className="text-center py-3 px-2 font-medium cursor-pointer" onClick={() => handleSort('drafts')}>Drafts <SortIcon field="drafts" /></th>
                <th className="text-center py-3 px-2 font-medium cursor-pointer" onClick={() => handleSort('sameDayRate')}>Same-Day% <SortIcon field="sameDayRate" /></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(m => (
                <tr
                  key={m.memberId}
                  className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedMember(m.memberId === selectedMember ? null : m.memberId)}
                >
                  <td className="py-2.5 px-4 font-medium text-foreground">{m.name}</td>
                  <td className="py-2.5 px-2">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', m.role === 'flow-ops' ? 'bg-flow-ops/15 text-role-flow' : 'bg-tcm/15 text-role-tcm')}>
                      {m.role === 'flow-ops' ? 'Flow Ops' : 'TCM'}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-muted-foreground text-xs">{m.zoneName.split(' — ')[1]}</td>
                  <td className="py-2.5 px-2 text-center text-muted-foreground">{m.leadsAdded}</td>
                  <td className="py-2.5 px-2 text-center text-muted-foreground">{m.toursScheduled}</td>
                  <td className="py-2.5 px-2 text-center text-muted-foreground">{m.toursCompleted}</td>
                  <td className={cn('py-2.5 px-2 text-center font-medium', m.showUpRate >= 70 ? 'text-role-tcm' : m.showUpRate >= 50 ? 'text-role-hr' : 'text-danger')}>
                    {m.showUpRate}%
                  </td>
                  <td className="py-2.5 px-2 text-center text-role-hr font-medium">{m.drafts}</td>
                  <td className="py-2.5 px-2 text-center text-muted-foreground">{m.sameDayRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Tour History Drawer */}
      {selectedMember && (
        <div className="glass-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-foreground">
              Tour History — {sorted.find(m => m.memberId === selectedMember)?.name}
            </h3>
            <button onClick={() => setSelectedMember(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-left py-2 font-medium">Time</th>
                  <th className="text-left py-2 font-medium">Lead</th>
                  <th className="text-left py-2 font-medium">Property</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="text-left py-2 font-medium">Outcome</th>
                  <th className="text-left py-2 font-medium">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {memberTours.map(t => (
                  <tr key={t.id} className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">{t.tourDate}</td>
                    <td className="py-2 text-muted-foreground">{t.tourTime}</td>
                    <td className="py-2 text-foreground">{t.leadName}</td>
                    <td className="py-2 text-muted-foreground">{t.propertyName}</td>
                    <td className="py-2"><StatusBadge status={t.status} /></td>
                    <td className="py-2"><OutcomeBadge outcome={t.outcome} /></td>
                    <td className="py-2 text-muted-foreground text-xs">{t.remarks || '—'}</td>
                  </tr>
                ))}
                {memberTours.length === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No tours found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
