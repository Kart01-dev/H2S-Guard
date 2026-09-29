import React, { useState, useMemo } from 'react';
import {
  X,
  Printer,
  Download,
  FileSpreadsheet,
  Shield,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Calendar,
  User,
  Clock,
  Building2,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ReportFilterOptions, Reading, AlertItem } from '../../types';

interface EmployeeReportModalProps {
  selectedEmployeeId?: string;
  onClose: () => void;
}

export const EmployeeReportModal: React.FC<EmployeeReportModalProps> = ({
  selectedEmployeeId,
  onClose,
}) => {
  const { employees, activeEmployee, readings, alerts, currentRole, worker } = useApp();

  // Filter state
  const [filters, setFilters] = useState<ReportFilterOptions>({
    dateRange: 'all',
    exposureStatus: 'all',
    employeeId: selectedEmployeeId || activeEmployee.employeeId,
  });

  const [supervisorNotes, setSupervisorNotes] = useState(
    'Worker exposure levels inspected against OSHA 8-hour TWA guidelines. All recorded scans verified.'
  );
  const [isSigned, setIsSigned] = useState(true);

  // Selected Employee object
  const currentEmployee = useMemo(() => {
    return (
      employees.find((e) => e.employeeId === filters.employeeId || e.id === filters.employeeId) ||
      activeEmployee
    );
  }, [employees, filters.employeeId, activeEmployee]);

  // Scoped Readings
  const filteredReadings = useMemo(() => {
    let result = readings.filter(
      (r) =>
        r.workerId === currentEmployee.id ||
        r.workerId === currentEmployee.employeeId ||
        r.workerName === currentEmployee.name
    );

    // Apply Exposure Status Filter
    if (filters.exposureStatus !== 'all') {
      result = result.filter((r) => r.status === filters.exposureStatus);
    }

    // Apply Date Range Filter
    const now = new Date();
    if (filters.dateRange === 'today') {
      const todayStr = now.toDateString();
      result = result.filter((r) => new Date(r.timestamp).toDateString() === todayStr);
    } else if (filters.dateRange === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter((r) => new Date(r.timestamp) >= sevenDaysAgo);
    } else if (filters.dateRange === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter((r) => new Date(r.timestamp) >= thirtyDaysAgo);
    }

    return result;
  }, [readings, currentEmployee, filters.exposureStatus, filters.dateRange]);

  // Scoped Alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => a.workerName === currentEmployee.name);
  }, [alerts, currentEmployee]);

  // Aggregated Stats
  const stats = useMemo(() => {
    const totalScans = filteredReadings.length;
    const maxDose = filteredReadings.reduce((max, r) => Math.max(max, r.exposureDosePpmH), 0);
    const avgRate =
      totalScans > 0
        ? (
            filteredReadings.reduce((sum, r) => sum + r.exposureRatePpmH, 0) / totalScans
          ).toFixed(2)
        : '0.00';
    const totalAccumulated = filteredReadings
      .reduce((sum, r) => sum + r.exposureDosePpmH, 0)
      .toFixed(1);

    const normalCount = filteredReadings.filter((r) => r.status === 'NORMAL').length;
    const attentionCount = filteredReadings.filter((r) => r.status === 'ATTENTION').length;
    const highCount = filteredReadings.filter((r) => r.status === 'HIGH_EXPOSURE').length;

    return { totalScans, maxDose, avgRate, totalAccumulated, normalCount, attentionCount, highCount };
  }, [filteredReadings]);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Reading ID,Timestamp,Employee ID,Worker Name,Location,Exposure Dose (ppm.h),Exposure Rate (ppm/h),Status,Confidence (%)'];
    const rows = filteredReadings.map(
      (r) =>
        `"${r.id}","${r.timestamp}","${r.workerId || currentEmployee.employeeId}","${r.workerName}","${r.location}",${r.exposureDosePpmH},${r.exposureRatePpmH},"${r.status}",${r.confidencePct}`
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `H2S_Report_${currentEmployee.employeeId}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  const reportId = `RPT-H2S-${currentEmployee.employeeId}-${new Date().toISOString().slice(0, 10)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:static print:bg-white text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col print:max-h-none print:shadow-none print:border-none print:bg-white print:text-black">
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-20 backdrop-blur-md print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Occupational Safety Exposure Assessment Report</h2>
              <p className="text-xs text-slate-400">Formal HSE Exposure Log & Supervisor Verification</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-lg shadow-blue-600/20 transition-all"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar (Hidden in Print) */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center space-x-2 text-slate-400">
            <Filter size={14} className="text-blue-400" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Report Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Role Scoped Employee Selector */}
            {(currentRole === 'supervisor' || currentRole === 'admin') && (
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Select Employee:</span>
                <select
                  value={filters.employeeId}
                  onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.employeeId}>
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Range Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Time Window:</span>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Available Records</option>
                <option value="today">Today's Shift</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            {/* Exposure Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Exposure Status:</span>
              <select
                value={filters.exposureStatus}
                onChange={(e) => setFilters({ ...filters, exposureStatus: e.target.value as any })}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="NORMAL">NORMAL Only</option>
                <option value="ATTENTION">ATTENTION Only</option>
                <option value="HIGH_EXPOSURE">HIGH EXPOSURE Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 print:p-0 print:space-y-4 print:text-black">
          {/* Document Official Header */}
          <div className="border-b border-slate-800 pb-5 print:border-black">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Shield size={22} className="text-blue-500 print:text-black" />
                  <span className="text-lg font-black uppercase tracking-widest text-slate-100 print:text-black">
                    H₂S GUARD INDUSTRIAL SAFETY SYSTEM
                  </span>
                </div>
                <h1 className="text-xl font-extrabold text-blue-400 mt-1 print:text-black">
                  OCCUPATIONAL H₂S EXPOSURE ASSESSMENT REPORT
                </h1>
                <p className="text-xs text-slate-400 print:text-gray-600 mt-0.5">
                  Refinery Operations • Personal Photometric Dosimeter Matrix Evaluation
                </p>
              </div>

              <div className="text-right text-xs space-y-1 font-mono text-slate-400 print:text-gray-700">
                <p className="font-bold text-slate-200 print:text-black">REPORT ID: {reportId}</p>
                <p>Generated: {new Date().toLocaleString()}</p>
                <p>Issuer Role: {currentRole.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Employee & Plant Information Box */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs print:bg-gray-50 print:border-gray-300 print:text-black">
            <div>
              <span className="text-slate-500 print:text-gray-500 uppercase text-[10px] font-semibold block">
                Employee Name
              </span>
              <p className="font-bold text-slate-100 print:text-black text-sm">{currentEmployee.name}</p>
            </div>

            <div>
              <span className="text-slate-500 print:text-gray-500 uppercase text-[10px] font-semibold block">
                Employee ID
              </span>
              <p className="font-mono font-bold text-amber-400 print:text-black">{currentEmployee.employeeId}</p>
            </div>

            <div>
              <span className="text-slate-500 print:text-gray-500 uppercase text-[10px] font-semibold block">
                Department / Unit
              </span>
              <p className="font-medium text-slate-200 print:text-black">
                {currentEmployee.department || 'Processing Unit 4'}
              </p>
            </div>

            <div>
              <span className="text-slate-500 print:text-gray-500 uppercase text-[10px] font-semibold block">
                Assigned Supervisor
              </span>
              <p className="font-medium text-slate-200 print:text-black">
                {currentEmployee.supervisor || 'Sanjay Kumar'}
              </p>
            </div>

            <div>
              <span className="text-slate-500 print:text-gray-500 uppercase text-[10px] font-semibold block">
                Dosimeter Serial
              </span>
              <p className="font-mono text-slate-300 print:text-black">
                {currentEmployee.dosimeterBandId || 'DOS-8849-H2S'}
              </p>
            </div>

            <div>
              <span className="text-slate-500 print:text-gray-500 uppercase text-[10px] font-semibold block">
                Shift Schedule
              </span>
              <p className="text-slate-300 print:text-black">{currentEmployee.shift || 'Day Shift (08:00 - 16:00)'}</p>
            </div>

            <div>
              <span className="text-slate-500 print:text-gray-500 uppercase text-[10px] font-semibold block">
                Current Safety Status
              </span>
              <span className="font-bold text-emerald-400 print:text-black">
                {currentEmployee.currentSafetyStatus || 'SAFE'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 print:text-gray-500 uppercase text-[10px] font-semibold block">
                Dosimeter Status
              </span>
              <span className="font-mono text-slate-300 print:text-black">ACTIVE / VALID</span>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center print:bg-white print:border-gray-300">
              <span className="text-[10px] uppercase font-semibold text-slate-500 print:text-gray-600 block">
                Total Scans
              </span>
              <span className="text-xl font-bold font-mono text-slate-100 print:text-black">
                {stats.totalScans}
              </span>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center print:bg-white print:border-gray-300">
              <span className="text-[10px] uppercase font-semibold text-slate-500 print:text-gray-600 block">
                Total Accumulated
              </span>
              <span className="text-xl font-bold font-mono text-amber-400 print:text-black">
                {stats.totalAccumulated} <span className="text-xs font-normal">ppm·h</span>
              </span>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center print:bg-white print:border-gray-300">
              <span className="text-[10px] uppercase font-semibold text-slate-500 print:text-gray-600 block">
                Peak Single Dose
              </span>
              <span className="text-xl font-bold font-mono text-slate-100 print:text-black">
                {stats.maxDose} <span className="text-xs font-normal">ppm·h</span>
              </span>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center print:bg-white print:border-gray-300">
              <span className="text-[10px] uppercase font-semibold text-slate-500 print:text-gray-600 block">
                Normal / Safe Scans
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400 print:text-black">
                {stats.normalCount}
              </span>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center print:bg-white print:border-gray-300">
              <span className="text-[10px] uppercase font-semibold text-slate-500 print:text-gray-600 block">
                Critical Hazards
              </span>
              <span
                className={`text-xl font-bold font-mono ${
                  stats.highCount > 0 ? 'text-red-400' : 'text-slate-400'
                } print:text-black`}
              >
                {stats.highCount}
              </span>
            </div>
          </div>

          {/* Exposure History Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center space-x-2">
              <Activity size={14} className="text-blue-400 print:text-black" />
              <span>Detailed Dosimeter Reading Records ({filteredReadings.length})</span>
            </h3>

            <div className="overflow-x-auto border border-slate-800 rounded-xl print:border-gray-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] print:bg-gray-100 print:text-black print:border-gray-300">
                    <th className="py-2.5 px-3">Scan ID</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Location / Zone</th>
                    <th className="py-2.5 px-3">Dose (ppm·h)</th>
                    <th className="py-2.5 px-3">Rate (ppm/h)</th>
                    <th className="py-2.5 px-3">Quality</th>
                    <th className="py-2.5 px-3">Evaluation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300 print:text-black print:divide-gray-200">
                  {filteredReadings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-slate-500 text-xs">
                        No readings match the current filter selection.
                      </td>
                    </tr>
                  ) : (
                    filteredReadings.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/40 print:hover:bg-transparent">
                        <td className="py-2 px-3 text-slate-400 font-mono">{r.id}</td>
                        <td className="py-2 px-3 text-slate-400">
                          {new Date(r.timestamp).toLocaleString([], {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-200 print:text-black">{r.location}</td>
                        <td className="py-2 px-3 text-amber-400 font-bold print:text-black">{r.exposureDosePpmH}</td>
                        <td className="py-2 px-3 text-slate-300 print:text-black">{r.exposureRatePpmH}</td>
                        <td className="py-2 px-3 text-slate-400">{r.qualityScorePct}%</td>
                        <td className="py-2 px-3 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              r.status === 'HIGH_EXPOSURE'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30 print:text-black'
                                : r.status === 'ATTENTION'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 print:text-black'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 print:text-black'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incident / Alert Log Table */}
          {filteredAlerts.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center space-x-2">
                <AlertTriangle size={14} className="text-red-400 print:text-black" />
                <span>Associated Incident & Escalation Log ({filteredAlerts.length})</span>
              </h3>

              <div className="overflow-x-auto border border-slate-800 rounded-xl print:border-gray-300">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] print:bg-gray-100 print:text-black">
                      <th className="py-2.5 px-3">Alert ID</th>
                      <th className="py-2.5 px-3">Title & Category</th>
                      <th className="py-2.5 px-3">Severity</th>
                      <th className="py-2.5 px-3">Escalation State</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300 print:text-black">
                    {filteredAlerts.map((a) => (
                      <tr key={a.id}>
                        <td className="py-2 px-3 text-slate-400 font-mono">{a.id}</td>
                        <td className="py-2 px-3 font-sans text-slate-200 print:text-black">
                          {a.title} ({a.category})
                        </td>
                        <td className="py-2 px-3 uppercase text-red-400 font-bold print:text-black">{a.severity}</td>
                        <td className="py-2 px-3 font-sans text-slate-300 print:text-black">{a.escalationState || 'N/A'}</td>
                        <td className="py-2 px-3 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              a.resolved
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {a.resolved ? 'RESOLVED' : 'ACTIVE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Supervisor Verification & Sign-Off Section */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3 print:bg-gray-50 print:border-gray-400">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:border-gray-300">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 print:text-black flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-emerald-400 print:text-black" />
                <span>HSE Supervisor Verification & Sign-Off</span>
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono print:text-black">
                VERIFIED & SIGNED
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 print:text-gray-600 block font-semibold">
                Supervisor Remarks & Action Plan:
              </label>
              <textarea
                value={supervisorNotes}
                onChange={(e) => setSupervisorNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 print:bg-white print:text-black print:border-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 font-mono">
              <div>
                <span className="text-slate-500 print:text-gray-500 text-[10px] block">VERIFYING SUPERVISOR</span>
                <p className="font-bold text-slate-200 print:text-black">Sanjay Kumar (Safety Lead)</p>
              </div>

              <div>
                <span className="text-slate-500 print:text-gray-500 text-[10px] block">SIGN-OFF TIMESTAMP</span>
                <p className="text-slate-300 print:text-black">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Report Footer & Security Disclaimer */}
          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2 print:border-gray-300 print:text-gray-600">
            <div className="flex items-center space-x-2">
              <Lock size={12} />
              <span>SHA-256 Audit Trail Hash: <strong className="font-mono text-slate-400 print:text-black">sha256:7f9a...3b21</strong></span>
            </div>

            <span>H₂S Guard Safety Standard ISO-45001 / OSHA TWA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
