import React, { useState } from 'react';
import { ShieldCheck, Clock, AlertTriangle, QrCode, Sparkles, Filter, Plus, RefreshCw } from 'lucide-react';
import { adminDosimeters, AdminDosimeter } from '../../data/adminMockData';

interface DosimetersSectionProps {
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const DosimetersSection: React.FC<DosimetersSectionProps> = ({ addToast }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredDosimeters = adminDosimeters.filter((d) => {
    if (filterStatus === 'ALL') return true;
    return d.status === filterStatus;
  });

  const activeCount = adminDosimeters.filter((d) => d.status === 'active').length;
  const expiringSoonCount = adminDosimeters.filter((d) => d.status === 'expiring_soon').length;
  const expiredCount = adminDosimeters.filter((d) => d.status === 'expired').length;
  const unassignedCount = adminDosimeters.filter((d) => d.status === 'unassigned').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Passive Dosimeter Fleet & Batches
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor colorimetric substrate expiration, optical calibration state, and physical wristband lifecycle.
          </p>
        </div>

        <button
          onClick={() => {
            addToast({
              type: 'success',
              title: 'New Batch Provisioned',
              description: 'Registered BATCH-10 with 50 factory calibrated passive H₂S wristbands.',
            });
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#590D22] hover:bg-[#400918] rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Provision New Batch
        </button>
      </div>

      {/* Fleet Overview KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-1">
            <span>Active & Calibrated</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#1C1917] font-mono">{activeCount}</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Ready for deployment</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1">
            <span>Expiring Soon (&lt;7 days)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 font-mono">{expiringSoonCount}</div>
          <span className="text-[11px] text-amber-700 font-semibold">Replacement required</span>
        </div>

        <div className="bg-red-50/60 p-4 rounded-2xl border border-red-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-red-800 mb-1">
            <span>Expired & Locked</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700 font-mono">{expiredCount}</div>
          <span className="text-[11px] text-red-700 font-semibold">Decommissioned</span>
        </div>

        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-1">
            <span>Unassigned Inventory</span>
            <QrCode className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-2xl font-black text-stone-700 font-mono">{unassignedCount}</div>
          <span className="text-[11px] text-stone-500 font-semibold">In storage locker</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['ALL', 'active', 'expiring_soon', 'expired', 'unassigned'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                filterStatus === st
                  ? 'bg-[#590D22] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:text-[#1C1917]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Dosimeters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDosimeters.map((d) => {
          const isExpiring = d.status === 'expiring_soon';
          const isExpired = d.status === 'expired';

          return (
            <div
              key={d.bandId}
              className={`p-4 rounded-2xl border transition-all ${
                isExpired
                  ? 'bg-stone-100 border-stone-300 opacity-75'
                  : isExpiring
                  ? 'bg-amber-50/60 border-amber-300'
                  : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#FAF4ED] text-[#590D22] border border-[#590D22]/15 rounded-md">
                    {d.batch}
                  </span>
                  <h4 className="text-sm font-extrabold text-[#1C1917] font-mono mt-1">
                    {d.bandId}
                  </h4>
                </div>

                <span
                  className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase ${
                    d.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : isExpiring
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : isExpired
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {d.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-stone-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-bold">Assigned Technician:</span>
                  <span className="font-extrabold text-[#1C1917]">{d.assignedWorker}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-bold">Expiry Date:</span>
                  <span
                    className={`font-mono font-bold ${
                      isExpiring || isExpired ? 'text-red-600' : 'text-stone-700'
                    }`}
                  >
                    {d.expiryDate}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-bold">Total Scans Recorded:</span>
                  <span className="font-mono font-bold text-[#1C1917]">{d.readingsCount}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400 font-mono">
                  Optical Matrix: VALID
                </span>
                <button
                  onClick={() => {
                    addToast({
                      type: 'info',
                      title: `Dosimeter Audit: ${d.bandId}`,
                      description: 'Substrate chrominance spectrum matches factory baseline.',
                    });
                  }}
                  className="text-xs font-bold text-[#E63946] hover:underline cursor-pointer"
                >
                  Verify Substrate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
