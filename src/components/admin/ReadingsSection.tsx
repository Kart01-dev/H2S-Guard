import React, { useState } from 'react';
import { Search, Download, Filter, Eye, CheckCircle2, AlertTriangle, Flame, ShieldAlert } from 'lucide-react';
import { adminReadings, AdminReading } from '../../data/adminMockData';

interface ReadingsSectionProps {
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const ReadingsSection: React.FC<ReadingsSectionProps> = ({ addToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReading, setSelectedReading] = useState<AdminReading | null>(null);

  const filtered = adminReadings.filter((r) => {
    const matchesSearch =
      r.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bandId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    addToast({
      type: 'success',
      title: 'Telemetry Dataset Downloaded',
      description: 'Exported 132 H₂S dosimetry scan logs as CSV format.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Colorimetric Telemetry & Readings Registry
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Complete high-precision optical scan history, exposure confidence ratings, and AI model verification.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#590D22] hover:bg-[#400918] rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export CSV Telemetry
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, worker, or band serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-[#FAF4ED] border border-[#590D22]/10 rounded-xl text-[#1C1917] focus:outline-none focus:border-[#E63946]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF4ED] border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Reading ID & Time</th>
                <th className="py-3.5 px-4">Worker & Dept</th>
                <th className="py-3.5 px-4">Dosimeter Band</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Exposure Dose</th>
                <th className="py-3.5 px-4">AI Confidence</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((r) => {
                const isHigh = r.status === 'HIGH_EXPOSURE';
                const isAttn = r.status === 'ATTENTION';

                return (
                  <tr key={r.id} className="hover:bg-[#FAF4ED]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1C1917]">
                      <div>{r.id}</div>
                      <div className="text-[10px] text-stone-400 font-normal">
                        {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-extrabold text-[#1C1917]">{r.workerName}</div>
                      <div className="text-stone-500 text-[11px]">{r.department}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-[#590D22]">
                      {r.bandId}
                    </td>

                    <td className="py-3 px-4 text-stone-700 font-medium">
                      {r.location}
                    </td>

                    <td className="py-3 px-4 font-mono font-black text-sm text-[#1C1917]">
                      {r.exposure} ppm·h
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            style={{ width: `${r.confidence}%` }}
                            className={`h-full ${r.confidence > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          />
                        </div>
                        <span className="font-mono font-bold text-[11px] text-stone-600">
                          {r.confidence}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md ${
                          isHigh
                            ? 'bg-red-600 text-white animate-pulse'
                            : isAttn
                            ? 'bg-amber-500 text-white'
                            : r.status === 'INVALID'
                            ? 'bg-stone-300 text-stone-700'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedReading(r)}
                        className="px-2.5 py-1 text-xs font-bold text-[#590D22] bg-[#FAF4ED] hover:bg-[#F5E6D8] rounded-lg transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reading Modal */}
      {selectedReading && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 space-y-4 border border-stone-200 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#1C1917]">
                  Reading Optical Telemetry: {selectedReading.id}
                </h3>
                <p className="text-xs text-stone-500">{selectedReading.workerName} • {selectedReading.timestamp}</p>
              </div>
              <button
                onClick={() => setSelectedReading(null)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF4ED] rounded-xl border border-[#590D22]/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 font-bold block">Measured Cumulative Dose</span>
                  <span className="text-2xl font-black text-[#1C1917] font-mono">
                    {selectedReading.exposure} ppm·h
                  </span>
                </div>
                <span className="px-3 py-1 text-xs font-bold bg-[#590D22] text-white rounded-lg">
                  {selectedReading.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block font-bold text-[10px]">AI Model Engine</span>
                  <span className="font-mono font-bold text-stone-800">{selectedReading.modelVersion}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block font-bold text-[10px]">Confidence Rating</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedReading.confidence}% Valid</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Location Telemetry</span>
                <p className="font-bold text-[#1C1917]">{selectedReading.location}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReading(null)}
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
