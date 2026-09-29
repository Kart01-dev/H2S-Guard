import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Worker, DosimeterBand, Reading, AlertItem, NotificationItem, Toast, NavTab, UserRole, AuditLogEntry } from '../types';
import * as storageService from '../services/storageService';
import { generateAuditHash } from '../utils/cryptoUtils';

interface AppContextType {
  worker: Worker;
  activeEmployee: Worker;
  employees: Worker[];
  scannedEmployee: Worker | null;
  setScannedEmployee: (employee: Worker | null) => void;
  scanEmployeeQR: (qrString: string) => { success: boolean; employee?: Worker; message?: string };
  band: DosimeterBand;
  readings: Reading[];
  alerts: AlertItem[];
  notifications: NotificationItem[];
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  auditLogs: AuditLogEntry[];
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isScannerOpen: boolean;
  openScanner: () => void;
  closeScanner: () => void;
  isNotificationCenterOpen: boolean;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  addReading: (reading: Omit<Reading, 'id' | 'timestamp'>) => Reading;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string, notes?: string) => void;
  simulateSupervisorAcknowledge: (alertId: string) => void;
  simulateEscalationTimeout: (alertId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  recalibrateBand: () => void;
  selectedReading: Reading | null;
  setSelectedReading: (reading: Reading | null) => void;
  selectedAlert: AlertItem | null;
  setSelectedAlert: (alert: AlertItem | null) => void;
  unreadAlertsCount: number;
  unreadNotificationsCount: number;
  latestReading: Reading | null;
  todayReadings: Reading[];
  triggerDemoEvent: (eventId: string) => void;
  recordAuditLog: (action: string, entity: string, result: string) => Promise<void>;
  resetSystemData: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [worker, setWorker] = useState<Worker>(() => storageService.loadWorker());
  const [employees, setEmployees] = useState<Worker[]>(() => storageService.loadEmployees());
  const [scannedEmployee, setScannedEmployee] = useState<Worker | null>(null);
  const [band, setBand] = useState<DosimeterBand>(() => storageService.loadBand());
  const [readings, setReadings] = useState<Reading[]>(() => storageService.loadReadings());
  const [alerts, setAlerts] = useState<AlertItem[]>(() => storageService.loadAlerts());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storageService.loadNotifications());
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => storageService.loadRole());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => storageService.loadAuditLogs());
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('h2s_guard_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('h2s_guard_sidebar_collapsed', String(isSidebarCollapsed));
    } catch (e) {
      console.warn('Failed to save sidebar collapsed state', e);
    }
  }, [isSidebarCollapsed]);

  const toggleSidebarCollapsed = () => setIsSidebarCollapsed((prev) => !prev);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('h2s_guard_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('h2s_guard_dark_mode', String(isDarkMode));
    } catch (e) {
      console.warn('Failed to save dark mode state', e);
    }
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Persistence side effects
  useEffect(() => { storageService.saveWorker(worker); }, [worker]);
  useEffect(() => { storageService.saveEmployees(employees); }, [employees]);
  useEffect(() => { storageService.saveBand(band); }, [band]);
  useEffect(() => { storageService.saveReadings(readings); }, [readings]);
  useEffect(() => { storageService.saveAlerts(alerts); }, [alerts]);
  useEffect(() => { storageService.saveNotifications(notifications); }, [notifications]);
  useEffect(() => { storageService.saveRole(currentRole); }, [currentRole]);
  useEffect(() => { storageService.saveAuditLogs(auditLogs); }, [auditLogs]);

  const recordAuditLog = async (action: string, entity: string, result: string) => {
    const timestamp = new Date().toISOString();
    const userId = worker.employeeId || 'EMP-10492';
    const userName = worker.name || 'Rajesh Sharma';
    const hash = await generateAuditHash(action, entity, userId, timestamp);
    const newEntry: AuditLogEntry = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      timestamp,
      userId,
      userName: `${userName} (${currentRole.toUpperCase()})`,
      action,
      entity,
      result,
      hash,
      ipAddress: '192.168.1.104 (Local Terminal)',
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
    // Navigate to the correct default tab for the new role
    if (role === 'worker') {
      setActiveTab('home');
    } else {
      setActiveTab('dashboard');
    }
    recordAuditLog('ROLE_CHANGE', `Switched view role to ${role}`, 'SUCCESS');
    addToast({
      type: 'info',
      title: 'Role View Changed',
      description: `Active role perspective set to ${role.toUpperCase()}`,
    });
  };

  const openScanner = () => setIsScannerOpen(true);
  const closeScanner = () => setIsScannerOpen(false);

  const openNotificationCenter = () => setIsNotificationCenterOpen(true);
  const closeNotificationCenter = () => setIsNotificationCenterOpen(false);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      description: 'All system notifications marked as read.',
    });
  };

  const scanEmployeeQR = (qrString: string) => {
    const found = employees.find(e => e.qrPayload === qrString || e.employeeId === qrString);
    if (found) {
      setScannedEmployee(found);
      addToast({ type: 'success', title: 'Employee Scan Valid', description: `Profile loaded for ${found.name}` });
      recordAuditLog('SCAN_QR', `Employee ${found.employeeId}`, 'SUCCESS');
      return { success: true, employee: found };
    }
    addToast({ type: 'error', title: 'Invalid QR', description: 'Employee not found in directory.' });
    return { success: false, message: 'Employee not found.' };
  };

  const addReading = (newReadingData: Omit<Reading, 'id' | 'timestamp'>): Reading => {
    const newId = 'rdg_' + Math.floor(100 + Math.random() * 900);
    const now = new Date();
    const nowIso = now.toISOString();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const fullReading: Reading = {
      ...newReadingData,
      id: newId,
      timestamp: nowIso,
    };

    setReadings((prev) => [fullReading, ...prev]);
    recordAuditLog('DOSIMETER_SCAN', `Reading ${newId} (${fullReading.status})`, `${fullReading.exposureDosePpmH} ppm·h`);

    if (fullReading.status !== 'INVALID') {
      setWorker((prev) => ({
        ...prev,
        accumulatedShiftPpmH: parseFloat((prev.accumulatedShiftPpmH + fullReading.exposureDosePpmH).toFixed(1)),
        currentSafetyStatus: fullReading.status === 'HIGH_EXPOSURE' ? 'CRITICAL_EXPOSURE' : fullReading.status === 'ATTENTION' ? 'WARNING' : prev.currentSafetyStatus,
      }));

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === newReadingData.workerId || emp.employeeId === newReadingData.workerId
            ? {
                ...emp,
                accumulatedShiftPpmH: parseFloat((emp.accumulatedShiftPpmH + fullReading.exposureDosePpmH).toFixed(1)),
                currentSafetyStatus: fullReading.status === 'HIGH_EXPOSURE' ? 'CRITICAL_EXPOSURE' : fullReading.status === 'ATTENTION' ? 'WARNING' : emp.currentSafetyStatus,
              }
            : emp
        )
      );

      setBand((prev) => ({
        ...prev,
        totalScans: prev.totalScans + 1,
      }));
    }

    if (fullReading.status === 'HIGH_EXPOSURE') {
      const alertId = 'alt_' + Math.floor(100 + Math.random() * 900);

      const newAlert: AlertItem = {
        id: alertId,
        timestamp: nowIso,
        title: 'High Exposure Alert',
        message: `High exposure reading (${fullReading.exposureDosePpmH} ppm·h) detected at ${fullReading.location}. Supervisor notified.`,
        severity: 'critical',
        category: 'exposure_limit',
        acknowledged: false,
        resolved: false,
        readingId: newId,
        workerName: worker.name,
        location: fullReading.location,
        exposureDosePpmH: fullReading.exposureDosePpmH,
        escalationState: 'supervisor_notified',
        supervisorName: 'Sanjay Kumar (Safety Lead)',
        timeline: [
          { id: 't1', time: timeStr, label: 'Reading detected', subtext: `${fullReading.exposureDosePpmH} ppm·h at ${fullReading.location}`, status: 'completed', iconType: 'detect' },
          { id: 't2', time: timeStr, label: 'Worker notified', subtext: 'In-app safety alert dispatched', status: 'completed', iconType: 'notify' },
          { id: 't3', time: timeStr, label: 'Supervisor notified', subtext: 'Dispatched to Sanjay Kumar (Safety Lead)', status: 'completed', iconType: 'notify' },
          { id: 't4', time: timeStr, label: 'Awaiting Supervisor Acknowledgement', subtext: 'Auto-escalation timer active (5 mins)', status: 'active', iconType: 'ack' },
        ],
      };

      setAlerts((prev) => [newAlert, ...prev]);

      const workerNotif: NotificationItem = {
        id: 'notif_w_' + Math.random().toString(36).substring(2, 7),
        timestamp: nowIso,
        title: '🚨 High Exposure Reading Detected',
        message: `High exposure reading (${fullReading.exposureDosePpmH} ppm·h) recorded. Supervisor has been notified.`,
        recipientRole: 'worker',
        read: false,
        alertId: alertId,
        readingId: newId,
        type: 'incident',
      };

      const supervisorNotif: NotificationItem = {
        id: 'notif_s_' + Math.random().toString(36).substring(2, 7),
        timestamp: nowIso,
        title: 'CRITICAL: Worker Exposure Alert',
        message: `${worker.name} (${worker.employeeId}) registered ${fullReading.exposureDosePpmH} ppm·h at ${fullReading.location}.`,
        recipientRole: 'supervisor',
        read: false,
        alertId: alertId,
        readingId: newId,
        type: 'incident',
      };

      const adminNotif: NotificationItem = {
        id: 'notif_a_' + Math.random().toString(36).substring(2, 7),
        timestamp: nowIso,
        title: 'Plant Safety Audit Log',
        message: `Incident #${alertId} recorded in digital log for ${fullReading.location}.`,
        recipientRole: 'admin',
        read: false,
        alertId: alertId,
        type: 'info',
      };

      setNotifications((prev) => [workerNotif, supervisorNotif, adminNotif, ...prev]);

      addToast({
        type: 'error',
        title: 'HIGH EXPOSURE HAZARD DETECTED',
        description: `Exposure dose: ${fullReading.exposureDosePpmH} ppm·h at ${fullReading.location}`,
      });
    } else if (fullReading.status === 'ATTENTION') {
      const alertId = 'alt_' + Math.floor(100 + Math.random() * 900);
      const newAlert: AlertItem = {
        id: alertId,
        timestamp: nowIso,
        title: 'Attention Required',
        message: `Exposure level (${fullReading.exposureDosePpmH} ppm·h) recorded at ${fullReading.location}. Follow shift exposure limits.`,
        severity: 'warning',
        category: 'exposure_limit',
        acknowledged: false,
        resolved: false,
        readingId: newId,
        workerName: worker.name,
        location: fullReading.location,
        exposureDosePpmH: fullReading.exposureDosePpmH,
        escalationState: 'supervisor_acknowledged',
      };

      setAlerts((prev) => [newAlert, ...prev]);

      addToast({
        type: 'warning',
        title: 'ATTENTION LEVEL EXPOSURE',
        description: `Exposure dose: ${fullReading.exposureDosePpmH} ppm·h recorded`,
      });
    } else if (fullReading.status === 'NORMAL') {
      addToast({
        type: 'success',
        title: 'Dosimeter Reading Saved',
        description: `Status: NORMAL (${fullReading.exposureDosePpmH} ppm·h)`,
      });
    } else {
      const alertId = 'alt_' + Math.floor(100 + Math.random() * 900);
      const newAlert: AlertItem = {
        id: alertId,
        timestamp: nowIso,
        title: 'Invalid Reading',
        message: 'Scan could not be validated due to glare/optical check failure. Please rescan.',
        severity: 'info',
        category: 'quality',
        acknowledged: false,
        resolved: false,
        readingId: newId,
        workerName: worker.name,
        location: fullReading.location,
      };

      setAlerts((prev) => [newAlert, ...prev]);

      addToast({
        type: 'info',
        title: 'Scan Saved as Invalid',
        description: 'Quality check failed during colorimetric assessment.',
      });
    }

    return fullReading;
  };

  const acknowledgeAlert = (alertId: string) => {
    simulateSupervisorAcknowledge(alertId);
  };

  const resolveAlert = (alertId: string, notes?: string) => {
    const nowIso = new Date().toISOString();
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        return {
          ...a,
          acknowledged: true,
          resolved: true,
          resolvedAt: nowIso,
          resolvedBy: `${worker.name} (${currentRole.toUpperCase()})`,
          resolutionNotes: notes || 'Incident resolved and cleared by supervisor.',
        };
      })
    );
    recordAuditLog('ALERT_RESOLVE', `Alert ${alertId}`, 'RESOLVED');
    addToast({
      type: 'success',
      title: 'Incident Resolved',
      description: `Alert #${alertId} marked as resolved and closed.`,
    });
  };

  const simulateSupervisorAcknowledge = (alertId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const nowIso = new Date().toISOString();

    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        const updatedTimeline = [
          ...(a.timeline || []),
          {
            id: 'tl_ack_' + Math.random().toString(36).substring(2, 6),
            time: timeStr,
            label: 'Supervisor Acknowledged',
            subtext: `Signed off by ${a.supervisorName || 'Sanjay Kumar (Safety Lead)'}`,
            status: 'completed' as const,
            iconType: 'ack' as const,
          },
        ];

        return {
          ...a,
          acknowledged: true,
          escalationState: 'supervisor_acknowledged',
          acknowledgedAt: nowIso,
          timeline: updatedTimeline,
        };
      })
    );
    recordAuditLog('ALERT_ACKNOWLEDGE', `Alert ${alertId}`, 'ACKNOWLEDGED');

    addToast({
      type: 'success',
      title: 'Alert Acknowledged',
      description: 'Alert acknowledged by Safety Supervisor Sanjay Kumar.',
    });
  };

  const simulateEscalationTimeout = (alertId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const nowIso = new Date().toISOString();

    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        const updatedTimeline = [
          ...(a.timeline || []),
          {
            id: 'tl_esc_' + Math.random().toString(36).substring(2, 6),
            time: timeStr,
            label: 'No acknowledgement (5m timeout)',
            subtext: 'Escalated to Expert Safety Team & Site Commander',
            status: 'completed' as const,
            iconType: 'escalate' as const,
          },
        ];

        return {
          ...a,
          escalationState: 'escalated_to_expert',
          escalatedAt: nowIso,
          timeline: updatedTimeline,
        };
      })
    );

    setNotifications((prev) => [
      {
        id: 'notif_esc_' + Math.random().toString(36).substring(2, 6),
        timestamp: nowIso,
        title: '⚠️ ALERT ESCALATED TO EXPERT TEAM',
        message: `Incident #${alertId} escalated to Expert Safety Team due to supervisor timeout.`,
        recipientRole: 'worker',
        read: false,
        alertId: alertId,
        type: 'incident',
      },
      ...prev,
    ]);
    recordAuditLog('ALERT_ESCALATE', `Alert ${alertId}`, 'AUTO_ESCALATED');

    addToast({
      type: 'error',
      title: 'INCIDENT ESCALATED',
      description: 'Alert escalated to Expert Safety Team due to 5-min supervisor timeout.',
    });
  };

  const recalibrateBand = () => {
    setBand((prev) => ({
      ...prev,
      calibrationDueDate: '2026-12-31',
      opticalIntegrityPct: 100.0,
      status: 'active',
    }));
    recordAuditLog('BAND_RECALIBRATE', `Band ${band.serialNumber}`, 'RECALIBRATED_100%');
    addToast({
      type: 'success',
      title: 'Dosimeter Recalibrated',
      description: `Zero-point optical matrix reset for ${band.serialNumber}.`,
    });
  };

  const resetSystemData = () => {
    storageService.resetToDefaults();
    setWorker(storageService.loadWorker());
    setBand(storageService.loadBand());
    setReadings(storageService.loadReadings());
    setAlerts(storageService.loadAlerts());
    setNotifications(storageService.loadNotifications());
    setCurrentRoleState(storageService.loadRole());
    setAuditLogs([]);
    addToast({
      type: 'info',
      title: 'System Reset',
      description: 'Restored initial state and cleared custom local storage.',
    });
  };

  const unreadAlertsCount = alerts.filter((a) => !a.acknowledged).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const latestReading = readings.length > 0 ? readings[0] : null;

  const todayReadings = readings.filter((r) => {
    const rdgDate = new Date(r.timestamp).toDateString();
    const todayDate = new Date().toDateString();
    return rdgDate === todayDate || r.id === 'rdg_901';
  });

  const triggerDemoEvent = (eventId: string) => {
    switch (eventId) {
      case 'demo_normal':
        addReading({
          workerId: worker.id,
          workerName: worker.name,
          bandId: band.serialNumber,
          exposureDosePpmH: 18.4,
          status: 'NORMAL',
          confidencePct: 94,
          shiftDurationMinutes: 492,
          exposureRatePpmH: 2.24,
          location: 'Plant Area A - Reactor Deck 2',
          colorShiftHex: '#8B6B4F',
          baselineColorHex: '#FAF4ED',
          qualityScorePct: 98,
          deltaE: 12.4,
          rawRgb: { r: 139, g: 107, b: 79 },
        });
        break;

      case 'demo_attention':
        addReading({
          workerId: worker.id,
          workerName: worker.name,
          bandId: band.serialNumber,
          exposureDosePpmH: 26.1,
          status: 'ATTENTION',
          confidencePct: 91,
          shiftDurationMinutes: 390,
          exposureRatePpmH: 4.01,
          location: 'Plant Area C - Reformer Unit',
          colorShiftHex: '#6E4226',
          baselineColorHex: '#FAF4ED',
          qualityScorePct: 94,
          deltaE: 24.8,
          rawRgb: { r: 110, g: 66, b: 38 },
        });
        break;

      case 'demo_high':
        addReading({
          workerId: worker.id,
          workerName: worker.name,
          bandId: band.serialNumber,
          exposureDosePpmH: 42.8,
          status: 'HIGH_EXPOSURE',
          confidencePct: 96,
          shiftDurationMinutes: 420,
          exposureRatePpmH: 6.11,
          location: 'Plant Area B - Desulfurization Cell',
          colorShiftHex: '#3D1E12',
          baselineColorHex: '#FAF4ED',
          qualityScorePct: 99,
          deltaE: 48.2,
          rawRgb: { r: 61, g: 30, b: 18 },
        });
        break;

      case 'demo_invalid':
        addReading({
          workerId: worker.id,
          workerName: worker.name,
          bandId: band.serialNumber,
          exposureDosePpmH: 0,
          status: 'INVALID',
          confidencePct: 42,
          shiftDurationMinutes: 0,
          exposureRatePpmH: 0,
          location: 'Plant Area A - Maintenance Bay',
          colorShiftHex: '#C5B5A1',
          baselineColorHex: '#FAF4ED',
          qualityScorePct: 42,
          deltaE: 2.1,
          rawRgb: { r: 197, g: 181, b: 161 },
        });
        break;

      case 'demo_escalate':
        if (alerts.length > 0) {
          const target = alerts.find((a) => !a.acknowledged) || alerts[0];
          simulateEscalationTimeout(target.id);
        } else {
          addToast({
            type: 'info',
            title: 'No Alerts to Escalate',
            description: 'Trigger a High Exposure reading first.',
          });
        }
        break;

      case 'demo_recalibrate':
        recalibrateBand();
        break;

      case 'demo_clear':
        resetSystemData();
        break;

      default:
        break;
    }
  };

  return (
    <AppContext.Provider
      value={{
        worker,
        activeEmployee: worker,
        employees,
        scannedEmployee,
        setScannedEmployee,
        scanEmployeeQR,
        band,
        readings,
        alerts,
        notifications,
        currentRole,
        setRole,
        auditLogs,
        activeTab,
        setActiveTab,
        isScannerOpen,
        openScanner,
        closeScanner,
        isNotificationCenterOpen,
        openNotificationCenter,
        closeNotificationCenter,
        addReading,
        acknowledgeAlert,
        resolveAlert,
        simulateSupervisorAcknowledge,
        simulateEscalationTimeout,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toasts,
        addToast,
        removeToast,
        recalibrateBand,
        selectedReading,
        setSelectedReading,
        selectedAlert,
        setSelectedAlert,
        unreadAlertsCount,
        unreadNotificationsCount,
        latestReading,
        todayReadings,
        triggerDemoEvent,
        recordAuditLog,
        resetSystemData,
        isSidebarCollapsed,
        toggleSidebarCollapsed,
        isMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
