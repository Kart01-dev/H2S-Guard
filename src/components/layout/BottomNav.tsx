import React from 'react';
import { useApp } from '../../context/AppContext';
import type { NavTab } from '../../types';
import { Home, History, ShieldAlert, User, Scan, LayoutDashboard } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, unreadAlertsCount, openScanner, currentRole } = useApp();

  /* ── Role-based nav items ── */
  const workerItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: (
        <div className="relative">
          <ShieldAlert className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-[#E63946] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </div>
      ),
    },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const supervisorItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Monitor', icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: (
        <div className="relative">
          <ShieldAlert className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-[#E63946] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </div>
      ),
    },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const adminItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Command', icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: (
        <div className="relative">
          <ShieldAlert className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-[#E63946] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </div>
      ),
    },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const navItems =
    currentRole === 'worker' ? workerItems : currentRole === 'supervisor' ? supervisorItems : adminItems;

  const showScanFab = currentRole === 'worker';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#590D22]/10 shadow-[0_-4px_20px_rgba(89,13,34,0.06)] px-3 pb-safe pt-2">
      <div className="flex items-center justify-around relative max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.id;
          // Insert Scan FAB before the 3rd item (Alerts) for Worker view
          const insertScanBefore = showScanFab && index === 2;
          return (
            <React.Fragment key={item.id}>
              {insertScanBefore && (
                <button
                  onClick={openScanner}
                  className="flex flex-col items-center justify-center -mt-6 cursor-pointer group"
                  aria-label="Scan Dosimeter"
                >
                  <div className="w-13 h-13 rounded-full bg-[#E63946] text-white flex items-center justify-center shadow-warm-hero group-active:scale-95 transition-transform">
                    <Scan className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#590D22] mt-1 tracking-tight">
                    Scan
                  </span>
                </button>
              )}

              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#E63946] font-bold scale-105'
                    : 'text-stone-500 hover:text-stone-800 font-medium'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-[#FAF4ED]' : ''
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-[11px] tracking-tight">{item.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
