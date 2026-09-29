export type UserRole = 'worker' | 'supervisor' | 'admin';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  result: string;
  hash: string;
  ipAddress: string;
}

export type SafetyStatus = 'NORMAL' | 'ATTENTION' | 'HIGH_EXPOSURE' | 'INVALID' | 'CRITICAL_EXPOSURE' | 'WARNING' | 'SAFE';

export interface Worker {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  role: string;
  designation: string;
  supervisor: string;
  shift: string;
  contactInfo: {
    phone: string;
    email: string;
    emergency?: string;
    emergencyContact?: string;
  };
  avatarUrl: string;
  certificationStatus: string;
  certifiedUntil: string;
  bandId: string;
  dosimeterBandId?: string;
  dosimeterStatus: 'active' | 'calibration_required' | 'expired';
  dosimeterExpiry: string;
  currentSafetyStatus: SafetyStatus;
  qrPayload: string;
  shiftStartTime: string;
  accumulatedShiftPpmH: number;
}

export interface ReportFilterOptions {
  dateRange: 'all' | 'today' | '7days' | '30days';
  exposureStatus: 'all' | 'NORMAL' | 'ATTENTION' | 'HIGH_EXPOSURE';
  employeeId: string | 'all';
}

export interface DosimeterBand {
  id: string;
  serialNumber: string;
  model: string;
  pairedWorkerId: string;
  pairedAt: string;
  calibrationDueDate: string;
  opticalIntegrityPct: number;
  status: 'active' | 'calibration_required' | 'expired';
  totalScans: number;
}

export interface Reading {
  id: string;
  timestamp: string;
  workerId: string;
  workerName: string;
  bandId: string;
  exposureDosePpmH: number; // ppm.h cumulative dose
  status: SafetyStatus;
  confidencePct: number; // e.g. 94%
  shiftDurationMinutes: number; // e.g. 492 mins (8h 12m)
  exposureRatePpmH: number; // ppm per hour
  location: string;
  colorShiftHex: string;
  baselineColorHex: string;
  notes?: string;
  qualityScorePct: number; // e.g. 98%
  deltaE: number; // Optical color distance measure
  rawRgb: {
    r: number;
    g: number;
    b: number;
  };
  sampleTag?: string;
}

export type EscalationState = 'detected' | 'supervisor_notified' | 'supervisor_acknowledged' | 'escalated_to_expert';

export interface TimelineStep {
  id: string;
  time: string;
  label: string;
  subtext?: string;
  status: 'completed' | 'active' | 'pending';
  iconType: 'detect' | 'notify' | 'ack' | 'escalate';
}

export interface AlertItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  category: 'exposure_limit' | 'calibration' | 'quality' | 'system';
  acknowledged: boolean;
  readingId?: string;
  workerName?: string;
  location?: string;
  exposureDosePpmH?: number;
  escalationState?: EscalationState;
  supervisorName?: string;
  acknowledgedAt?: string;
  escalatedAt?: string;
  timeline?: TimelineStep[];
  resolved?: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  recipientRole: 'worker' | 'supervisor' | 'admin';
  read: boolean;
  alertId?: string;
  readingId?: string;
  type: 'incident' | 'warning' | 'info';
}

export interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
}

export type NavTab = 'home' | 'history' | 'alerts' | 'profile' | 'dashboard';
export type ScanStep = 'camera' | 'quality' | 'analysis' | 'result';

