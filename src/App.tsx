import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { HomeView } from './components/views/HomeView';
import { HistoryView } from './components/views/HistoryView';
import { AlertsView } from './components/views/AlertsView';
import { ProfileView } from './components/views/ProfileView';
import { DashboardView } from './components/views/DashboardView';

/* ── Route Guard: ensures the active tab is valid for the current role ── */
const MainContent: React.FC = () => {
  const { activeTab, currentRole, setActiveTab } = useApp();

  /* ── Allowed tabs per role ── */
  const allowedTabs: Record<string, string[]> = {
    worker: ['home', 'history', 'alerts', 'profile'],
    supervisor: ['dashboard', 'alerts', 'profile'],
    admin: ['dashboard', 'alerts', 'profile'],
  };

  const allowed = allowedTabs[currentRole] || allowedTabs.worker;

  /* If the active tab is NOT allowed for this role, redirect silently */
  if (!allowed.includes(activeTab)) {
    // Use a timeout to avoid setting state during render
    setTimeout(() => {
      setActiveTab(currentRole === 'worker' ? 'home' : 'dashboard');
    }, 0);
    // Render the default view while the redirect happens
    return currentRole === 'worker' ? <HomeView /> : <DashboardView />;
  }

  switch (activeTab) {
    case 'home':
      return <HomeView />;
    case 'history':
      return <HistoryView />;
    case 'alerts':
      return <AlertsView />;
    case 'profile':
      return <ProfileView />;
    case 'dashboard':
      return <DashboardView />;
    default:
      return <HomeView />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <AppLayout>
        <MainContent />
      </AppLayout>
    </AppProvider>
  );
}
