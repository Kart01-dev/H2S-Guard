import React, { useState } from 'react';
import { Bell, ShieldAlert, GitBranch, Settings, Clock, ArrowRight, UserCheck } from 'lucide-react';

interface AlertEngineSectionProps {
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const AlertEngineSection: React.FC<AlertEngineSectionProps> = ({ addToast }) => {
  const [activeRule, setActiveRule] = useState<string>('high_exposure');

  const rules = [
    {
      id: 'normal',
      label: 'Normal Exposure',
      status: 'Active',
      color: 'emerald',
      threshold: '< 25.0 ppm·h',
      targets: ['Worker'],
      escalation: 'None (Data Logged)',
    },
    {
      id: 'attention',
      label: 'Attention Warning',
      status: 'Active',
      color: 'amber',
      threshold: '25.0 - 40.0 ppm·h',
      targets: ['Worker', 'Supervisor (Digest)'],
      escalation: 'Supervisory Review Required',
    },
    {
      id: 'high_exposure',
      label: 'High Exposure Hazard',
      status: 'Active',
      color: 'red',
      threshold: '> 40.0 ppm·h',
      targets: ['Worker', 'Supervisor', 'Safety Team', 'Expert Team'],
      escalation: 'Immediate SCBA & Full Evacuation',
    },
    {
      id: 'invalid',
      label: 'Invalid Reading',
      status: 'Active',
      color: 'stone',
      threshold: 'Optical Failure',
      targets: ['Worker'],
      escalation: 'Mandatory Rescan',
    },
  ];

  const escalationTimeline = [
    { step: 1, label: 'Alert Generated', detail: 'Optical threshold exceeded (T=0s)' },
    { step: 2, label: 'Worker Notified', detail: 'In-app siren & vibration (T+1s)' },
    { step: 3, label: 'Supervisor Notified', detail: 'SMS & Dashboard Alert (T+2s)' },
    { step: 4, label: 'Acknowledgement Window', detail: '5-minute SLA timer begins' },
    { step: 5, label: 'Expert Escalation', detail: 'If unacknowledged, route to Site Commander' },
    { step: 6, label: 'Incident Creation', detail: 'OSHA 1910 audit trail locked' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Safety Alert Engine & Escalation Routing
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure dynamic notification targets, SLAs, and incident auto-creation logic.
          </p>
        </div>
        <button
          onClick={() => addToast({ type: 'success', title: 'Rules Saved', description: 'Escalation logic deployed to production.' })}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#590D22] hover:bg-[#400918] rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" /> Save Ruleset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
            Active Rules
          </h3>
          {rules.map((rule) => {
            const isActive = activeRule === rule.id;
            return (
              <div
                key={rule.id}
                onClick={() => setActiveRule(rule.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white border-[#590D22] shadow-md'
                    : 'bg-[#FAF4ED]/50 border-stone-200 hover:border-stone-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${rule.color}-500`} />
                    <span className="font-extrabold text-[#1C1917] text-sm">{rule.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-${rule.color}-100 text-${rule.color}-800 border border-${rule.color}-200`}>
                    {rule.status}
                  </span>
                </div>
                <div className="text-xs font-mono text-stone-500 mb-2">Condition: {rule.threshold}</div>
                <div className="flex items-center gap-1 mt-3 flex-wrap">
                  {rule.targets.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 bg-stone-100 border border-stone-200 text-stone-600 rounded-md text-[10px] font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Rule Config & Escalation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline View */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <h3 className="text-base font-extrabold text-[#1C1917] flex items-center gap-2 border-b border-stone-100 pb-3 mb-6">
              <GitBranch className="w-4 h-4 text-[#E63946]" />
              Automated Escalation Timeline (High Risk)
            </h3>
            
            <div className="relative pl-6">
              <div className="absolute left-3 top-2 bottom-4 w-0.5 bg-stone-100" />
              
              {escalationTimeline.map((item, idx) => (
                <div key={idx} className="relative mb-6 last:mb-0">
                  <div className="absolute -left-[30px] w-6 h-6 rounded-full bg-white border-2 border-[#590D22] text-[#590D22] flex items-center justify-center text-[10px] font-black z-10">
                    {item.step}
                  </div>
                  <div className="bg-[#FAF4ED] border border-[#590D22]/10 p-3 rounded-xl ml-2">
                    <h4 className="text-sm font-extrabold text-[#1C1917]">{item.label}</h4>
                    <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
