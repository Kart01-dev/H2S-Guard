import React, { useState } from 'react';
import { Play, ChevronUp, ChevronDown, CheckCircle2, AlertTriangle, ShieldAlert, XCircle, Clock, RefreshCw, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemoModeWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { triggerDemoEvent } = useApp();

  const scenarios = [
    { id: 'demo_normal', label: '1. Normal Scan (18.4 ppm·h)', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
    { id: 'demo_attention', label: '2. Attention Scan (26.1 ppm·h)', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' },
    { id: 'demo_high', label: '3. High Exposure (42.8 ppm·h)', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100' },
    { id: 'demo_invalid', label: '4. Invalid Reading (Glare)', icon: XCircle, color: 'text-stone-600 bg-stone-100 border-stone-200 hover:bg-stone-200' },
    { id: 'demo_escalate', label: '5. Timeout Escalation (5-Min)', icon: Clock, color: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100' },
    { id: 'demo_recalibrate', label: '6. Recalibrate Dosimeter', icon: RefreshCw, color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100' },
    { id: 'demo_clear', label: '7. Reset Demo Environment', icon: RotateCcw, color: 'text-stone-700 bg-stone-50 border-stone-200 hover:bg-stone-200' },
  ];

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 flex flex-col items-start">
      {isOpen && (
        <div className="mb-3 w-72 bg-white dark:bg-stone-800 rounded-2xl p-4 shadow-2xl border border-stone-200 dark:border-stone-700 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-corp-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-corp-primary"></span>
              </span>
              <span className="font-extrabold text-[#1C1917] dark:text-white uppercase tracking-wider text-[11px] font-display">
                SIH Judge Demo Presets
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 p-1 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-stone-500 dark:text-stone-400 mb-3 leading-relaxed">
            Inject real-time simulation events to test worker alerts, escalation workflows, and supervisor dashboards.
          </p>

          <div className="space-y-1.5">
            {scenarios.map((sc) => {
              const Icon = sc.icon;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    triggerDemoEvent(sc.id);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left font-bold transition-all cursor-pointer ${sc.color} dark:bg-opacity-10 dark:border-opacity-20`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{sc.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#590D22] hover:bg-[#400918] text-white font-extrabold text-xs rounded-full shadow-lg border border-[#FAF4ED]/20 hover:scale-105 transition-all cursor-pointer"
      >
        <Play className="w-3.5 h-3.5 fill-current text-[#E63946]" />
        <span>Demo Controls</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
