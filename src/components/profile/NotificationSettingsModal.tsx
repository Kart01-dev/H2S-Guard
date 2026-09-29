import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { Button } from '../common/Button';
import { Bell, Flame, AlertTriangle, CheckCircle2, UserCheck, Save } from 'lucide-react';

export const NotificationSettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useApp();
  const [highExposureAlerts, setHighExposureAlerts] = useState(true);
  const [attentionAlerts, setAttentionAlerts] = useState(true);
  const [readingConfirmations, setReadingConfirmations] = useState(true);
  const [supervisorUpdates, setSupervisorUpdates] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    addToast({
      type: 'success',
      title: 'Notification Preferences Saved',
      description: 'Your alert channel settings have been updated.',
    });
    onClose();
  };

  const toggleItems = [
    {
      title: 'High Exposure Alerts',
      desc: 'Immediate emergency push alerts for dose > 50 ppm·h',
      state: highExposureAlerts,
      setter: setHighExposureAlerts,
      icon: <Flame className="w-4 h-4 text-[#E63946]" />,
      disabled: true, // Safety mandatory
      mandatoryNote: 'Mandatory Industrial Safety Setting',
    },
    {
      title: 'Attention Exposure Level Alerts',
      desc: 'Notifications when dose reaches 25-50 ppm·h',
      state: attentionAlerts,
      setter: setAttentionAlerts,
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    },
    {
      title: 'Reading Scan Confirmations',
      desc: 'Sound & toast confirmation when optical scan is saved',
      state: readingConfirmations,
      setter: setReadingConfirmations,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      title: 'Supervisor Lifecycle Updates',
      desc: 'Alert when supervisor acknowledges or escalates incident',
      state: supervisorUpdates,
      setter: setSupervisorUpdates,
      icon: <UserCheck className="w-4 h-4 text-[#590D22]" />,
    },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Notification Settings">
      <div className="space-y-4 text-sm">
        <div className="bg-[#FAF4ED] p-3.5 rounded-2xl border border-[#590D22]/10 flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-[#590D22] shrink-0" />
          <p className="text-xs text-stone-600 font-medium">
            Configure how you receive critical safety threshold notices and supervisor updates.
          </p>
        </div>

        <div className="space-y-3">
          {toggleItems.map((item) => (
            <div
              key={item.title}
              className="p-4 bg-white rounded-2xl border border-stone-200 shadow-warm-card flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200 mt-0.5 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-[#1C1917] text-xs flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.mandatoryNote && (
                      <span className="text-[9px] font-extrabold bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-200">
                        MANDATORY
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 font-medium">{item.desc}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                disabled={item.disabled}
                onClick={() => item.setter(!item.state)}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                  item.state ? 'bg-[#E63946]' : 'bg-stone-300'
                } ${item.disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                    item.state ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <Button variant="primary" className="w-full font-bold shadow-warm-hero" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
          Save Notification Preferences
        </Button>
      </div>
    </BottomSheet>
  );
};
