import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import {
  Bell,
  Scan,
  Radio,
  ShieldCheck,
  Download,
  Smartphone,
  Shield,
  Users,
  Menu,
  Moon,
  Sun,
  Search,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    worker,
    unreadNotificationsCount,
    openNotificationCenter,
    openScanner,
    activeTab,
    currentRole,
    setRole,
    addToast,
    toggleMobileSidebar,
    isDarkMode,
    toggleDarkMode,
  } = useApp();

  /* ── Role-aware title maps ── */
  const workerTitleMap: Record<string, string> = {
    home: 'Dosimeter Overview',
    history: 'My Exposure History',
    alerts: 'My Safety Alerts',
    profile: 'My Profile & Band',
  };

  const supervisorTitleMap: Record<string, string> = {
    dashboard: 'Supervisor Safety Monitor',
    alerts: 'Team Safety Alerts',
    profile: 'Supervisor Profile',
  };

  const adminTitleMap: Record<string, string> = {
    dashboard: 'Admin Command Center',
    alerts: 'Organization Safety Alerts',
    profile: 'System Administration',
  };

  const titleMap =
    currentRole === 'worker' ? workerTitleMap : currentRole === 'supervisor' ? supervisorTitleMap : adminTitleMap;

  const pageTitle = titleMap[activeTab] || 'H₂S Guard';

  const subtitleMap: Record<string, string> = {
    worker: `Live Sync Active • Shift started ${worker.shiftStartTime}`,
    supervisor: 'Team monitoring active • Escalation tracking',
    admin: 'Organization telemetry • System management',
  };

  const handleDownloadApk = () => {
    // For demo purposes, we will trigger a direct dummy file download
    const apkUrl = (import.meta as any).env?.VITE_EXPO_APK_DOWNLOAD_URL || '';
    
    if (apkUrl) {
      window.open(apkUrl, '_blank');
    } else {
      // Fallback: Generate a dummy APK file for the prototype demo
      const blob = new Blob(['Dummy APK content for H2S Guard prototype'], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'h2s-guard-app.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    addToast({
      type: 'success',
      title: 'Downloading Android App',
      description: 'Initiated download for H2S Guard Android APK.',
    });
  };

  /* ── Role badge colors ── */
  const roleBadge: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    worker: { bg: 'bg-emerald-50 border-emerald-200/60', text: 'text-emerald-800', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> },
    supervisor: { bg: 'bg-amber-50 border-amber-200/60', text: 'text-amber-800', icon: <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" /> },
    admin: { bg: 'bg-[#FAF4ED] border-[#590D22]/10', text: 'text-[#590D22]', icon: <Shield className="w-3.5 h-3.5 text-[#E63946] shrink-0" /> },
  };

  const badge = roleBadge[currentRole] || roleBadge.worker;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-[#590D22]/08 sticky top-0 z-20 px-3 sm:px-6 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
          {/* Left Section: Mobile Menu & Brand / Desktop Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Drawer Toggle */}
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-xl text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 md:hidden transition-colors cursor-pointer shrink-0"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5 text-corp-primary dark:text-corp-accent" />
          </button>

          {/* Mobile Brand Title */}
          <div className="flex items-center gap-2 md:hidden min-w-0">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 overflow-hidden border border-stone-200">
              <img src="/mrpl-logo.png" alt="MRPL Logo" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold text-[#1C1917] dark:text-white tracking-tight leading-none truncate font-display">
                H₂S <span className="text-corp-accent">Guard</span>
              </h2>
              <p className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 mt-0.5 capitalize truncate">
                {currentRole} View
              </p>
            </div>
          </div>

          {/* Desktop Page Title & Subtitle */}
          <div className="hidden md:block min-w-0">
            <h2 className="text-xl font-extrabold text-[#1C1917] dark:text-white tracking-tight truncate font-display">
              {pageTitle}
            </h2>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-0.5 truncate">
              <span className="w-2 h-2 rounded-full bg-corp-accent inline-block shrink-0"></span>
              <span className="truncate">{subtitleMap[currentRole]}</span>
            </p>
          </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Search reports, alerts, or users..."
              className="block w-full pl-10 pr-3 py-2 border border-stone-200 dark:border-stone-700 rounded-full leading-5 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-corp-primary/50 focus:border-corp-primary sm:text-sm transition-colors"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Download Android APK Button */}
          <button
            onClick={handleDownloadApk}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
            title="Download Android APK"
          >
            <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Get Android App</span>
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80 shrink-0" />
          </button>

          {/* Scan Band — Worker only */}
          {currentRole === 'worker' && (
            <div className="hidden sm:block">
              <Button
                variant="primary"
                size="sm"
                icon={<Scan className="w-4 h-4" />}
                onClick={openScanner}
              >
                Scan Band
              </Button>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-all duration-200 cursor-pointer shrink-0 ${
              isDarkMode
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 ring-1 ring-amber-500/30'
                : 'bg-[#D35400] text-white hover:bg-[#E67E22] shadow-md shadow-orange-300/40'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Role Switcher */}
          <div className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 ${badge.bg} rounded-full border text-xs font-bold ${badge.text}`}>
            {badge.icon}
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as any)}
              className={`bg-transparent text-xs font-bold ${badge.text} focus:outline-none cursor-pointer capitalize max-w-[95px] sm:max-w-none truncate`}
            >
              <option value="worker">Worker</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={openNotificationCenter}
            className="relative p-2 sm:p-2.5 rounded-2xl bg-white border border-stone-200 text-stone-600 hover:text-[#1C1917] hover:bg-[#FAF4ED] transition-colors cursor-pointer shadow-sm shrink-0"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#590D22]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#E63946] text-white text-[9px] sm:text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
