import React from 'react';
import { useApp } from '../../context/AppContext';
import type { NavTab } from '../../types';
import { Button } from '../common/Button';
import {
  Home,
  History,
  ShieldAlert,
  User,
  LayoutDashboard,
  Scan,
  ShieldCheck,
  Radio,
  Smartphone,
  Download,
  Shield,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    unreadAlertsCount,
    openScanner,
    worker,
    band,
    currentRole,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
    isMobileSidebarOpen,
    closeMobileSidebar,
  } = useApp();

  /* ── Role-based navigation items ── */
  const workerNav: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'history', label: 'Exposure History', icon: <History className="w-5 h-5" /> },
    {
      id: 'alerts',
      label: 'My Alerts',
      icon: <ShieldAlert className="w-5 h-5" />,
      badge: unreadAlertsCount,
    },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
  ];

  const supervisorNav: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Supervisor Monitor', icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      id: 'alerts',
      label: 'Safety Alerts',
      icon: <ShieldAlert className="w-5 h-5" />,
      badge: unreadAlertsCount,
    },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const adminNav: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      id: 'alerts',
      label: 'All Safety Alerts',
      icon: <ShieldAlert className="w-5 h-5" />,
      badge: unreadAlertsCount,
    },
    { id: 'profile', label: 'System Profile', icon: <User className="w-5 h-5" /> },
  ];

  const navItems = currentRole === 'worker' ? workerNav : currentRole === 'supervisor' ? supervisorNav : adminNav;

  const roleLabels: Record<string, { title: string; subtitle: string }> = {
    worker: { title: 'Worker Portal', subtitle: 'Personal Safety' },
    supervisor: { title: 'Supervisor Portal', subtitle: 'Team Safety' },
    admin: { title: 'Admin Portal', subtitle: 'Command Center' },
  };

  const currentRoleLabel = roleLabels[currentRole] || roleLabels.worker;

  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    closeMobileSidebar();
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
  };

  const renderContent = (isCollapsedMode: boolean, isMobileView: boolean = false) => (
    <div className="flex flex-col h-full overflow-y-auto bg-corp-card dark:bg-stone-900">
      {/* Brand Header */}
      <div className={`p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center ${isCollapsedMode ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsedMode ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md shrink-0 overflow-hidden border border-stone-200">
              <img src="/mrpl-logo.png" alt="MRPL Logo" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold text-[#1C1917] dark:text-white tracking-tight flex items-center gap-1 font-display">
                H₂S <span className="text-corp-accent">Guard</span>
              </h1>
              <p className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider truncate">
                {currentRoleLabel.subtitle}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md shrink-0 overflow-hidden border border-stone-200">
            <img src="/mrpl-logo.png" alt="MRPL Logo" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Toggle Button — Top Right of Sidebar Header */}
        {!isMobileView ? (
          <button
            onClick={toggleSidebarCollapsed}
            title={isCollapsedMode ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:text-[#1C1917] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0 ml-1"
          >
            {isCollapsedMode ? (
              <PanelLeftOpen className="w-5 h-5 text-corp-primary dark:text-corp-accent" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-corp-primary dark:text-corp-accent" />
            )}
          </button>
        ) : (
          <button
            onClick={closeMobileSidebar}
            className="p-2 rounded-xl text-stone-500 hover:text-[#1C1917] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scan Button — Only for Workers */}
      {currentRole === 'worker' && (
        <div className={isCollapsedMode ? 'p-2 flex justify-center' : 'p-4'}>
          {isCollapsedMode ? (
            <button
              onClick={openScanner}
              title="Scan Dosimeter"
              className="p-3 bg-corp-primary hover:bg-[#2E7D32] text-white rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <Scan className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-corp-hero py-3.5 text-sm tracking-wide bg-corp-primary hover:bg-[#2E7D32] border-none text-white"
              icon={<Scan className="w-5 h-5 stroke-[2.5]" />}
              onClick={() => {
                openScanner();
                if (isMobileView) closeMobileSidebar();
              }}
            >
              Scan Dosimeter
            </Button>
          )}
        </div>
      )}

      {/* User / Role Identity Card */}
      <div className={`${isCollapsedMode ? 'px-2' : 'px-4'} ${currentRole === 'worker' ? '' : 'pt-4'} mb-3`}>
        <div className={`bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 ${isCollapsedMode ? 'p-2 flex justify-center' : 'p-3 flex items-center gap-3'}`}>
          {currentRole === 'worker' ? (
            <>
              <img
                src={worker.avatarUrl}
                alt={worker.name}
                className="w-9 h-9 rounded-xl object-cover border-2 border-white dark:border-stone-700 shadow-sm shrink-0"
              />
              {!isCollapsedMode && (
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#1C1917] dark:text-white truncate">{worker.name}</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium truncate">
                    {worker.employeeId} • {worker.department}
                  </p>
                </div>
              )}
            </>
          ) : currentRole === 'supervisor' ? (
            <>
              <div className="w-9 h-9 rounded-xl bg-corp-primary text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                SK
              </div>
              {!isCollapsedMode && (
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#1C1917] dark:text-white truncate">Sanjay Kumar</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium truncate">Safety Lead • Team Alpha</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-corp-primary to-[#2E7D32] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              {!isCollapsedMode && (
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#1C1917] dark:text-white truncate">System Administrator</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium truncate">Chief Safety Officer</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsedMode ? 'px-2' : 'px-3'} space-y-1.5`}>
        {!isCollapsedMode && (
          <p className="px-3 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2">
            {currentRoleLabel.title}
          </p>
        )}
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={isCollapsedMode ? item.label : undefined}
              className={`w-full flex items-center ${isCollapsedMode ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'} rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-corp-primary text-white shadow-md'
                  : 'text-stone-600 dark:text-stone-400 hover:text-[#1C1917] dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-corp-accent'}>
                  {item.icon}
                </span>
                {!isCollapsedMode && <span>{item.label}</span>}
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive
                      ? 'bg-white text-corp-primary'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Expo App Download Widget */}
      <div className={`m-3 ${isCollapsedMode ? 'p-2 flex flex-col items-center justify-center' : 'p-3 bg-stone-900 dark:bg-stone-800 text-white rounded-2xl shadow-sm border border-stone-800 dark:border-stone-700'}`}>
        {isCollapsedMode ? (
          <button
            onClick={handleDownloadApk}
            title="Download Expo Android APK"
            className="p-2.5 bg-corp-primary hover:bg-[#2E7D32] text-white rounded-xl shadow cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="w-4 h-4 text-corp-accent shrink-0" />
              <span className="text-xs font-extrabold tracking-tight">Expo Mobile App</span>
            </div>
            <p className="text-[10px] text-stone-300 font-medium mb-2 leading-relaxed">
              Install natively on Android devices for offline camera &amp; QR scanning.
            </p>
            <button
              onClick={handleDownloadApk}
              className="w-full py-2 bg-corp-primary hover:bg-[#2E7D32] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download Android APK
            </button>
          </>
        )}
      </div>

      {/* Dosimeter Status — Only for Workers */}
      {currentRole === 'worker' && !isCollapsedMode && (
        <div className="p-3 m-3 bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-200/70 dark:border-emerald-800/50 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 truncate">Dosimeter Paired</span>
          </div>
          <p className="text-[11px] font-mono text-emerald-800 dark:text-emerald-400 font-semibold">
            {band.serialNumber}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-corp-card dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 shadow-corp-card h-screen sticky top-0 shrink-0 z-30 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-72 lg:w-80'
        }`}
      >
        {renderContent(isSidebarCollapsed, false)}
      </aside>

      {/* Mobile Slide-Over Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
            onClick={closeMobileSidebar}
          />

          {/* Drawer Content */}
          <div className="relative flex-1 max-w-xs w-full bg-white h-full shadow-2xl z-10 flex flex-col">
            {renderContent(false, true)}
          </div>
        </div>
      )}
    </>
  );
};
