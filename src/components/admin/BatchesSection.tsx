import React, { useState } from 'react';
import { Package, ShieldCheck, Clock, AlertTriangle, Plus, CheckCircle2 } from 'lucide-react';

interface BatchesSectionProps {
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const BatchesSection: React.FC<BatchesSectionProps> = ({ addToast }) => {
  const batches = [
    {
      batchId: 'BATCH-09',
      mfgDate: '2026-09-01',
      expiryDate: '2026-09-30',
      totalUnits: 50,
      activeUnits: 46,
      unassignedUnits: 4,
      status: 'ACTIVE',
      formulation: 'Lead Acetate Standard Chrominance Substrate v2.1',
      qcStatus: 'PASSED (ISO 9001)',
    },
    {
      batchId: 'BATCH-08',
      mfgDate: '2026-08-01',
      expiryDate: '2026-09-22',
      totalUnits: 50,
      activeUnits: 38,
      unassignedUnits: 0,
      status: 'EXPIRING_SOON',
      formulation: 'Lead Acetate Standard Chrominance Substrate v2.0',
      qcStatus: 'PASSED (ISO 9001)',
    },
    {
      batchId: 'BATCH-07',
      mfgDate: '2026-07-01',
      expiryDate: '2026-09-01',
      totalUnits: 50,
      activeUnits: 0,
      unassignedUnits: 0,
      status: 'EXPIRED',
      formulation: 'Lead Acetate Standard Chrominance Substrate v2.0',
      qcStatus: 'EXPIRED & DECOMMISSIONED',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Colorimetric Manufacturing Batch Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Track chemical formulation lots, factory spectroradiometer calibration curves, and QA certificates.
          </p>
        </div>

        <button
          onClick={() => {
            addToast({
              type: 'success',
              title: 'Batch Certificate Imported',
              description: 'Imported Quality Assurance ISO certificate for BATCH-09.',
            });
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#590D22] hover:bg-[#400918] rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Import Batch QA Cert
        </button>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {batches.map((b) => {
          const isActive = b.status === 'ACTIVE';
          const isExpiring = b.status === 'EXPIRING_SOON';
          const isExpired = b.status === 'EXPIRED';

          return (
            <div
              key={b.batchId}
              className={`p-5 rounded-2xl border transition-all ${
                isExpired
                  ? 'bg-stone-100 border-stone-300 opacity-75'
                  : isExpiring
                  ? 'bg-amber-50/60 border-amber-300'
                  : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-black text-base text-[#1C1917] bg-[#FAF4ED] px-3 py-1 rounded-xl border border-[#590D22]/15">
                  {b.batchId}
                </span>

                <span
                  className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : isExpiring
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {b.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold">Substrate Formulation:</span>
                  <span className="font-bold text-[#1C1917] text-right truncate max-w-[150px]">
                    {b.formulation}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold">Manufacture Date:</span>
                  <span className="font-mono text-stone-700">{b.mfgDate}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold">Expiry Date:</span>
                  <span className={`font-mono font-bold ${isExpiring || isExpired ? 'text-red-600' : 'text-stone-700'}`}>
                    {b.expiryDate}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold">Active In Field:</span>
                  <span className="font-mono font-bold text-[#590D22]">{b.activeUnits} / {b.totalUnits} units</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {b.qcStatus}
                </span>
                <button
                  onClick={() => {
                    addToast({
                      type: 'info',
                      title: `QA Certificate: ${b.batchId}`,
                      description: 'Opened spectroradiometric calibration curve data sheet.',
                    });
                  }}
                  className="text-xs font-bold text-[#E63946] hover:underline cursor-pointer"
                >
                  View QC Specs
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
