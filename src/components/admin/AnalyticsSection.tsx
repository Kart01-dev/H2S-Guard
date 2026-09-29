import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Activity, Download, Calendar, Layers } from 'lucide-react';
import { sevenDayTrend, departmentStats } from '../../data/adminMockData';

interface AnalyticsSectionProps {
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ addToast }) => {
  const [timeframe, setTimeframe] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Industrial Exposure Analytics & Predictive Modeling
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Deep statistical breakdown of cumulative TWA exposure, zone risk heatmaps, and threshold exceedance curves.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
            {['24h', '7d', '30d', '90d'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeframe === t ? 'bg-white text-[#1C1917] shadow-sm' : 'text-stone-500'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              addToast({
                type: 'success',
                title: 'Analytics Data Exported',
                description: 'Exported statistical dataset in CSV & JSON formats.',
              });
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#590D22] hover:bg-[#400918] rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-2">
            <span>Site Mean TWA Exposure</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-[#1C1917] font-mono">14.8 ppm·h</div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">Well below OSHA PEL (50 ppm·h limit)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-2">
            <span>Peak Hour Exposure Window</span>
            <Calendar className="w-4 h-4 text-[#E63946]" />
          </div>
          <div className="text-3xl font-black text-[#1C1917] font-mono">14:00 - 16:00</div>
          <p className="text-xs text-amber-700 font-semibold mt-1">Correlates with Desulfurization purge cycle</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-2">
            <span>High Risk Zone Alert Index</span>
            <Layers className="w-4 h-4 text-[#590D22]" />
          </div>
          <div className="text-3xl font-black text-[#590D22] font-mono">SECTOR B</div>
          <p className="text-xs text-stone-500 font-semibold mt-1">32% of total cumulative site exposure</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Bar Visual */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-base font-extrabold text-[#1C1917]">
              7-Day Reading Frequency by Status
            </h3>
            <span className="text-xs font-mono text-stone-400">Total: 236 Scans</span>
          </div>

          <div className="space-y-3 pt-2">
            {sevenDayTrend.map((item, i) => {
              const total = item.normal + item.attention + item.high + item.invalid;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="font-mono text-stone-600">{item.date}</span>
                    <span className="font-mono text-[#1C1917]">{total} scans</span>
                  </div>
                  <div className="h-4 bg-stone-100 rounded-lg overflow-hidden flex">
                    <div style={{ width: `${(item.normal / total) * 100}%` }} className="bg-emerald-500 h-full" title={`Normal: ${item.normal}`} />
                    <div style={{ width: `${(item.attention / total) * 100}%` }} className="bg-amber-400 h-full" title={`Attention: ${item.attention}`} />
                    <div style={{ width: `${(item.high / total) * 100}%` }} className="bg-[#E63946] h-full" title={`High: ${item.high}`} />
                    <div style={{ width: `${(item.invalid / total) * 100}%` }} className="bg-stone-300 h-full" title={`Invalid: ${item.invalid}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Exposure Comparison */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-base font-extrabold text-[#1C1917]">
              Department Exposure Distribution
            </h3>
            <span className="text-xs font-mono text-stone-400">Mean Dose comparison</span>
          </div>

          <div className="space-y-4 pt-2">
            {departmentStats.map((dept, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#1C1917]">{dept.dept}</span>
                  <span className="font-mono font-bold text-[#1C1917]">{dept.avgExposure} ppm·h</span>
                </div>
                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${(dept.avgExposure / 30) * 100}%`,
                      backgroundColor: dept.color,
                    }}
                    className="h-full rounded-full transition-all"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                  <span>{dept.workers} workers</span>
                  <span>{dept.highEvents} incidents</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
