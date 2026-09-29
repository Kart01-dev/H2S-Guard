import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Flame,
  XCircle,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Radio,
  FileSpreadsheet,
  Megaphone,
  Download,
  Filter,
} from 'lucide-react';
import { adminWorkers, adminReadings, adminIncidents, sevenDayTrend, departmentStats } from '../../data/adminMockData';

interface OverviewSectionProps {
  onNavigateTab: (tab: string) => void;
  onOpenIncidentModal: (incidentId: string) => void;
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  onNavigateTab,
  onOpenIncidentModal,
  addToast,
}) => {
  const [readingFilter, setReadingFilter] = useState<'ALL' | 'ATTENTION' | 'HIGH_EXPOSURE'>('ALL');

  const filteredReadings = adminReadings.filter((r) => {
    if (readingFilter === 'ATTENTION') return r.status === 'ATTENTION';
    if (readingFilter === 'HIGH_EXPOSURE') return r.status === 'HIGH_EXPOSURE';
    return true;
  });

  const handleBroadcastAlert = () => {
    addToast({
      type: 'warning',
      title: 'Plant Emergency Broadcast Sent',
      description: 'Push alert sent to all 148 active wristband dosimeter users.',
    });
  };

  const handleInitiateMuster = () => {
    addToast({
      type: 'error',
      title: 'SCBA Muster Command Activated',
      description: 'Safety muster protocol initiated for Sector B Vent Line area.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Top Bar & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-corp-primary text-white rounded-md tracking-wider uppercase">
              Live Monitoring
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-500">•</span>
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 font-mono">21 September 2026</span>
          </div>
          <h2 className="text-2xl font-black text-[#1C1917] dark:text-white tracking-tight mt-1 font-display">
            Plant Executive Command Center
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Real-time H₂S exposure telemetry, worker dosimetry fleet integrity, and automated risk escalation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleBroadcastAlert}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-corp-primary dark:text-corp-accent bg-corp-primary/10 hover:bg-corp-primary/20 border border-corp-primary/20 rounded-xl transition-all cursor-pointer"
          >
            <Megaphone className="w-4 h-4 text-corp-primary dark:text-corp-accent" />
            Broadcast Alert
          </button>
          <button
            onClick={handleInitiateMuster}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            Trigger Muster
          </button>
          <button
            onClick={() => {
              addToast({
                type: 'success',
                title: 'Daily Dosimetry Report Exported',
                description: 'Generated PDF executive briefing for plant manager.',
              });
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Briefing
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (Requested exact KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-2">
            <span>Active Workers</span>
            <Users className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-3xl font-black text-[#1C1917] font-mono">148</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            On-Shift Active
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-2">
            <span>Readings Today</span>
            <Activity className="w-4 h-4 text-[#590D22]" />
          </div>
          <div className="text-3xl font-black text-[#1C1917] font-mono">132</div>
          <div className="text-[11px] font-medium text-stone-500 mt-1">
            +18 vs yesterday
          </div>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 shadow-sm">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-2">
            <span>Normal</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-900 font-mono">112</div>
          <div className="text-[11px] font-semibold text-emerald-700 mt-1">
            84.8% of fleet
          </div>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
            <span>Attention</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-900 font-mono">17</div>
          <div className="text-[11px] font-semibold text-amber-700 mt-1">
            12.8% dose elevated
          </div>
        </div>

        <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 shadow-sm">
          <div className="flex items-center justify-between text-red-800 text-xs font-bold mb-2">
            <span>High Exposure</span>
            <Flame className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-black text-red-600 font-mono">3</div>
          <div className="text-[11px] font-bold text-red-700 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            SCBA Required
          </div>
        </div>

        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-600 text-xs font-bold mb-2">
            <span>Invalid</span>
            <XCircle className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-3xl font-black text-stone-700 font-mono">4</div>
          <div className="text-[11px] font-medium text-stone-500 mt-1">
            Needs Rescan
          </div>
        </div>
      </div>

      {/* Main Charts & Incident Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Trend Chart & Department Matrix */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-[#1C1917] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#E63946]" />
                7-Day Exposure Trend Analysis
              </h3>
              <p className="text-xs text-stone-500">Daily distribution of readings by risk classification</p>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs font-bold text-[#E63946] hover:text-[#590D22] flex items-center gap-1 cursor-pointer"
            >
              Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Stacked Bar Chart Simulation */}
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 pt-2 pb-1 items-end h-44 border-b border-stone-100">
              {sevenDayTrend.map((item, idx) => {
                const total = item.normal + item.attention + item.high + item.invalid;
                const normalPct = (item.normal / total) * 100;
                const attentionPct = (item.attention / total) * 100;
                const highPct = (item.high / total) * 100;
                const invalidPct = (item.invalid / total) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full max-w-[36px] bg-stone-100 rounded-xl overflow-hidden flex flex-col justify-end h-full transition-all group-hover:scale-105">
                      {item.high > 0 && (
                        <div
                          style={{ height: `${highPct}%` }}
                          className="bg-[#E63946] w-full transition-all"
                          title={`High Exposure: ${item.high}`}
                        />
                      )}
                      {item.attention > 0 && (
                        <div
                          style={{ height: `${attentionPct}%` }}
                          className="bg-amber-400 w-full transition-all"
                          title={`Attention: ${item.attention}`}
                        />
                      )}
                      {item.invalid > 0 && (
                        <div
                          style={{ height: `${invalidPct}%` }}
                          className="bg-stone-300 w-full transition-all"
                          title={`Invalid: ${item.invalid}`}
                        />
                      )}
                      <div
                        style={{ height: `${normalPct}%` }}
                        className="bg-emerald-500 w-full transition-all"
                        title={`Normal: ${item.normal}`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-stone-500 font-mono">{item.date}</span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs font-semibold text-stone-600 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                Normal (&lt;25 ppm·h)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-400" />
                Attention (25–40 ppm·h)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#E63946]" />
                High Exposure (&gt;40 ppm·h)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-stone-300" />
                Invalid
              </div>
            </div>
          </div>

          {/* Department Breakdown Mini Table */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
              Department Exposure Averages
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {departmentStats.slice(0, 4).map((dept, i) => (
                <div key={i} className="p-3 bg-[#FAF4ED] border border-[#590D22]/08 rounded-xl flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-extrabold text-[#1C1917]">{dept.dept}</h5>
                    <p className="text-[11px] text-stone-500 font-medium">{dept.workers} active workers</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#1C1917]">
                      {dept.avgExposure} ppm·h
                    </span>
                    {dept.highEvents > 0 && (
                      <div className="text-[10px] font-bold text-[#E63946]">
                        {dept.highEvents} High Incident
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent High Exposure Events Panel */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-[#1C1917] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#E63946]" />
                Recent High Risk Incidents
              </h3>
              <button
                onClick={() => onNavigateTab('incidents')}
                className="text-xs font-bold text-[#E63946] hover:underline"
              >
                View All ({adminIncidents.length})
              </button>
            </div>

            <div className="space-y-3">
              {adminIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onOpenIncidentModal(inc.id)}
                  className="p-3.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-extrabold text-[#E63946]">
                      {inc.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                        inc.status === 'OPEN'
                          ? 'bg-red-600 text-white animate-pulse'
                          : inc.status === 'INVESTIGATING'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#1C1917] group-hover:text-[#E63946] transition-colors">
                        {inc.workerName}
                      </h4>
                      <p className="text-[11px] text-stone-600 font-medium truncate max-w-[180px]">
                        {inc.location}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-red-600 font-mono">
                        {inc.exposure} ppm·h
                      </span>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 bg-[#FAF4ED] p-3 rounded-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1C1917]">Safety Escalation Protocol:</span>
              <span className="font-mono text-emerald-700 font-bold">L3 AUTOMATED</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Readings &gt;40.0 ppm·h trigger immediate SCBA evacuation & auto-supervisor SMS broadcast.
            </p>
          </div>
        </div>
      </div>

      {/* Live Worker Telemetry Stream */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#E63946] animate-pulse" />
            <div>
              <h3 className="text-base font-extrabold text-[#1C1917]">Live Dosimeter Scan Feed</h3>
              <p className="text-xs text-stone-500">Real-time colorimetric telemetry from worker app scans</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-600">
            <button
              onClick={() => setReadingFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                readingFilter === 'ALL' ? 'bg-white text-[#1C1917] shadow-sm' : 'hover:text-[#1C1917]'
              }`}
            >
              All Scans ({adminReadings.length})
            </button>
            <button
              onClick={() => setReadingFilter('ATTENTION')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                readingFilter === 'ATTENTION' ? 'bg-amber-500 text-white shadow-sm' : 'hover:text-[#1C1917]'
              }`}
            >
              Attention Only
            </button>
            <button
              onClick={() => setReadingFilter('HIGH_EXPOSURE')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                readingFilter === 'HIGH_EXPOSURE' ? 'bg-[#E63946] text-white shadow-sm' : 'hover:text-[#1C1917]'
              }`}
            >
              High Exposure Only
            </button>
          </div>
        </div>

        {/* Live Stream Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredReadings.map((rdg) => {
            const isHigh = rdg.status === 'HIGH_EXPOSURE';
            const isAttn = rdg.status === 'ATTENTION';
            const isInvalid = rdg.status === 'INVALID';

            return (
              <div
                key={rdg.id}
                className={`p-4 rounded-xl border transition-all ${
                  isHigh
                    ? 'bg-red-50/70 border-red-200'
                    : isAttn
                    ? 'bg-amber-50/60 border-amber-200'
                    : isInvalid
                    ? 'bg-stone-50 border-stone-200'
                    : 'bg-[#FAF4ED]/60 border-[#590D22]/10 hover:border-[#590D22]/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-stone-400">{rdg.id}</span>
                    <h4 className="text-sm font-extrabold text-[#1C1917]">{rdg.workerName}</h4>
                    <p className="text-xs text-stone-500">{rdg.department} • {rdg.location}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md font-mono ${
                      isHigh
                        ? 'bg-red-600 text-white'
                        : isAttn
                        ? 'bg-amber-500 text-white'
                        : isInvalid
                        ? 'bg-stone-400 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {rdg.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Dosimeter</span>
                    <span className="font-mono font-bold text-[#1C1917]">{rdg.bandId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 block">Exposure Dose</span>
                    <span className="font-mono font-black text-sm text-[#1C1917]">
                      {rdg.exposure} ppm·h
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
