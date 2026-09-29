import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { FAB } from './FAB';
import { ToastContainer } from '../common/Toast';
import { CameraScannerModal } from '../scanner/CameraScannerModal';
import { NotificationCenterModal } from '../notifications/NotificationCenterModal';
import { DemoModeWidget } from '../common/DemoModeWidget';
import { useApp } from '../../context/AppContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isDarkMode } = useApp();
  
  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans selection:bg-corp-primary selection:text-white bg-corp-light text-corp-dark bg-corp-blob-1 bg-corp-blob-2 bg-fixed transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Toast Manager */}
      <ToastContainer />

      {/* Camera Scanner Modal Overlay */}
      <CameraScannerModal />

      {/* Notification Center Modal */}
      <NotificationCenterModal />

      {/* Demo Controls Widget */}
      <DemoModeWidget />

      {/* Desktop Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 md:py-10 max-w-7xl w-full mx-auto flex flex-col">
          {children}
        </main>

        <Footer />
      </div>

      {/* Floating Action Button */}
      <FAB />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
