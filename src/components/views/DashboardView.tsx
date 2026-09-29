import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Activity,
  ShieldAlert,
  Flame,
  TrendingUp,
  FileText,
  Package,
  Cpu,
  Lock,
  Sliders,
  Search,
  Bell,
  Radio,
  Download,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  QrCode,
  ScanLine,
  ClipboardList,
} from 'lucide-react';

import { OverviewSection } from '../admin/OverviewSection';
import { WorkersSection } from '../admin/WorkersSection';
import { DosimetersSection } from '../admin/DosimetersSection';
import { ReadingsSection } from '../admin/ReadingsSection';
import { IncidentsSection } from '../admin/IncidentsSection';
import { AnalyticsSection } from '../admin/AnalyticsSection';
import { ReportsSection } from '../admin/ReportsSection';
import { BatchesSection } from '../admin/BatchesSection';
import { AICalibrationSection } from '../admin/AICalibrationSection';
import { AuditLogsSection } from '../admin/AuditLogsSection';
import { SettingsSection } from '../admin/SettingsSection';
import { AlertEngineSection } from '../admin/AlertEngineSection';
import { ProfessionalProfileModal } from '../profile/ProfessionalProfileModal';
import { EmployeeReportModal } from '../reports/EmployeeReportModal';

export const DashboardView: React.FC = () => {
  const { addToast, currentRole, employees, scannedEmployee, setScannedEmployee, scanEmployeeQR } = useApp();
  const [adminTab, setAdminTab] = useState<string>('overview');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTeamReportOpen, setIsTeamReportOpen] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [isQrScanOpen, setIsQrScanOpen] = useState(false);

  const handleQrScan = () => {
    if (!qrInput.trim()) {
      addToast({ type: 'error', title: 'Empty Input', description: 'Please enter or scan an Employee ID.' });
      return;
    }
    const result = scanEmployeeQR(qrInput.trim());
    if (result.success && result.employee) {
      setIsQrScanOpen(false);
      setQrInput('');
      setIsProfileModalOpen(true);
    }
  };

  const handleSelectEmployee = (empId: string) => {
    scanEmployeeQR(empId);
    setIsProfileModalOpen(true);
  };

  /* ── All possible internal navigation items ── */
  const allNavItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['supervisor', 'admin'] },
    { id: 'workers', label: 'Workers', icon: <Users className="w-4 h-4" />, roles: ['supervisor', 'admin'] },
    { id: 'dosimeters', label: 'Dosimeters', icon: <ShieldCheck className="w-4 h-4" />, roles: ['admin'] },
    { id: 'readings', label: 'Readings', icon: <Activity className="w-4 h-4" />, roles: ['supervisor', 'admin'] },
    { id: 'alerts', label: 'Alerts', icon: <ShieldAlert className="w-4 h-4" />, badge: 3, roles: ['supervisor', 'admin'] },
    { id: 'incidents', label: 'Incidents', icon: <Flame className="w-4 h-4 text-[#E63946]" />, badge: 2, roles: ['supervisor', 'admin'] },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" />, roles: ['admin'] },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" />, roles: ['supervisor', 'admin'] },
    { id: 'batches', label: 'Batches', icon: <Package className="w-4 h-4" />, roles: ['admin'] },
    { id: 'calibration', label: 'AI & Calibration', icon: <Cpu className="w-4 h-4" />, roles: ['admin'] },
    { id: 'alert_engine', label: 'Alert Engine', icon: <Bell className="w-4 h-4" />, roles: ['admin'] },
    { id: 'audit', label: 'Audit Logs', icon: <Lock className="w-4 h-4" />, roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4" />, roles: ['admin'] },
  ];

  /* Filter navigation items based on current role */
  const navItems = allNavItems.filter((item) => item.roles.includes(currentRole));

  const handleOpenIncident = (incId: string) => {
    setSelectedIncidentId(incId);
    setAdminTab('incidents');
  };

  const renderContent = () => {
    switch (adminTab) {
      case 'overview':
        return (
          <OverviewSection
            onNavigateTab={(tab) => setAdminTab(tab)}
            onOpenIncidentModal={handleOpenIncident}
            addToast={addToast}
          />
        );
      case 'workers':
        return <WorkersSection addToast={addToast} />;
      case 'dosimeters':
        return <DosimetersSection addToast={addToast} />;
      case 'readings':
        return <ReadingsSection addToast={addToast} />;
      case 'alerts':
      case 'incidents':
        return <IncidentsSection selectedIncidentId={selectedIncidentId} addToast={addToast} />;
      case 'analytics':
        return <AnalyticsSection addToast={addToast} />;
      case 'reports':
        return <ReportsSection addToast={addToast} />;
      case 'batches':
        return <BatchesSection addToast={addToast} />;
      case 'calibration':
        return <AICalibrationSection addToast={addToast} />;
      case 'alert_engine':
        return <AlertEngineSection addToast={addToast} />;
      case 'audit':
        return <AuditLogsSection addToast={addToast} />;
      case 'settings':
        return <SettingsSection addToast={addToast} />;
      default:
        return (
          <OverviewSection
            onNavigateTab={(tab) => setAdminTab(tab)}
            onOpenIncidentModal={handleOpenIncident}
            addToast={addToast}
          />
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-6rem)] animate-fadeIn">
      {/* Internal Admin Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-white rounded-2xl border border-stone-200 p-4 shadow-sm shrink-0 self-start space-y-4">
        {/* Title */}
        <div className="flex items-center gap-3 px-2 pb-3 border-b border-stone-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E63946] to-[#590D22] text-white flex items-center justify-center shadow-md shadow-[#E63946]/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#1C1917] tracking-tight">
              {currentRole === 'supervisor' ? (
                <>Supervisor <span className="text-[#E63946]">Monitor</span></>
              ) : (
                <>Safety <span className="text-[#E63946]">Command</span></>
              )}
            </h3>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              {currentRole === 'supervisor' ? 'Team Safety Lead' : 'System Administrator'}
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#590D22] text-white shadow-md shadow-[#590D22]/15'
                    : 'text-stone-600 hover:text-[#1C1917] hover:bg-[#FAF4ED]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-[#E63946]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      isActive ? 'bg-[#E63946] text-white' : 'bg-[#E63946] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Quick Actions: QR Scan & Team Reports ── */}
        <div className="pt-3 mt-2 border-t border-stone-100 space-y-2">
          <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest px-2">Quick Actions</p>

          <button
            onClick={() => setIsQrScanOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#590D22] to-[#E63946] text-white shadow-md shadow-[#E63946]/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Employee QR</span>
          </button>

          <button
            onClick={() => setIsTeamReportOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#FAF4ED] text-[#590D22] border border-[#590D22]/15 hover:bg-[#F5E6D8] transition-all cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Team Occupational Reports</span>
          </button>
        </div>

        {/* Live System Status Pill */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-bold text-emerald-900 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Connected</span>
          </div>
          <p className="text-[10px] text-emerald-700 font-mono font-normal">
            {employees.length} employees registered • 148 wristbands paired
          </p>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Admin Top Header Bar (Requested: Search, Notifications, Admin Profile) */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Global Search (Workers, Bands, Incidents, Reports)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-[#FAF4ED] border border-[#590D22]/10 rounded-xl text-[#1C1917] focus:outline-none focus:border-[#E63946]"
            />
          </div>

          {/* Admin Profile & Notifications */}
          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <button
              onClick={() => {
                addToast({
                  type: 'warning',
                  title: '2 High Risk Alerts Pending',
                  description: 'Worker Vikram Singh exceeds 40 ppm·h dosage limit.',
                });
              }}
              className="relative p-2 bg-[#FAF4ED] hover:bg-[#F5E6D8] border border-[#590D22]/10 rounded-xl text-[#590D22] cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E63946] text-white text-[10px] font-extrabold flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
              <div className="w-8 h-8 rounded-xl bg-[#590D22] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                SK
              </div>
              <div className="text-left">
                <h4 className="text-xs font-extrabold text-[#1C1917]">Sanjay Kumar</h4>
                <p className="text-[10px] font-bold text-stone-400">Chief Safety Officer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Section View */}
        {renderContent()}
      </div>

      {/* ── QR Scan Overlay ── */}
      {isQrScanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-md p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-[#590D22] to-[#E63946] text-white rounded-xl">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1C1917]">Scan Employee QR Code</h3>
                  <p className="text-xs text-stone-500">Enter Employee ID or scan QR payload</p>
                </div>
              </div>
              <button onClick={() => { setIsQrScanOpen(false); setQrInput(''); }} className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQrScan()}
                placeholder="e.g. EMP-184 or scan QR payload..."
                className="w-full px-4 py-3 text-sm font-mono bg-[#FAF4ED] border border-[#590D22]/15 rounded-2xl text-[#1C1917] focus:outline-none focus:border-[#E63946] placeholder:text-stone-400"
                autoFocus
              />
              <button
                onClick={handleQrScan}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#590D22] to-[#E63946] text-white font-bold text-sm shadow-md shadow-[#E63946]/20 hover:shadow-lg transition-all cursor-pointer"
              >
                Look Up Employee Profile
              </button>
            </div>

            {/* Quick-select Employee Directory */}
            <div className="border-t border-stone-100 pt-4 space-y-2">
              <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Employee Directory</p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {employees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => { setIsQrScanOpen(false); handleSelectEmployee(emp.employeeId); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FAF4ED] transition-colors text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#590D22] to-[#E63946] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1C1917] truncate">{emp.name}</p>
                      <p className="text-[10px] font-mono text-stone-400">{emp.employeeId} • {emp.department || 'Operations'}</p>
                    </div>
                    <QrCode className="w-4 h-4 text-stone-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Professional Profile Modal ── */}
      {isProfileModalOpen && scannedEmployee && (
        <ProfessionalProfileModal
          employee={scannedEmployee}
          onClose={() => { setIsProfileModalOpen(false); setScannedEmployee(null); }}
        />
      )}

      {/* ── Team Occupational Report Modal ── */}
      {isTeamReportOpen && (
        <EmployeeReportModal onClose={() => setIsTeamReportOpen(false)} />
      )}
    </div>
  );
};
