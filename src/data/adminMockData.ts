export interface AdminWorker {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  role: string;
  bandId: string;
  latestExposure: number;
  status: 'NORMAL' | 'ATTENTION' | 'HIGH_EXPOSURE' | 'INVALID';
  lastScan: string;
  totalReadings: number;
  shiftStatus: 'active' | 'off_shift' | 'break';
}

export interface AdminReading {
  id: string;
  workerId: string;
  workerName: string;
  department: string;
  bandId: string;
  exposure: number;
  confidence: number;
  timestamp: string;
  status: 'NORMAL' | 'ATTENTION' | 'HIGH_EXPOSURE' | 'INVALID';
  location: string;
  modelVersion: string;
}

export interface AdminIncident {
  id: string;
  workerId: string;
  workerName: string;
  readingId: string;
  exposure: number;
  timestamp: string;
  location: string;
  severity: 'critical' | 'warning';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  assignedSupervisor: string;
  notes: string[];
  timeline: { time: string; action: string; by: string }[];
}

export interface AdminDosimeter {
  bandId: string;
  batch: string;
  assignedWorker: string;
  assignedWorkerId: string;
  manufacturedDate: string;
  expiryDate: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'unassigned';
  readingsCount: number;
  lastScan: string;
}

export const adminWorkers: AdminWorker[] = [
  { id: 'w1', name: 'Rahul Patil',    employeeId: 'EMP-184', department: 'Maintenance',  role: 'Sr. Plant Technician',     bandId: 'H2S-IND-PN-000184', latestExposure: 18.4, status: 'NORMAL',       lastScan: '2026-09-21T18:42:00Z', totalReadings: 48, shiftStatus: 'active' },
  { id: 'w2', name: 'Amit Kumar',     employeeId: 'EMP-207', department: 'Operations',   role: 'Process Operator',          bandId: 'H2S-IND-PN-000207', latestExposure: 26.1, status: 'ATTENTION',    lastScan: '2026-09-21T17:11:00Z', totalReadings: 34, shiftStatus: 'active' },
  { id: 'w3', name: 'Priya Sharma',   employeeId: 'EMP-093', department: 'Safety',       role: 'Safety Inspector',          bandId: 'H2S-IND-PN-000093', latestExposure: 8.2,  status: 'NORMAL',       lastScan: '2026-09-21T16:30:00Z', totalReadings: 61, shiftStatus: 'active' },
  { id: 'w4', name: 'Vikram Singh',   employeeId: 'EMP-312', department: 'Maintenance',  role: 'Pipeline Welder',           bandId: 'H2S-IND-PN-000312', latestExposure: 42.8, status: 'HIGH_EXPOSURE',lastScan: '2026-09-21T18:08:00Z', totalReadings: 27, shiftStatus: 'active' },
  { id: 'w5', name: 'Anjali Rao',     employeeId: 'EMP-156', department: 'Operations',   role: 'Control Room Operator',     bandId: 'H2S-IND-PN-000156', latestExposure: 12.3, status: 'NORMAL',       lastScan: '2026-09-21T15:55:00Z', totalReadings: 42, shiftStatus: 'active' },
  { id: 'w6', name: 'Suresh Nair',    employeeId: 'EMP-088', department: 'Engineering',  role: 'Instrument Engineer',       bandId: 'H2S-IND-PN-000088', latestExposure: 6.8,  status: 'NORMAL',       lastScan: '2026-09-21T14:20:00Z', totalReadings: 19, shiftStatus: 'break' },
  { id: 'w7', name: 'Deepak Gupta',   employeeId: 'EMP-275', department: 'Maintenance',  role: 'Field Service Technician',  bandId: 'H2S-IND-PN-000275', latestExposure: 0.0,  status: 'INVALID',      lastScan: '2026-09-21T13:40:00Z', totalReadings: 22, shiftStatus: 'active' },
  { id: 'w8', name: 'Kavya Reddy',    employeeId: 'EMP-121', department: 'Safety',       role: 'Safety Coordinator',        bandId: 'H2S-IND-PN-000121', latestExposure: 4.1,  status: 'NORMAL',       lastScan: '2026-09-21T16:05:00Z', totalReadings: 55, shiftStatus: 'active' },
  { id: 'w9', name: 'Arjun Mehta',    employeeId: 'EMP-349', department: 'Operations',   role: 'Process Shift Supervisor',  bandId: 'H2S-IND-PN-000349', latestExposure: 31.7, status: 'ATTENTION',    lastScan: '2026-09-21T17:45:00Z', totalReadings: 38, shiftStatus: 'active' },
  { id: 'w10',name: 'Neha Joshi',     employeeId: 'EMP-064', department: 'Engineering',  role: 'Chemical Process Engineer', bandId: 'H2S-IND-PN-000064', latestExposure: 9.9,  status: 'NORMAL',       lastScan: '2026-09-21T15:10:00Z', totalReadings: 31, shiftStatus: 'active' },
];

export const adminReadings: AdminReading[] = [
  { id: 'R-9821', workerId: 'w4', workerName: 'Vikram Singh',   department: 'Maintenance', bandId: 'H2S-IND-PN-000312', exposure: 42.8, confidence: 97, timestamp: '2026-09-21T18:08:00Z', status: 'HIGH_EXPOSURE', location: 'Acid Gas Separator East',  modelVersion: 'H2S-COLOR-v1.2' },
  { id: 'R-9820', workerId: 'w1', workerName: 'Rahul Patil',    department: 'Maintenance', bandId: 'H2S-IND-PN-000184', exposure: 18.4, confidence: 94, timestamp: '2026-09-21T18:42:00Z', status: 'NORMAL',        location: 'Pump Station B - Sector 4', modelVersion: 'H2S-COLOR-v1.2' },
  { id: 'R-9819', workerId: 'w9', workerName: 'Arjun Mehta',    department: 'Operations',  bandId: 'H2S-IND-PN-000349', exposure: 31.7, confidence: 91, timestamp: '2026-09-21T17:45:00Z', status: 'ATTENTION',     location: 'Desulfurization Unit 2',   modelVersion: 'H2S-COLOR-v1.2' },
  { id: 'R-9818', workerId: 'w2', workerName: 'Amit Kumar',     department: 'Operations',  bandId: 'H2S-IND-PN-000207', exposure: 26.1, confidence: 92, timestamp: '2026-09-21T17:11:00Z', status: 'ATTENTION',     location: 'Storage Tank Farm West',   modelVersion: 'H2S-COLOR-v1.2' },
  { id: 'R-9817', workerId: 'w3', workerName: 'Priya Sharma',   department: 'Safety',      bandId: 'H2S-IND-PN-000093', exposure: 8.2,  confidence: 98, timestamp: '2026-09-21T16:30:00Z', status: 'NORMAL',        location: 'Safety Control Station',   modelVersion: 'H2S-COLOR-v1.2' },
  { id: 'R-9816', workerId: 'w8', workerName: 'Kavya Reddy',    department: 'Safety',      bandId: 'H2S-IND-PN-000121', exposure: 4.1,  confidence: 97, timestamp: '2026-09-21T16:05:00Z', status: 'NORMAL',        location: 'Safety Control Station',   modelVersion: 'H2S-COLOR-v1.2' },
  { id: 'R-9815', workerId: 'w5', workerName: 'Anjali Rao',     department: 'Operations',  bandId: 'H2S-IND-PN-000156', exposure: 12.3, confidence: 95, timestamp: '2026-09-21T15:55:00Z', status: 'NORMAL',        location: 'Control Room Annex',       modelVersion: 'H2S-COLOR-v1.2' },
  { id: 'R-9814', workerId: 'w10',workerName: 'Neha Joshi',     department: 'Engineering', bandId: 'H2S-IND-PN-000064', exposure: 9.9,  confidence: 96, timestamp: '2026-09-21T15:10:00Z', status: 'NORMAL',        location: 'Engineering Lab B',        modelVersion: 'H2S-COLOR-v1.2' },
  { id: 'R-9813', workerId: 'w7', workerName: 'Deepak Gupta',   department: 'Maintenance', bandId: 'H2S-IND-PN-000275', exposure: 0.0,  confidence: 35, timestamp: '2026-09-21T13:40:00Z', status: 'INVALID',       location: 'Maintenance Bay 3',        modelVersion: 'H2S-COLOR-v1.2' },
  { id: 'R-9812', workerId: 'w6', workerName: 'Suresh Nair',    department: 'Engineering', bandId: 'H2S-IND-PN-000088', exposure: 6.8,  confidence: 98, timestamp: '2026-09-21T14:20:00Z', status: 'NORMAL',        location: 'Instrument Workshop',      modelVersion: 'H2S-COLOR-v1.2' },
];

export const adminIncidents: AdminIncident[] = [
  {
    id: 'INC-2026-041',
    workerId: 'w4',
    workerName: 'Vikram Singh',
    readingId: 'R-9821',
    exposure: 42.8,
    timestamp: '2026-09-21T18:08:00Z',
    location: 'Acid Gas Separator East — Plant Area B',
    severity: 'critical',
    status: 'OPEN',
    assignedSupervisor: 'Sanjay Kumar (Safety Lead)',
    notes: ['High-dose optical reaction confirmed. Worker evacuated to safe zone at 18:09.'],
    timeline: [
      { time: '18:08', action: 'HIGH_EXPOSURE reading detected (42.8 ppm·h)', by: 'System' },
      { time: '18:08', action: 'Worker Vikram Singh notified via in-app alert', by: 'System' },
      { time: '18:08', action: 'Supervisor Sanjay Kumar auto-notified', by: 'System' },
      { time: '18:12', action: 'Incident logged as INC-2026-041', by: 'System' },
    ],
  },
  {
    id: 'INC-2026-040',
    workerId: 'w1',
    workerName: 'Rahul Patil',
    readingId: 'R-8901',
    exposure: 78.5,
    timestamp: '2026-09-18T14:10:00Z',
    location: 'Crude Distillation Vent Line 3',
    severity: 'critical',
    status: 'INVESTIGATING',
    assignedSupervisor: 'Sanjay Kumar (Safety Lead)',
    notes: [
      'Bleed valve failure during routine inspection caused uncontrolled H₂S release.',
      'SCBA deployed. Cordon established at 14:15.',
    ],
    timeline: [
      { time: '14:10', action: 'HIGH_EXPOSURE reading detected (78.5 ppm·h)', by: 'System' },
      { time: '14:11', action: 'Worker notified. SCBA activated.', by: 'System' },
      { time: '14:11', action: 'Supervisor Sanjay Kumar notified', by: 'System' },
      { time: '14:15', action: 'Incident opened as INC-2026-040', by: 'Sanjay Kumar' },
      { time: '14:20', action: 'Status changed to INVESTIGATING', by: 'Sanjay Kumar' },
      { time: '15:30', action: 'Note added: Area cordoned. Isolation confirmed.', by: 'Sanjay Kumar' },
    ],
  },
  {
    id: 'INC-2026-037',
    workerId: 'w2',
    workerName: 'Amit Kumar',
    readingId: 'R-9100',
    exposure: 48.9,
    timestamp: '2026-09-15T11:22:00Z',
    location: 'Desulfurization Unit 2',
    severity: 'critical',
    status: 'RESOLVED',
    assignedSupervisor: 'Sanjay Kumar (Safety Lead)',
    notes: [
      'Reading exceeded attention threshold. Remediation and PPE upgrade completed.',
      'Worker medically cleared. Returned to duty 16:00.',
    ],
    timeline: [
      { time: '11:22', action: 'HIGH_EXPOSURE reading detected (48.9 ppm·h)', by: 'System' },
      { time: '11:23', action: 'Supervisor Sanjay Kumar notified', by: 'System' },
      { time: '11:30', action: 'Incident opened as INC-2026-037', by: 'Sanjay Kumar' },
      { time: '12:10', action: 'Status changed to INVESTIGATING', by: 'Sanjay Kumar' },
      { time: '14:45', action: 'Medical clearance confirmed', by: 'Plant Medic' },
      { time: '15:55', action: 'Incident RESOLVED', by: 'Sanjay Kumar' },
    ],
  },
];

export const adminDosimeters: AdminDosimeter[] = [
  { bandId: 'H2S-IND-PN-000184', batch: 'BATCH-09', assignedWorker: 'Rahul Patil',  assignedWorkerId: 'w1', manufacturedDate: '2026-09-01', expiryDate: '2026-09-30', status: 'active',         readingsCount: 48, lastScan: '2026-09-21T18:42:00Z' },
  { bandId: 'H2S-IND-PN-000207', batch: 'BATCH-09', assignedWorker: 'Amit Kumar',   assignedWorkerId: 'w2', manufacturedDate: '2026-09-01', expiryDate: '2026-09-30', status: 'active',         readingsCount: 34, lastScan: '2026-09-21T17:11:00Z' },
  { bandId: 'H2S-IND-PN-000093', batch: 'BATCH-08', assignedWorker: 'Priya Sharma', assignedWorkerId: 'w3', manufacturedDate: '2026-08-01', expiryDate: '2026-09-22', status: 'expiring_soon',  readingsCount: 61, lastScan: '2026-09-21T16:30:00Z' },
  { bandId: 'H2S-IND-PN-000312', batch: 'BATCH-09', assignedWorker: 'Vikram Singh', assignedWorkerId: 'w4', manufacturedDate: '2026-09-01', expiryDate: '2026-09-30', status: 'active',         readingsCount: 27, lastScan: '2026-09-21T18:08:00Z' },
  { bandId: 'H2S-IND-PN-000156', batch: 'BATCH-09', assignedWorker: 'Anjali Rao',   assignedWorkerId: 'w5', manufacturedDate: '2026-09-01', expiryDate: '2026-09-30', status: 'active',         readingsCount: 42, lastScan: '2026-09-21T15:55:00Z' },
  { bandId: 'H2S-IND-PN-000088', batch: 'BATCH-08', assignedWorker: 'Suresh Nair',  assignedWorkerId: 'w6', manufacturedDate: '2026-08-01', expiryDate: '2026-09-21', status: 'expiring_soon',  readingsCount: 19, lastScan: '2026-09-21T14:20:00Z' },
  { bandId: 'H2S-IND-PN-000275', batch: 'BATCH-09', assignedWorker: 'Deepak Gupta', assignedWorkerId: 'w7', manufacturedDate: '2026-09-01', expiryDate: '2026-09-30', status: 'active',         readingsCount: 22, lastScan: '2026-09-21T13:40:00Z' },
  { bandId: 'H2S-IND-PN-000121', batch: 'BATCH-08', assignedWorker: 'Kavya Reddy',  assignedWorkerId: 'w8', manufacturedDate: '2026-08-01', expiryDate: '2026-09-28', status: 'active',         readingsCount: 55, lastScan: '2026-09-21T16:05:00Z' },
  { bandId: 'H2S-IND-PN-000349', batch: 'BATCH-09', assignedWorker: 'Arjun Mehta',  assignedWorkerId: 'w9', manufacturedDate: '2026-09-01', expiryDate: '2026-09-30', status: 'active',         readingsCount: 38, lastScan: '2026-09-21T17:45:00Z' },
  { bandId: 'H2S-IND-PN-000064', batch: 'BATCH-09', assignedWorker: 'Neha Joshi',   assignedWorkerId: 'w10',manufacturedDate: '2026-09-01', expiryDate: '2026-09-30', status: 'active',         readingsCount: 31, lastScan: '2026-09-21T15:10:00Z' },
  { bandId: 'H2S-IND-PN-000400', batch: 'BATCH-09', assignedWorker: '—',            assignedWorkerId: '',   manufacturedDate: '2026-09-01', expiryDate: '2026-09-30', status: 'unassigned',     readingsCount: 0,  lastScan: '—' },
  { bandId: 'H2S-IND-PN-000401', batch: 'BATCH-07', assignedWorker: '—',            assignedWorkerId: '',   manufacturedDate: '2026-07-01', expiryDate: '2026-09-01', status: 'expired',        readingsCount: 0,  lastScan: '—' },
];

// 7-day trend data for analytics/overview charts
export const sevenDayTrend = [
  { date: '15 Sep', normal: 28, attention: 2, high: 0, invalid: 1 },
  { date: '16 Sep', normal: 31, attention: 3, high: 1, invalid: 0 },
  { date: '17 Sep', normal: 26, attention: 4, high: 0, invalid: 2 },
  { date: '18 Sep', normal: 22, attention: 5, high: 2, invalid: 1 },
  { date: '19 Sep', normal: 29, attention: 3, high: 1, invalid: 0 },
  { date: '20 Sep', normal: 33, attention: 6, high: 0, invalid: 2 },
  { date: '21 Sep', normal: 19, attention: 6, high: 3, invalid: 4 },
];

export const departmentStats = [
  { dept: 'Maintenance',  workers: 38, avgExposure: 22.4, highEvents: 2, color: '#E63946' },
  { dept: 'Operations',   workers: 52, avgExposure: 18.1, highEvents: 1, color: '#590D22' },
  { dept: 'Safety',       workers: 14, avgExposure: 6.2,  highEvents: 0, color: '#10B981' },
  { dept: 'Engineering',  workers: 26, avgExposure: 9.8,  highEvents: 0, color: '#F59E0B' },
  { dept: 'Logistics',    workers: 18, avgExposure: 4.1,  highEvents: 0, color: '#6366F1' },
];
