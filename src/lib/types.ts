export type Role = 'flow-ops' | 'tcm' | 'hr';

export interface Zone {
  id: string;
  name: string;
  area: string;
}

export type TeamMemberRole = 'flow-ops' | 'tcm';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamMemberRole;
  zoneId: string;
  phone: string;
}

export type TourStatus = 'scheduled' | 'confirmed' | 'completed' | 'no-show' | 'cancelled';
export type TourOutcome = 'draft' | 'follow-up' | 'rejected' | null;
export type BookingSource = 'call' | 'whatsapp' | 'referral' | 'walk-in';
export type LeadType = 'urgent' | 'future';

export interface Tour {
  id: string;
  leadName: string;
  phone: string;
  assignedTo: string;
  assignedToName: string;
  propertyName: string;
  area: string;
  zoneId: string;
  tourDate: string;
  tourTime: string;
  bookingSource: BookingSource;
  scheduledBy: string;
  scheduledByName: string;
  leadType: LeadType;
  status: TourStatus;
  showUp: boolean | null;
  outcome: TourOutcome;
  remarks: string;
  budget: number;
  createdAt: string;
}

export type DateRange = 'today' | 'week' | 'month';

export interface MetricCard {
  label: string;
  value: number | string;
  change?: number;
  color?: 'blue' | 'green' | 'amber' | 'red';
}

export interface HeatmapData {
  hour: string;
  tours: number;
  showUps: number;
  drafts: number;
}

export interface ZonePerformance {
  zoneId: string;
  zoneName: string;
  toursScheduled: number;
  toursCompleted: number;
  showUpRate: number;
  drafts: number;
  closures: number;
}

export interface MemberPerformance {
  memberId: string;
  name: string;
  role: TeamMemberRole;
  zoneName: string;
  leadsAdded: number;
  toursScheduled: number;
  toursCompleted: number;
  showUpRate: number;
  drafts: number;
  closures: number;
  sameDayRate: number;
}

// MYT Lead Tracker
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'tour-scheduled' | 'dead';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  area: string;
  budget: number;
  moveInDate: string;
  dateConfirmed: boolean;
  status: LeadStatus;
  mytQualified: boolean;
  addedBy: string;
  addedByName: string;
  createdAt: string;
  notes: string;
}

// Bookings
export type AgreementStatus = 'pending' | 'signed' | 'moved-in';

export interface Booking {
  id: string;
  leadName: string;
  phone: string;
  propertyName: string;
  area: string;
  rentValue: number;
  viaTour: boolean;
  tourId: string | null;
  agreementStatus: AgreementStatus;
  closedBy: string;
  closedByName: string;
  createdAt: string;
}

// Cycle Tracker
export interface CycleData {
  cycleNumber: number;
  chatsClosed: number;
  mytLeads: number;
  toursScheduled: number;
  sameDayConfirmed: number;
}
