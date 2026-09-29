import type { Worker, DosimeterBand, Reading, AlertItem, NotificationItem, UserRole, AuditLogEntry } from '../types';
import { initialWorker, initialBand, initialReadings, initialAlerts, initialNotifications, initialEmployees } from '../data/mockData';

const KEYS = {
  READINGS: 'h2s_guard_readings',
  ALERTS: 'h2s_guard_alerts',
  NOTIFICATIONS: 'h2s_guard_notifications',
  WORKER: 'h2s_guard_worker',
  BAND: 'h2s_guard_band',
  AUDIT_LOGS: 'h2s_guard_audit_logs',
  ROLE: 'h2s_guard_role',
  EMPLOYEES: 'h2s_guard_employees'
};

const memoryStore: Record<string, string> = {};

export function loadState<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data) as T;
    } else if (memoryStore[key]) {
      return JSON.parse(memoryStore[key]) as T;
    }
  } catch (error) {
    console.error(`Error loading state for key ${key}:`, error);
  }
  return fallback;
}

export function saveState<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, serialized);
    } else {
      memoryStore[key] = serialized;
    }
  } catch (error) {
    console.error(`Error saving state for key ${key}:`, error);
  }
}

export function loadReadings(): Reading[] {
  return loadState<Reading[]>(KEYS.READINGS, initialReadings);
}

export function saveReadings(readings: Reading[]): void {
  saveState(KEYS.READINGS, readings);
}

export function loadAlerts(): AlertItem[] {
  return loadState<AlertItem[]>(KEYS.ALERTS, initialAlerts);
}

export function saveAlerts(alerts: AlertItem[]): void {
  saveState(KEYS.ALERTS, alerts);
}

export function loadNotifications(): NotificationItem[] {
  return loadState<NotificationItem[]>(KEYS.NOTIFICATIONS, initialNotifications);
}

export function saveNotifications(notifs: NotificationItem[]): void {
  saveState(KEYS.NOTIFICATIONS, notifs);
}

export function loadWorker(): Worker {
  return loadState<Worker>(KEYS.WORKER, initialWorker);
}

export function saveWorker(worker: Worker): void {
  saveState(KEYS.WORKER, worker);
}

export function loadEmployees(): Worker[] {
  return loadState<Worker[]>(KEYS.EMPLOYEES, initialEmployees);
}

export function saveEmployees(employees: Worker[]): void {
  saveState(KEYS.EMPLOYEES, employees);
}

export function loadBand(): DosimeterBand {
  return loadState<DosimeterBand>(KEYS.BAND, initialBand);
}

export function saveBand(band: DosimeterBand): void {
  saveState(KEYS.BAND, band);
}

export function loadAuditLogs(): AuditLogEntry[] {
  return loadState<AuditLogEntry[]>(KEYS.AUDIT_LOGS, []);
}

export function saveAuditLogs(logs: AuditLogEntry[]): void {
  saveState(KEYS.AUDIT_LOGS, logs);
}

export function addAuditLog(log: AuditLogEntry): void {
  const logs = loadAuditLogs();
  logs.push(log);
  saveAuditLogs(logs);
}

export function loadRole(): UserRole {
  return loadState<UserRole>(KEYS.ROLE, 'worker');
}

export function saveRole(role: UserRole): void {
  saveState(KEYS.ROLE, role);
}

export function clearAllData(): void {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}

export function resetToDefaults(): void {
  clearAllData();
  saveReadings(initialReadings);
  saveAlerts(initialAlerts);
  saveNotifications(initialNotifications);
  saveWorker(initialWorker);
  saveEmployees(initialEmployees);
  saveBand(initialBand);
  saveRole('worker');
  saveAuditLogs([]);
}
