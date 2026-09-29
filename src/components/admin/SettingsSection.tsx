import React, { useState } from 'react';
import { Sliders, Bell, ShieldAlert, Save, Key, Radio } from 'lucide-react';

interface SettingsSectionProps {
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ addToast }) => {
  const [attentionThreshold, setAttentionThreshold] = useState(25.0);
  const [highThreshold, setHighThreshold] = useState(40.0);
  const [scbaMandate, setScbaMandate] = useState(45.0);
  const [autoSms, setAutoSms] = useState(true);

  const handleSaveSettings = () => {
    addToast({
      type: 'success',
      title: 'Safety Parameters Updated',
      description: 'Threshold limits pushed to active wristband monitoring engine.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Plant-Wide Safety & Escalation Rules Configuration
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Set H₂S exposure dose thresholds, supervisor SMS webhooks, and automated muster dispatch rules.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#590D22] hover:bg-[#400918] rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          Save Configuration
        </button>
      </div>

      {/* Threshold Configuration Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
        <h3 className="text-base font-extrabold text-[#1C1917] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#E63946]" />
          Dosimetry Threshold Limits (ppm·h)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
            <span className="text-xs font-bold text-amber-900 block">Attention Limit</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-amber-900 font-mono">{attentionThreshold} ppm·h</span>
            </div>
            <p className="text-[11px] text-amber-700">Triggers amber warning badge in worker app.</p>
          </div>

          <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-2">
            <span className="text-xs font-bold text-red-900 block">High Exposure Limit</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-red-600 font-mono">{highThreshold} ppm·h</span>
            </div>
            <p className="text-[11px] text-red-700">Triggers mandatory SCBA evacuation warning.</p>
          </div>

          <div className="p-4 bg-red-100 border border-red-300 rounded-xl space-y-2">
            <span className="text-xs font-bold text-red-900 block">Automatic Muster Mandate</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#590D22] font-mono">{scbaMandate} ppm·h</span>
            </div>
            <p className="text-[11px] text-red-800">Auto-notifies plant safety supervisor via SMS.</p>
          </div>
        </div>
      </div>

      {/* Emergency Alert Dispatch Settings */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-[#1C1917] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#590D22]" />
          Automated Emergency Broadcast Webhooks
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-[#1C1917]">Auto SMS Broadcast to Safety Supervisors</h4>
              <p className="text-stone-500">Dispatch SMS alerts immediately when High Exposure reading is registered.</p>
            </div>
            <input
              type="checkbox"
              checked={autoSms}
              onChange={(e) => setAutoSms(e.target.checked)}
              className="w-4 h-4 accent-[#E63946] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
