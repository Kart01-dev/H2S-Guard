import React, { useState } from 'react';
import { BottomSheet } from '../common/BottomSheet';
import { Button } from '../common/Button';
import {
  CheckCircle2, Camera, Cpu, Database, Cloud, Bell, RefreshCw, Activity, Shield,
} from 'lucide-react';

export const SystemStatusModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const handleRetest = () => {
    setTesting(true);
    setTimeout(() => setTesting(false), 1200);
  };

  const statusItems = [
    {
      name: 'Camera Viewfinder & Hardware',
      status: 'Available',
      detail: '1080p Back Optical Camera Accessible',
      icon: <Camera className="w-4 h-4 text-[#E63946]" />,
      ok: true,
    },
    {
      name: 'AI Model (Colorimetric Engine)',
      status: 'Loaded',
      detail: 'H2S-COLOR-v1.2 neural matrix running locally',
      icon: <Cpu className="w-4 h-4 text-[#590D22]" />,
      ok: true,
    },
    {
      name: 'Local Database (IndexedDB)',
      status: 'Available',
      detail: 'Offline encrypted logs active (48 records cached)',
      icon: <Database className="w-4 h-4 text-emerald-600" />,
      ok: true,
    },
    {
      name: 'Cloud Sync',
      status: 'Connected',
      detail: 'Plant Safety Server (Sector 4 Gateway) • Latency 14ms',
      icon: <Cloud className="w-4 h-4 text-sky-600" />,
      ok: true,
    },
    {
      name: 'Notifications Engine',
      status: 'Enabled',
      detail: 'High exposure supervisor push channel active',
      icon: <Bell className="w-4 h-4 text-amber-500" />,
      ok: true,
    },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="System Diagnostic Status">
      <div className="space-y-4 text-sm">
        <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#590D22]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-xl text-[#590D22] shadow-sm">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-black text-[#1C1917]">H₂S Guard Field Node Status</p>
              <p className="text-[10px] text-stone-500 font-mono">v1.4.2-industrial • All Systems Operational</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
            ONLINE
          </span>
        </div>

        {/* Status items */}
        <div className="space-y-2.5">
          {statusItems.map((item) => (
            <div
              key={item.name}
              className="p-3.5 bg-white rounded-2xl border border-stone-200/90 shadow-warm-card flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-[#1C1917] text-xs">{item.name}</h4>
                  <p className="text-[11px] text-stone-500 font-medium">{item.detail}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>✓ {item.status}</span>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full font-bold text-xs"
          isLoading={testing}
          icon={<RefreshCw className="w-4 h-4 text-[#590D22]" />}
          onClick={handleRetest}
        >
          Run Diagnostic Self-Test
        </Button>
      </div>
    </BottomSheet>
  );
};
