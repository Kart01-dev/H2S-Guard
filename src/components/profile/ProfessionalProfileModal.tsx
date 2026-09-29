import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Activity,
  AlertTriangle,
  FileText,
  Clock,
  Radio,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';
import type { Worker } from '../../types';
import { useApp } from '../../context/AppContext';
import { QRCodeView } from '../common/QRCodeView';
import { EmployeeReportModal } from '../reports/EmployeeReportModal';

interface ProfessionalProfileModalProps {
  employee: Worker | null;
  onClose: () => void;
}

export const ProfessionalProfileModal: React.FC<ProfessionalProfileModalProps> = ({
  employee,
  onClose,
}) => {
  const { readings, alerts, currentRole } = useApp();
  const [isReportOpen, setIsReportOpen] = useState(false);

  if (!employee) return null;

  // Filter readings and alerts strictly for this employee
  const employeeReadings = readings.filter(
    (r) => r.workerId === employee.id || r.workerId === employee.employeeId || r.workerName === employee.name
  );

  const employeeAlerts = alerts.filter(
    (a) => a.workerName === employee.name
  );

  const highestReading = employeeReadings.reduce(
    (max, r) => (r.exposureDosePpmH > max ? r.exposureDosePpmH : max),
    0
  );

  const getStatusBadge = () => {
    switch (employee.currentSafetyStatus) {
      case 'CRITICAL_EXPOSURE':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full font-semibold text-xs flex items-center space-x-1">
            <AlertTriangle size={14} className="mr-1 animate-pulse" />
            CRITICAL EXPOSURE
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-semibold text-xs flex items-center space-x-1">
            <AlertTriangle size={14} className="mr-1" />
            ATTENTION REQUIRED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-semibold text-xs flex items-center space-x-1">
            <CheckCircle2 size={14} className="mr-1" />
            SAFE / NORMAL
          </span>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
          {/* Header Bar */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl">
                <User size={24} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-slate-100">{employee.name}</h2>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs font-mono rounded">
                    {employee.employeeId}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {employee.designation || 'Shift Operations Officer'} • {employee.department || 'Refinery Unit A'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge()}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* Top Grid: Profile & QR Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Overview Details */}
              <div className="md:col-span-2 bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                  <Shield size={16} className="text-blue-400" />
                  <span>Employee Identity & Placement</span>
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <Building2 size={13} />
                      <span>Department</span>
                    </span>
                    <p className="font-medium text-slate-200">{employee.department || 'Processing Unit 4'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <UserCheck size={13} />
                      <span>Supervisor</span>
                    </span>
                    <p className="font-medium text-slate-200">{employee.supervisor || 'Sanjay Kumar'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <Clock size={13} />
                      <span>Shift Routine</span>
                    </span>
                    <p className="font-medium text-slate-200">{employee.shift || 'Day Shift (08:00 - 16:00)'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <Radio size={13} />
                      <span>Assigned Dosimeter</span>
                    </span>
                    <p className="font-medium text-amber-400 font-mono">
                      {employee.dosimeterBandId || 'DOS-8849-H2S'}
                    </p>
                  </div>

                  {employee.contactInfo && (
                    <>
                      <div className="space-y-1">
                        <span className="text-slate-500 flex items-center space-x-1">
                          <Phone size={13} />
                          <span>Phone / Contact</span>
                        </span>
                        <p className="font-medium text-slate-300 font-mono">{employee.contactInfo.phone}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-500 flex items-center space-x-1">
                          <Mail size={13} />
                          <span>Emergency Contact</span>
                        </span>
                        <p className="font-medium text-slate-300">{employee.contactInfo.emergency}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Dosimeter Expiry & Calibration status */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Calendar size={14} className="text-slate-500" />
                    <span>Dosimeter Expiry:</span>
                    <span className="text-slate-200 font-mono">
                      {employee.dosimeterExpiry || '2026-12-31'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono text-[10px]">
                    STATUS: ACTIVE
                  </span>
                </div>
              </div>

              {/* QR Identity Badge */}
              <div className="flex flex-col items-center justify-center">
                <QRCodeView
                  value={employee.qrPayload || employee.employeeId}
                  label="Employee QR Badge"
                  size={160}
                  showDetails={true}
                />
              </div>
            </div>

            {/* Metrics Dashboard Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider block mb-1">
                  Shift Exposure Dose
                </span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold font-mono text-amber-400">
                    {employee.accumulatedShiftPpmH || 0}
                  </span>
                  <span className="text-xs text-slate-400">ppm·h</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Limit: 50.0 ppm·h</span>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider block mb-1">
                  Peak Reading
                </span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold font-mono text-slate-100">
                    {highestReading.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400">ppm·h</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Shift Peak</span>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider block mb-1">
                  Recorded Scans
                </span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold font-mono text-blue-400">
                    {employeeReadings.length}
                  </span>
                  <span className="text-xs text-slate-400">scans</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Total Directory Scans</span>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider block mb-1">
                  Safety Alerts
                </span>
                <div className="flex items-baseline space-x-1">
                  <span
                    className={`text-2xl font-bold font-mono ${
                      employeeAlerts.length > 0 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {employeeAlerts.length}
                  </span>
                  <span className="text-xs text-slate-400">incidents</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Incident History</span>
              </div>
            </div>

            {/* Scoped Recent Readings */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <Activity size={16} className="text-amber-400" />
                  <span>Scoped Dosimeter Reading History</span>
                </h3>
                <span className="text-xs text-slate-500">Showing last {employeeReadings.length} entries</span>
              </div>

              {employeeReadings.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No dosimeter scans recorded for this employee yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">Dose (ppm·h)</th>
                        <th className="py-2.5 px-3">Rate (ppm/h)</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                      {employeeReadings.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 text-slate-400">
                            {new Date(r.timestamp).toLocaleString([], {
                              month: 'short',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-200">{r.location}</td>
                          <td className="py-2.5 px-3 text-amber-400 font-bold">{r.exposureDosePpmH}</td>
                          <td className="py-2.5 px-3 text-slate-300">{r.exposureRatePpmH}</td>
                          <td className="py-2.5 px-3 font-sans">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                r.status === 'HIGH_EXPOSURE'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : r.status === 'ATTENTION'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar with Actions */}
          <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between sticky bottom-0 z-10 backdrop-blur-md">
            <div className="text-xs text-slate-500 flex items-center space-x-2">
              <Shield size={14} className="text-slate-600" />
              <span>Role Access Mode: <strong className="text-slate-300 uppercase">{currentRole}</strong></span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsReportOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center space-x-2 transition-all"
              >
                <FileText size={16} />
                <span>Generate Occupational Report</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Modal: Occupational Exposure Report */}
      {isReportOpen && (
        <EmployeeReportModal
          selectedEmployeeId={employee.employeeId}
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </>
  );
};
