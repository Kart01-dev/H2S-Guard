import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { BottomSheet } from '../common/BottomSheet';
import type { AlertItem } from '../../types';
import {
  AlertTriangle, AlertCircle, Info, CheckCircle2, MapPin, Clock,
  Check, Bell, ArrowRight, ShieldCheck, Flame, UserCheck, Shield,
  BookOpen, Eye, ExternalLink, RefreshCw, AlertOctagon, ChevronRight,
  Radio, CheckCheck, Timeline,
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    simulateSupervisorAcknowledge,
    simulateEscalationTimeout,
    selectedAlert,
    setSelectedAlert,
    setSelectedReading,
    readings,
    setActiveTab,
    currentRole,
    worker,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all');
  const [showSafetySheet, setShowSafetySheet] = useState(false);

  /* ── Role-based data scoping ── */
  const scopedAlerts = currentRole === 'worker'
    ? alerts.filter((a) => a.workerName === worker.name || !a.workerName)
    : alerts; // supervisor/admin see all

  const filteredAlerts = scopedAlerts.filter((a) => {
    if (filter === 'unacknowledged') return !a.acknowledged;
    if (filter === 'acknowledged') return a.acknowledged;
    return true;
  });

  const unreadCount = scopedAlerts.filter((a) => !a.acknowledged).length;

  const handleAlertClick = (alert: AlertItem) => {
    setSelectedAlert(alert);
  };

  const getSeverityBadge = (severity: 'info' | 'warning' | 'critical') => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold bg-red-100 text-red-800 rounded-full border border-red-200 flex items-center gap-1 shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" /> CRITICAL HAZARD
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200 flex items-center gap-1 shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> ATTENTION REQUIRED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold bg-stone-100 text-stone-700 rounded-full border border-stone-200 flex items-center gap-1 shrink-0">
            <Info className="w-3.5 h-3.5 text-stone-500" /> INVALID SCAN
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
              Alerts
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-extrabold bg-[#E63946] text-white rounded-full border-2 border-white animate-pulse shadow-sm">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 font-semibold mt-0.5">
            Real-time threshold breaches, supervisor escalation tracking &amp; incident management
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-stone-200 shadow-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#590D22] text-white'
                : 'text-stone-600 hover:text-[#1C1917]'
            }`}
          >
            All ({scopedAlerts.length})
          </button>
          <button
            onClick={() => setFilter('unacknowledged')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'unacknowledged'
                ? 'bg-[#E63946] text-white'
                : 'text-stone-600 hover:text-[#1C1917]'
            }`}
          >
            Action Required ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('acknowledged')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'acknowledged'
                ? 'bg-[#590D22] text-white'
                : 'text-stone-600 hover:text-[#1C1917]'
            }`}
          >
            Acknowledged
          </button>
        </div>
      </div>

      {/* ── ALERTS LIST ── */}
      {filteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';

            return (
              <Card
                key={alert.id}
                variant="white"
                onClick={() => handleAlertClick(alert)}
                className={`border-l-4 transition-all cursor-pointer hover:shadow-warm-lg ${
                  isCritical
                    ? 'border-l-red-500 bg-white'
                    : isWarning
                    ? 'border-l-amber-500 bg-white'
                    : 'border-l-stone-400 bg-stone-50/70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getSeverityBadge(alert.severity)}

                      {/* Escalation Status Tag */}
                      {alert.escalationState === 'supervisor_acknowledged' || alert.acknowledged ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged by Supervisor
                        </span>
                      ) : alert.escalationState === 'escalated_to_expert' ? (
                        <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-purple-300">
                          <AlertOctagon className="w-3.5 h-3.5 text-purple-600" /> Escalated to Expert Team
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[#E63946] bg-red-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-red-200 animate-pulse">
                          <Radio className="w-3 h-3 text-[#E63946]" /> Supervisor Notified
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-[#1C1917] tracking-tight flex items-center gap-2">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-stone-700 font-medium leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-stone-500 font-semibold pt-1">
                      {alert.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
                          {alert.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-[#590D22] flex items-center gap-1">
                      Details <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<CheckCircle2 className="w-8 h-8 text-emerald-600" />}
          title="No Active Alerts"
          description="All safety alerts have been reviewed and logged to the compliance registry."
        />
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HIGH EXPOSURE ALERT DETAIL MODAL
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {selectedAlert && (
        <BottomSheet
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title={selectedAlert.severity === 'critical' ? '🚨 H₂S Exposure Alert' : 'Alert Detail'}
        >
          <div className="space-y-5 text-sm">

            {/* Alert Header Box */}
            <div className={`p-4 rounded-2xl border ${
              selectedAlert.severity === 'critical'
                ? 'bg-red-50 border-red-200 text-red-900'
                : selectedAlert.severity === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-stone-100 border-stone-200 text-stone-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  {selectedAlert.severity === 'critical' ? 'High Exposure Hazard Detected' : 'Safety Notice'}
                </span>
                <span className="text-xs font-mono font-bold">
                  {new Date(selectedAlert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              </div>
              <p className="text-xs font-semibold mt-1.5 leading-relaxed">
                {selectedAlert.message}
              </p>
            </div>

            {/* Structured Alert Fields */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-stone-500 font-bold block">Exposure Dose</span>
                <span className="text-2xl font-black font-mono text-[#1C1917] mt-0.5 block">
                  {selectedAlert.exposureDosePpmH || 42.8} <span className="text-xs font-bold text-stone-500">ppm·h</span>
                </span>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-stone-500 font-bold block">Detection Time</span>
                <span className="text-base font-extrabold text-[#1C1917] mt-1 block font-mono">
                  {new Date(selectedAlert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-stone-500 font-bold block">Dosimeter Band</span>
                <span className="text-xs font-mono font-bold text-[#590D22] mt-1 block">
                  H2S-IND-PN-000184
                </span>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-stone-500 font-bold block">Supervisor Status</span>
                <span className={`text-xs font-extrabold mt-1 block ${
                  selectedAlert.escalationState === 'supervisor_acknowledged' || selectedAlert.acknowledged
                    ? 'text-emerald-700'
                    : selectedAlert.escalationState === 'escalated_to_expert'
                    ? 'text-purple-700'
                    : 'text-[#E63946]'
                }`}>
                  {selectedAlert.escalationState === 'supervisor_acknowledged' || selectedAlert.acknowledged
                    ? 'Acknowledged ✓'
                    : selectedAlert.escalationState === 'escalated_to_expert'
                    ? 'Escalated to Expert Team'
                    : 'Notified ✓'}
                </span>
              </div>
            </div>

            {/* Action Buttons: View Reading & View Instructions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                variant="outline"
                className="font-bold text-xs py-3"
                icon={<Eye className="w-4 h-4 text-[#590D22]" />}
                onClick={() => {
                  const matchingReading = readings.find(r => r.id === selectedAlert.readingId) || readings[0];
                  setSelectedReading(matchingReading);
                  setSelectedAlert(null);
                  setActiveTab('history');
                }}
              >
                View Reading
              </Button>

              <Button
                variant="burgundy"
                className="font-bold text-xs py-3"
                icon={<BookOpen className="w-4 h-4" />}
                onClick={() => setShowSafetySheet(true)}
              >
                View Instructions
              </Button>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SUPERVISOR ESCALATION TIMELINE & SIMULATION
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="bg-[#FAF4ED] p-4 rounded-3xl border border-[#590D22]/15 space-y-3">
              <div className="flex items-center justify-between border-b border-[#590D22]/10 pb-2">
                <span className="text-xs font-extrabold text-[#590D22] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#E63946]" />
                  Supervisor Escalation Lifecycle
                </span>
                <span className="text-[10px] font-mono text-stone-500 font-bold">Industrial Protocol</span>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-3 relative pl-3 border-l-2 border-[#590D22]/20 my-2">
                {/* Step 1: Detected */}
                <div className="relative pl-4">
                  <span className="absolute -left-[19px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-extrabold text-[#1C1917]">Reading detected</span>
                    <span className="font-mono text-stone-500 text-[10px]">
                      {new Date(selectedAlert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-semibold">{selectedAlert.exposureDosePpmH || 42.8} ppm·h registered on wristband</p>
                </div>

                {/* Step 2: Worker Notified */}
                <div className="relative pl-4">
                  <span className="absolute -left-[19px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-extrabold text-[#1C1917]">Worker notified</span>
                    <span className="font-mono text-stone-500 text-[10px]">
                      {new Date(selectedAlert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-semibold">In-app safety alert &amp; instructions rendered</p>
                </div>

                {/* Step 3: Supervisor Notified */}
                <div className="relative pl-4">
                  <span className="absolute -left-[19px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-extrabold text-[#1C1917]">Supervisor notified</span>
                    <span className="font-mono text-stone-500 text-[10px]">
                      {new Date(selectedAlert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-semibold">Pushed to Sanjay Kumar (Safety Lead)</p>
                </div>

                {/* Step 4: Acknowledgement OR Escalation */}
                <div className="relative pl-4">
                  {selectedAlert.escalationState === 'supervisor_acknowledged' || selectedAlert.acknowledged ? (
                    <>
                      <span className="absolute -left-[19px] top-0.5 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white" />
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-extrabold text-emerald-800">Supervisor acknowledged</span>
                        <span className="font-mono text-emerald-700 text-[10px]">
                          {selectedAlert.acknowledgedAt ? new Date(selectedAlert.acknowledgedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '18:44'}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-bold">Alert acknowledged by Safety Supervisor Sanjay Kumar</p>
                    </>
                  ) : selectedAlert.escalationState === 'escalated_to_expert' ? (
                    <>
                      <span className="absolute -left-[19px] top-0.5 w-3 h-3 rounded-full bg-purple-600 border-2 border-white animate-ping" />
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-extrabold text-purple-900">Escalated to Expert Safety Team</span>
                        <span className="font-mono text-purple-700 text-[10px]">
                          {selectedAlert.escalatedAt ? new Date(selectedAlert.escalatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '18:47'}
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-800 font-bold">No supervisor sign-off in 5 mins → Dispatched to Site Safety Commander</p>
                    </>
                  ) : (
                    <>
                      <span className="absolute -left-[19px] top-0.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-white animate-pulse" />
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-extrabold text-amber-900">Awaiting Supervisor Response</span>
                        <span className="font-mono text-amber-700 text-[10px]">Active 5m Timer</span>
                      </div>
                      <p className="text-[11px] text-amber-800 font-semibold">Pending sign-off from Sanjay Kumar</p>
                    </>
                  )}
                </div>
              </div>

              {/* Simulation Controls for Testing */}
              <div className="pt-2 border-t border-[#590D22]/10 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  Simulate Industrial Workflow Actions:
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs font-bold"
                    icon={<UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    onClick={() => simulateSupervisorAcknowledge(selectedAlert.id)}
                  >
                    Simulate Supervisor Acknowledge
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs font-bold border-purple-300 text-purple-800 hover:bg-purple-50"
                    icon={<AlertOctagon className="w-3.5 h-3.5 text-purple-600" />}
                    onClick={() => simulateEscalationTimeout(selectedAlert.id)}
                  >
                    Simulate 5-min Timeout (Escalate)
                  </Button>

                  {!selectedAlert.resolved && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                      icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      onClick={() => {
                        resolveAlert(selectedAlert.id, 'Incident reviewed and resolved by supervisor.');
                        setSelectedAlert(null);
                      }}
                    >
                      Resolve Incident
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="burgundy"
              className="w-full font-bold"
              onClick={() => setSelectedAlert(null)}
            >
              Close Detail
            </Button>
          </div>
        </BottomSheet>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SAFETY INSTRUCTIONS SHEET
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <BottomSheet isOpen={showSafetySheet} onClose={() => setShowSafetySheet(false)} title="High Exposure — Safety Instructions">
        <div className="space-y-4 text-sm">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="font-bold text-red-800 leading-relaxed">
              Your cumulative H₂S exposure has exceeded safe shift thresholds. Follow the steps below immediately.
            </p>
          </div>
          {[
            { step: '1', text: 'Exit the hazardous area and move to the designated safe zone.' },
            { step: '2', text: 'Inform your supervisor (Sanjay Kumar) and safety officer immediately.' },
            { step: '3', text: 'Complete a medical self-assessment and report any symptoms (headache, dizziness, nausea).' },
            { step: '4', text: 'Do not return to the work area until authorised by your safety officer.' },
            { step: '5', text: 'Retain your dosimeter wristband (H2S-IND-PN-000184) for optical verification.' },
          ].map(({ step, text }) => (
            <div key={step} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#590D22] text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                {step}
              </div>
              <p className="text-stone-700 font-semibold leading-relaxed">{text}</p>
            </div>
          ))}
          <div className="bg-stone-100 rounded-2xl px-4 py-3 text-xs text-stone-500 border border-stone-200">
            <Shield className="w-4 h-4 text-[#590D22] inline-block mr-1 -mt-0.5" />
            This information is an industrial safety protocol guide only. Always follow site emergency response guidelines.
          </div>
          <Button variant="danger" className="w-full font-bold" onClick={() => setShowSafetySheet(false)}>
            Understood
          </Button>
        </div>
      </BottomSheet>

    </div>
  );
};
