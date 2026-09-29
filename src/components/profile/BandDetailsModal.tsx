import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { Button } from '../common/Button';
import {
  QrCode, ShieldCheck, Calendar, Clock, AlertTriangle, AlertCircle, CheckCircle2,
  RotateCcw, Info, Cpu, Layers, Sparkles, Activity,
} from 'lucide-react';

export const BandDetailsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { band, latestReading, recalibrateBand } = useApp();
  const [simulatedExpiryState, setSimulatedExpiryState] = useState<'valid' | 'expiring_soon' | 'expired'>('valid');

  if (!isOpen) return null;

  /* Days math simulation based on state */
  const daysRemainingMap = {
    valid: 9,
    expiring_soon: 2,
    expired: 0,
  };

  const daysRemaining = daysRemainingMap[simulatedExpiryState];
  const expiryPct = Math.max(0, Math.min(100, (daysRemaining / 30) * 100));

  const getExpiryBadge = () => {
    switch (simulatedExpiryState) {
      case 'valid':
        return (
          <span className="px-3 py-1 text-xs font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Valid
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="px-3 py-1 text-xs font-extrabold bg-amber-100 text-amber-800 rounded-full border border-amber-300 flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Expiring Soon
          </span>
        );
      case 'expired':
        return (
          <span className="px-3 py-1 text-xs font-extrabold bg-red-100 text-red-800 rounded-full border border-red-300 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Expired
          </span>
        );
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Dosimeter Band Details">
      <div className="space-y-5 text-sm">

        {/* ── TOP QR & BAND HEAD ── */}
        <div className="bg-[#FAF4ED] p-5 rounded-3xl border border-[#590D22]/10 flex flex-col sm:flex-row items-center gap-5">
          {/* QR Graphic */}
          <div className="w-24 h-24 bg-white p-2.5 rounded-2xl border-2 border-stone-300 flex flex-col items-center justify-center shrink-0 shadow-inner relative">
            <QrCode className="w-full h-full text-[#1C1917]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-[#590D22] text-white text-[8px] font-mono font-extrabold px-1 py-0.5 rounded shadow">
                H2S-X3
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-mono font-extrabold text-[#590D22] bg-white px-2.5 py-0.5 rounded-md border border-[#590D22]/10">
                {band.serialNumber}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[#1C1917]">{band.model}</h3>
            <p className="text-xs text-stone-500 font-semibold">Assigned &amp; Paired to Rahul Patil (EMP-184)</p>
          </div>
        </div>

        {/* ── CIRCULAR EXPIRY INDICATOR (INSPIRED BY PHYSICAL WRISTBAND) ── */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-warm-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#590D22] uppercase tracking-wider">
              Circular Optical Expiry Gauge
            </span>
            {getExpiryBadge()}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-2">
            {/* Circular Gauge Graphic */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-stone-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    simulatedExpiryState === 'valid'
                      ? 'text-emerald-500'
                      : simulatedExpiryState === 'expiring_soon'
                      ? 'text-amber-500'
                      : 'text-red-500'
                  }
                  strokeDasharray={`${expiryPct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black font-mono text-[#1C1917]">
                  {daysRemaining}
                </span>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  Days Left
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs flex-1">
              <div className="flex justify-between border-b border-stone-100 pb-1">
                <span className="text-stone-500 font-semibold">Manufacture Date:</span>
                <span className="font-bold text-[#1C1917]">01 Sep 2026</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1">
                <span className="text-stone-500 font-semibold">Expiry Date:</span>
                <span className="font-bold text-stone-800">30 Sep 2026</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1">
                <span className="text-stone-500 font-semibold">Batch Code:</span>
                <span className="font-mono font-bold text-[#590D22]">BATCH-09</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Optical Matrix:</span>
                <span className="font-mono font-bold text-emerald-700">100% Zero-Point Clear</span>
              </div>
            </div>
          </div>

          {/* Test State Selector Pill */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
            <span className="text-stone-500 font-bold">Simulate Expiry State:</span>
            <div className="flex gap-1">
              {[
                { id: 'valid', label: '✓ Valid' },
                { id: 'expiring_soon', label: '⚠️ Soon' },
                { id: 'expired', label: '❌ Expired' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSimulatedExpiryState(id as any)}
                  className={`px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                    simulatedExpiryState === id ? 'bg-[#590D22] text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── READINGS METRICS ── */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <span className="text-stone-500 font-bold block">Total Readings Recorded</span>
            <span className="text-xl font-black font-mono text-[#1C1917] mt-0.5 block">
              {band.totalScans} Scans
            </span>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <span className="text-stone-500 font-bold block">Latest Exposure Dose</span>
            <span className="text-xl font-black font-mono text-[#590D22] mt-0.5 block">
              {latestReading?.exposureDosePpmH || 18.4} ppm·h
            </span>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 col-span-2">
            <span className="text-stone-500 font-bold block">Last Scanned Time</span>
            <span className="font-bold text-[#1C1917] mt-0.5 block">
              21 Sep 2026 • 18:42 (Pump Station B - Sector 4)
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full font-bold text-xs"
          icon={<RotateCcw className="w-4 h-4 text-[#590D22]" />}
          onClick={() => {
            recalibrateBand();
            onClose();
          }}
        >
          Recalibrate Optical Zero-Point Matrix
        </Button>
      </div>
    </BottomSheet>
  );
};
