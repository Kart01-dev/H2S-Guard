import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Scan, Plus, Headphones } from 'lucide-react';

export const FAB: React.FC = () => {
  const { openScanner, currentRole } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 flex flex-col items-end gap-3">
      {/* Sub-actions */}
      <div 
        className={`flex flex-col items-end gap-3 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <button 
          className="flex items-center gap-3 group"
          onClick={() => {
            window.location.href = "mailto:support@mrpl.co.in";
          }}
        >
          <span className="bg-stone-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">Contact Support</span>
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 shadow-md flex items-center justify-center hover:bg-stone-200 transition-colors">
            <Headphones className="w-5 h-5" />
          </div>
        </button>
        
        <button 
          className="flex items-center gap-3 group"
          onClick={() => {
            alert("Emergency Protocol Activated - Notifying Central Command");
          }}
        >
          <span className="bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">Emergency Alert</span>
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 shadow-md flex items-center justify-center hover:bg-red-200 transition-colors">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </button>

        {currentRole === 'worker' && (
          <button 
            className="flex items-center gap-3 group"
            onClick={() => {
              setIsOpen(false);
              openScanner();
            }}
          >
            <span className="bg-corp-primary text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">Quick Scan</span>
            <div className="w-10 h-10 rounded-full bg-corp-light text-corp-primary shadow-md flex items-center justify-center hover:bg-stone-200 transition-colors">
              <Scan className="w-5 h-5" />
            </div>
          </button>
        )}
      </div>

      {/* Main Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-corp-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-stone-800 text-white rotate-45' : 'bg-corp-primary text-white hover:bg-[#2E7D32]'
        }`}
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
