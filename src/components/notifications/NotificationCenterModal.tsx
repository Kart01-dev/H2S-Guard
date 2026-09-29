import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { Button } from '../common/Button';
import {
  Bell, Check, ShieldAlert, AlertTriangle, Info, Clock, CheckCheck,
  UserCheck, Shield, Award, Filter, ExternalLink,
} from 'lucide-react';

export const NotificationCenterModal: React.FC = () => {
  const {
    notifications,
    isNotificationCenterOpen,
    closeNotificationCenter,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    setSelectedAlert,
    alerts,
  } = useApp();

  const [roleFilter, setRoleFilter] = useState<'all' | 'worker' | 'supervisor' | 'admin'>('all');

  if (!isNotificationCenterOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (roleFilter === 'all') return true;
    return n.recipientRole === roleFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getRoleBadge = (role: 'worker' | 'supervisor' | 'admin') => {
    switch (role) {
      case 'worker':
        return <span className="px-2 py-0.5 text-[10px] font-extrabold bg-stone-100 text-stone-700 rounded-md border border-stone-200 uppercase tracking-wider">Worker</span>;
      case 'supervisor':
        return <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#590D22]/10 text-[#590D22] rounded-md border border-[#590D22]/20 uppercase tracking-wider">Supervisor</span>;
      case 'admin':
        return <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#E63946]/10 text-[#E63946] rounded-md border border-[#E63946]/20 uppercase tracking-wider">Admin</span>;
    }
  };

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationAsRead(n.id);
    closeNotificationCenter();

    if (n.alertId) {
      const foundAlert = alerts.find((a) => a.id === n.alertId);
      if (foundAlert) {
        setSelectedAlert(foundAlert);
      }
      setActiveTab('alerts');
    }
  };

  return (
    <BottomSheet isOpen={isNotificationCenterOpen} onClose={closeNotificationCenter} title="Notification Center">
      <div className="space-y-4">
        {/* Top Actions & Summary */}
        <div className="flex items-center justify-between bg-[#FAF4ED] p-3 rounded-2xl border border-[#590D22]/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white rounded-xl text-[#590D22] shadow-sm">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1C1917]">
                {unreadCount > 0 ? `${unreadCount} Unread Notifications` : 'All Caught Up'}
              </p>
              <p className="text-[10px] text-stone-500">Real-time incident & shift alerts</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs font-bold text-[#E63946] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark All Read
            </button>
          )}
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'worker', label: 'Worker' },
            { id: 'supervisor', label: 'Supervisor' },
            { id: 'admin', label: 'Admin' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setRoleFilter(id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
                roleFilter === id
                  ? 'bg-[#590D22] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3.5 rounded-2xl border text-xs transition-all cursor-pointer relative ${
                  !n.read
                    ? 'bg-white border-[#E63946]/30 shadow-warm-card'
                    : 'bg-stone-50/80 border-stone-200 opacity-80'
                }`}
              >
                {!n.read && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-[#E63946] animate-pulse" />
                )}

                <div className="flex items-center gap-2 mb-1.5 pr-4">
                  {getRoleBadge(n.recipientRole)}
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="font-extrabold text-[#1C1917] mb-0.5 flex items-center gap-1.5">
                  {n.type === 'incident' && <ShieldAlert className="w-3.5 h-3.5 text-[#E63946]" />}
                  {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                  {n.type === 'info' && <Info className="w-3.5 h-3.5 text-[#590D22]" />}
                  <span>{n.title}</span>
                </h4>

                <p className="text-stone-600 leading-relaxed text-[11px]">{n.message}</p>

                {n.alertId && (
                  <div className="mt-2 text-[10px] font-bold text-[#590D22] flex items-center gap-1">
                    <span>View Alert Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-stone-400 text-xs">
            No notifications found for this role filter.
          </div>
        )}

        <Button variant="burgundy" className="w-full font-bold" onClick={closeNotificationCenter}>
          Close Notification Center
        </Button>
      </div>
    </BottomSheet>
  );
};
