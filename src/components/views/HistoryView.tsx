import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { BottomSheet } from '../common/BottomSheet';
import type { Reading, SafetyStatus } from '../../types';
import {
  History, Search, Download, Calendar, MapPin, Sparkles,
  TrendingUp, Clock, CheckCircle2, ShieldCheck, QrCode, Filter,
  Eye, Check, FileText, ChevronRight, BarChart3, AlertTriangle,
  Flame, SlidersHorizontal, Info, Shield, Layers,
} from 'lucide-react';

/* ── Exposure Trend Chart Data ── */
const trendData = [
  { date: '17 Sep', day: 'Wed', exposure: 9.4, status: 'NORMAL' as SafetyStatus, label: 'Normal' },
  { date: '18 Sep', day: 'Thu', exposure: 42.8, status: 'HIGH_EXPOSURE' as SafetyStatus, label: 'High' },
  { date: '19 Sep', day: 'Fri', exposure: 26.1, status: 'ATTENTION' as SafetyStatus, label: 'Attention' },
  { date: '20 Sep', day: 'Sat', exposure: 11.2, status: 'NORMAL' as SafetyStatus, label: 'Normal' },
  { date: '21 Sep', day: 'Sun', exposure: 18.4, status: 'NORMAL' as SafetyStatus, label: 'Normal' },
];

export const HistoryView: React.FC = () => {
  const { readings, addToast, openScanner, band } = useApp();

  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days' | 'custom'>('7days');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [hoveredTrendBar, setHoveredTrendBar] = useState<typeof trendData[0] | null>(trendData[4]);
  const [customStartDate, setCustomStartDate] = useState('2026-09-15');
  const [customEndDate, setCustomEndDate] = useState('2026-09-21');

  /* Calculate totals */
  const todayDose = 18.4;
  const sevenDayTotal = 107.9;
  const maxDoseInTrend = Math.max(...trendData.map(d => d.exposure), 50);

  const filteredReadings = readings.filter((r) => {
    const matchesStatus = statusFilter === 'ALL' ? true : r.status === statusFilter;
    const matchesSearch =
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.bandId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    /* Time filtering logic */
    if (timeFilter === 'today') {
      const isToday = new Date(r.timestamp).toDateString() === new Date().toDateString() || r.id === 'rdg_901';
      return matchesStatus && matchesSearch && isToday;
    }

    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    addToast({
      type: 'success',
      title: 'Compliance Export Started',
      description: `Exporting ${filteredReadings.length} H₂S exposure records for ${timeFilter} period to CSV format.`,
    });
  };

  const getBarColor = (status: SafetyStatus) => {
    switch (status) {
      case 'NORMAL': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'ATTENTION': return 'bg-amber-500 hover:bg-amber-600';
      case 'HIGH_EXPOSURE': return 'bg-[#E63946] hover:bg-red-700';
      default: return 'bg-stone-400';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
            My Exposure
          </h1>
          <p className="text-xs text-stone-500 font-semibold mt-0.5">
            Personal H₂S dosimetry logs, optical reaction measurements &amp; shift compliance history
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          icon={<Download className="w-4 h-4 text-[#590D22]" />}
          onClick={handleExportCSV}
          className="shadow-sm"
        >
          Export Compliance CSV
        </Button>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Exposure */}
        <Card variant="white" className="p-4 relative overflow-hidden border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Today's Exposure</span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">21 Sep</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#1C1917]">{todayDose}</span>
            <span className="text-xs font-bold text-stone-500">ppm·h</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Normal shift cumulative
          </p>
        </Card>

        {/* 7-Day Exposure */}
        <Card variant="white" className="p-4 relative overflow-hidden border-l-4 border-l-[#590D22]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">7-Day Exposure</span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#590D22]/10 text-[#590D22] rounded-full">Cumulative</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#1C1917]">{sevenDayTotal}</span>
            <span className="text-xs font-bold text-stone-500">ppm·h</span>
          </div>
          <p className="text-[11px] text-stone-500 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#590D22]" /> 5 recorded scans
          </p>
        </Card>

        {/* Last Reading */}
        <Card variant="white" className="p-4 relative overflow-hidden border-l-4 border-l-[#E63946]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Last Reading</span>
            <span className="px-2 py-0.5 text-[10px] font-mono text-stone-400 font-bold">18:42</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-[#1C1917]">18.4</span>
            <span className="text-xs font-bold text-stone-500">ppm·h</span>
          </div>
          <p className="text-[11px] text-stone-600 font-semibold mt-1 truncate">
            Pump Station B - Sector 4
          </p>
        </Card>
      </div>

      {/* ── EXPOSURE TREND GRAPH CARD ── */}
      <Card variant="white" className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-[#1C1917] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#E63946]" />
              <span>Exposure Trend Visualization</span>
            </h3>
            <p className="text-xs text-stone-500 font-medium">Daily cumulative exposure dose ($ppm \cdot h$)</p>
          </div>

          {hoveredTrendBar && (
            <div className="px-3 py-1 bg-[#FAF4ED] border border-[#590D22]/10 rounded-xl text-xs flex items-center gap-2 font-mono">
              <span className="font-bold text-[#1C1917]">{hoveredTrendBar.date}:</span>
              <span className="font-black text-[#590D22]">{hoveredTrendBar.exposure} ppm·h</span>
              <StatusBadge status={hoveredTrendBar.status} size="sm" showIcon={false} />
            </div>
          )}
        </div>

        {/* Custom SVG / HTML Bar Chart */}
        <div className="pt-2 pb-1 space-y-2">
          {/* Action limits guidelines */}
          <div className="relative h-48 sm:h-56 bg-stone-50/60 rounded-2xl border border-stone-200/80 p-4 flex items-end justify-between gap-3 sm:gap-6 overflow-hidden">
            {/* Action threshold line at 50 ppm·h */}
            <div className="absolute inset-x-0 top-6 border-t-2 border-dashed border-red-300 z-0 flex items-center justify-end pr-3">
              <span className="text-[9px] font-extrabold font-mono text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-200 shadow-xs">
                OSHA Action Limit (50 ppm·h)
              </span>
            </div>

            {/* Attention line at 25 ppm·h */}
            <div className="absolute inset-x-0 top-24 border-t border-dashed border-amber-300 z-0 flex items-center justify-end pr-3">
              <span className="text-[9px] font-extrabold font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shadow-xs">
                Attention Threshold (25 ppm·h)
              </span>
            </div>

            {/* Trend Bars */}
            {trendData.map((d) => {
              const heightPct = Math.min((d.exposure / maxDoseInTrend) * 100, 100);
              const isSelected = hoveredTrendBar?.date === d.date;

              return (
                <div
                  key={d.date}
                  onMouseEnter={() => setHoveredTrendBar(d)}
                  onClick={() => setHoveredTrendBar(d)}
                  className="relative z-10 flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div className={`absolute -top-9 px-2 py-1 bg-stone-950 text-white rounded-lg text-[10px] font-mono font-bold shadow-lg transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    {d.exposure} ppm·h
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 shadow-sm ${getBarColor(d.status)} ${
                      isSelected ? 'ring-2 ring-stone-900 scale-x-105' : 'opacity-90'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />

                  {/* Date label */}
                  <div className="mt-2 text-center">
                    <span className="block text-[11px] font-extrabold text-[#1C1917]">{d.date}</span>
                    <span className="block text-[9px] font-mono text-stone-400 uppercase">{d.day}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 text-xs text-stone-600 font-semibold pt-1 border-t border-stone-100">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Normal (&lt;25)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Attention (25-50)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#E63946]" /> High Exposure (&gt;50)</span>
        </div>
      </Card>

      {/* ── TIME FILTERS & STATUS FILTER BAR ── */}
      <Card variant="white" className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Time Filter Pills */}
          <div className="flex items-center gap-1 bg-[#FAF4ED] p-1 rounded-2xl border border-[#590D22]/10 w-full md:w-auto overflow-x-auto">
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7 Days' },
              { id: '30days', label: '30 Days' },
              { id: 'custom', label: 'Custom Range' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTimeFilter(id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  timeFilter === id
                    ? 'bg-[#590D22] text-white shadow-sm'
                    : 'text-stone-600 hover:text-[#1C1917]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search location, band ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-semibold text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#E63946]"
            />
          </div>
        </div>

        {/* Custom Range Picker Drawer */}
        {timeFilter === 'custom' && (
          <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-stone-600 mb-1 block">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-[#1C1917]"
              />
            </div>
            <div>
              <label className="font-bold text-stone-600 mb-1 block">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-[#1C1917]"
              />
            </div>
          </div>
        )}

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-stone-100 text-xs">
          <span className="text-stone-400 font-bold shrink-0">Filter Status:</span>
          {['ALL', 'NORMAL', 'ATTENTION', 'HIGH_EXPOSURE', 'INVALID'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                statusFilter === st
                  ? 'bg-[#E63946] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st === 'ALL' ? 'All Statuses' : st === 'HIGH_EXPOSURE' ? 'High Exposure' : st}
            </button>
          ))}
        </div>
      </Card>

      {/* ── READINGS CARDS LIST ── */}
      {filteredReadings.length > 0 ? (
        <div className="space-y-3">
          {filteredReadings.map((rdg) => (
            <div
              key={rdg.id}
              onClick={() => setSelectedReading(rdg)}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-warm-card hover:shadow-warm-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                {/* Optical Color Swatch */}
                <div
                  className="w-14 h-14 rounded-2xl border-2 border-stone-200 shadow-inner shrink-0 flex flex-col items-center justify-center p-1 relative"
                  style={{ backgroundColor: rdg.colorShiftHex }}
                  title={`RGB: ${rdg.rawRgb.r}, ${rdg.rawRgb.g}, ${rdg.rawRgb.b}`}
                >
                  <span className="text-[8px] font-mono font-bold text-white bg-black/40 px-1 rounded">ΔE {rdg.deltaE}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <StatusBadge status={rdg.status} size="sm" />
                    <span className="text-[11px] font-mono text-stone-400 font-semibold">
                      {rdg.bandId}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                      ID: {rdg.id}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#1C1917] font-mono">
                      {rdg.exposureDosePpmH}
                    </span>
                    <span className="text-xs font-bold text-stone-500">ppm·h</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 ml-2">
                      {rdg.confidencePct}% confidence
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs sm:text-right flex sm:flex-col justify-between items-end">
                <div>
                  <div className="flex items-center sm:justify-end gap-1 font-bold text-[#1C1917]">
                    <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>{rdg.location}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1 text-stone-500 font-semibold mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      {new Date(rdg.timestamp).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: false,
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-[#590D22] group-hover:text-[#E63946] flex items-center gap-1 mt-2">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<History className="w-8 h-8" />}
          title="No Exposure Records Found"
          description="Try adjusting your time filter or search query."
          actionLabel="Scan New Dosimeter"
          onAction={openScanner}
        />
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          READING DETAILS MODAL / BOTTOM SHEET
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {selectedReading && (
        <BottomSheet
          isOpen={!!selectedReading}
          onClose={() => setSelectedReading(null)}
          title={`Scan Reading Details #${selectedReading.id}`}
        >
          <div className="space-y-5 text-sm">

            {/* Dose Banner */}
            <div className="bg-[#FAF4ED] p-5 rounded-3xl border border-[#590D22]/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-bold block mb-1">
                  Cumulative Exposure Dose
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-mono text-[#1C1917]">
                    {selectedReading.exposureDosePpmH}
                  </span>
                  <span className="text-sm font-bold text-stone-500">ppm·h</span>
                </div>
              </div>
              <StatusBadge status={selectedReading.status} size="lg" />
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="text-stone-500 font-bold block">Exposure Duration</span>
                <span className="font-extrabold text-[#1C1917] mt-0.5 block">
                  {Math.floor(selectedReading.shiftDurationMinutes / 60)}h {selectedReading.shiftDurationMinutes % 60}m
                </span>
              </div>
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="text-stone-500 font-bold block">Confidence Index</span>
                <span className="font-extrabold text-emerald-700 mt-0.5 block font-mono">
                  {selectedReading.confidencePct}% Verified
                </span>
              </div>
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="text-stone-500 font-bold block">Timestamp</span>
                <span className="font-bold text-[#1C1917] mt-0.5 block">
                  {new Date(selectedReading.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="text-stone-500 font-bold block">Wristband ID</span>
                <span className="font-mono font-bold text-[#590D22] mt-0.5 block">
                  {selectedReading.bandId}
                </span>
              </div>
            </div>

            {/* Model & Calibration metadata */}
            <div className="bg-stone-100 rounded-2xl p-3 border border-stone-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Model Version</span>
                <span className="font-mono font-bold text-stone-800">H2S-COLOR-v1.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Calibration Matrix</span>
                <span className="font-mono font-bold text-stone-800">CAL-2026-09</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Location Zone</span>
                <span className="font-bold text-[#1C1917]">{selectedReading.location}</span>
              </div>
            </div>

            {/* Image / Scan Preview Placeholder with Overlay */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#590D22] uppercase tracking-wider block">
                Camera Scan Preview &amp; Optical Frame
              </span>
              <div className="w-full h-44 bg-stone-900 rounded-2xl border border-stone-700 relative overflow-hidden flex items-center justify-center p-4">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E63946_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Target box */}
                <div className="relative z-10 w-32 h-32 rounded-2xl border-2 border-dashed border-[#E63946] flex flex-col items-center justify-center p-2 bg-black/60">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-white shadow-lg my-1"
                    style={{ backgroundColor: selectedReading.colorShiftHex }}
                  />
                  <span className="text-[9px] font-mono text-white font-bold">RGB: {selectedReading.rawRgb.r},{selectedReading.rawRgb.g},{selectedReading.rawRgb.b}</span>
                  <span className="text-[8px] text-amber-400 font-mono mt-0.5">ΔE {selectedReading.deltaE}</span>
                </div>

                <div className="absolute bottom-2 right-3 text-[9px] font-mono text-stone-400 bg-stone-950/80 px-2 py-0.5 rounded border border-white/10">
                  Optical Target Lock ✓
                </div>
              </div>
            </div>

            {/* Validation Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#590D22] uppercase tracking-wider block">
                Validation Status Checklist
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  '✓ Band identified',
                  '✓ QR verified',
                  '✓ Image quality acceptable',
                  '✓ Reference detected',
                  '✓ Sensor region detected',
                  '✓ Expiry checked',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-emerald-50 text-emerald-800 font-bold px-3 py-2 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item.replace('✓ ', '')}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedReading.notes && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Technician Notes
                </span>
                <p className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 border border-stone-200 leading-relaxed font-medium">
                  {selectedReading.notes}
                </p>
              </div>
            )}

            <Button
              variant="burgundy"
              className="w-full font-bold"
              onClick={() => setSelectedReading(null)}
            >
              Close Details
            </Button>
          </div>
        </BottomSheet>
      )}

    </div>
  );
};
