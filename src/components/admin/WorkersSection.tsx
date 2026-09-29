import React, { useState } from 'react';
import { Search, Filter, Shield, UserCheck, RefreshCw, AlertCircle, Plus, ChevronRight } from 'lucide-react';
import { adminWorkers, AdminWorker } from '../../data/adminMockData';

interface WorkersSectionProps {
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const WorkersSection: React.FC<WorkersSectionProps> = ({ addToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedWorker, setSelectedWorker] = useState<AdminWorker | null>(null);

  const departments = ['ALL', 'Maintenance', 'Operations', 'Safety', 'Engineering'];

  const filteredWorkers = adminWorkers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.bandId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || w.department === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || w.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleReassignBand = (worker: AdminWorker) => {
    addToast({
      type: 'success',
      title: `Dosimeter Re-assigned for ${worker.name}`,
      description: `New active dosimeter wristband (H2S-IND-PN-000400) paired to ${worker.employeeId}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Worker Fleet & Dosimeter Assignment
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage field technicians, active wristband telemetry pairings, and SCBA authorization states.
          </p>
        </div>

        <button
          onClick={() => {
            addToast({
              type: 'info',
              title: 'Add Worker Profile',
              description: 'Opened employee onboarding dialog.',
            });
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#590D22] hover:bg-[#400918] rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Onboard New Worker
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by worker name, EMP ID or Band ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-[#FAF4ED] border border-[#590D22]/10 rounded-xl text-[#1C1917] focus:outline-none focus:border-[#E63946]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-[#FAF4ED] border border-[#590D22]/10 rounded-xl px-3 py-1.5 text-xs font-bold text-[#1C1917] focus:outline-none"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#FAF4ED] border border-[#590D22]/10 rounded-xl px-3 py-1.5 text-xs font-bold text-[#1C1917] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NORMAL">Normal</option>
              <option value="ATTENTION">Attention</option>
              <option value="HIGH_EXPOSURE">High Exposure</option>
              <option value="INVALID">Invalid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF4ED] border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Worker Info</th>
                <th className="py-3.5 px-4">Department & Role</th>
                <th className="py-3.5 px-4">Assigned Dosimeter</th>
                <th className="py-3.5 px-4">Latest Exposure</th>
                <th className="py-3.5 px-4">Shift State</th>
                <th className="py-3.5 px-4">Last Scan</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredWorkers.map((w) => {
                const isHigh = w.status === 'HIGH_EXPOSURE';
                const isAttn = w.status === 'ATTENTION';

                return (
                  <tr key={w.id} className="hover:bg-[#FAF4ED]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-[#1C1917] text-sm">{w.name}</div>
                      <div className="font-mono text-[11px] text-stone-500 font-semibold">{w.employeeId}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1C1917]">{w.department}</div>
                      <div className="text-stone-500 text-[11px]">{w.role}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#590D22] bg-[#FAF4ED] px-2.5 py-1 rounded-lg border border-[#590D22]/10">
                        {w.bandId}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[#1C1917]">
                          {w.latestExposure} ppm·h
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                            isHigh
                              ? 'bg-red-600 text-white animate-pulse'
                              : isAttn
                              ? 'bg-amber-500 text-white'
                              : w.status === 'INVALID'
                              ? 'bg-stone-300 text-stone-700'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {w.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize bg-stone-100 text-stone-700">
                        <span className={`w-1.5 h-1.5 rounded-full ${w.shiftStatus === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {w.shiftStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-stone-500 text-[11px]">
                      {new Date(w.lastScan).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleReassignBand(w)}
                          title="Re-assign Dosimeter"
                          className="p-1.5 text-stone-600 hover:text-[#E63946] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedWorker(w)}
                          className="px-2.5 py-1 text-xs font-bold text-[#590D22] bg-[#FAF4ED] hover:bg-[#F5E6D8] rounded-lg transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Details Drawer / Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 space-y-5 border border-stone-200 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-[#1C1917]">{selectedWorker.name}</h3>
                <p className="text-xs text-stone-500">{selectedWorker.employeeId} • {selectedWorker.department}</p>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="text-stone-400 hover:text-stone-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF4ED] rounded-xl border border-[#590D22]/10 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Assigned Dosimeter Wristband</span>
                <div className="font-mono font-bold text-sm text-[#590D22]">{selectedWorker.bandId}</div>
                <p className="text-[11px] text-stone-500">Optical chrominance sensor paired & calibrated for morning shift.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Role Title</span>
                  <span className="font-bold text-[#1C1917]">{selectedWorker.role}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Total Lifetime Scans</span>
                  <span className="font-bold text-[#1C1917] font-mono">{selectedWorker.totalReadings} scans</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-600">SCBA Evacuation Authorization:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
                    APPROVED
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-600">Medical Fit Test Expiry:</span>
                  <span className="font-mono text-stone-700 font-semibold">14 Nov 2027</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => {
                  handleReassignBand(selectedWorker);
                  setSelectedWorker(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#E63946] hover:bg-[#D62828] rounded-xl cursor-pointer"
              >
                Issue Replacement Band
              </button>
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-4 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
