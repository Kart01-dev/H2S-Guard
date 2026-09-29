import React, { useState } from 'react';
import { Flame, ShieldAlert, CheckCircle2, Clock, Plus, UserCheck, MessageSquare, Send } from 'lucide-react';
import { adminIncidents, AdminIncident } from '../../data/adminMockData';

interface IncidentsSectionProps {
  selectedIncidentId?: string | null;
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const IncidentsSection: React.FC<IncidentsSectionProps> = ({ selectedIncidentId, addToast }) => {
  const [incidentsList, setIncidentsList] = useState<AdminIncident[]>(adminIncidents);
  const [activeIncidentId, setActiveIncidentId] = useState<string>(
    selectedIncidentId || adminIncidents[0]?.id || ''
  );
  const [newNote, setNewNote] = useState('');

  const currentIncident = incidentsList.find((i) => i.id === activeIncidentId) || incidentsList[0];

  const handleUpdateStatus = (incidentId: string, newStatus: 'OPEN' | 'INVESTIGATING' | 'RESOLVED') => {
    setIncidentsList((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const updatedTimeline = [
            ...inc.timeline,
            {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              action: `Incident status updated to ${newStatus}`,
              by: 'Safety Supervisor',
            },
          ];
          return { ...inc, status: newStatus, timeline: updatedTimeline };
        }
        return inc;
      })
    );

    addToast({
      type: newStatus === 'RESOLVED' ? 'success' : 'info',
      title: `Incident ${incidentId} Updated`,
      description: `Status changed to ${newStatus}. Log updated in compliance registry.`,
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !currentIncident) return;

    setIncidentsList((prev) =>
      prev.map((inc) => {
        if (inc.id === currentIncident.id) {
          return { ...inc, notes: [...inc.notes, newNote.trim()] };
        }
        return inc;
      })
    );

    addToast({
      type: 'success',
      title: 'Investigation Note Added',
      description: `Appended note to incident ${currentIncident.id}.`,
    });

    setNewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Safety Incident Escalation & Response Registry
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            OSHA incident tracking, supervisor investigation timelines, medical clearances, and Root Cause Analysis (RCA).
          </p>
        </div>

        <button
          onClick={() => {
            addToast({
              type: 'warning',
              title: 'Manual Incident Created',
              description: 'Created new manual safety incident file INC-2026-042.',
            });
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#E63946] hover:bg-[#D62828] rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Log New Incident
        </button>
      </div>

      {/* Main 2-Column Incident Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Incidents */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
            Incidents Directory ({incidentsList.length})
          </h3>

          {incidentsList.map((inc) => {
            const isSelected = inc.id === activeIncidentId;
            const isOpen = inc.status === 'OPEN';
            const isInvestigating = inc.status === 'INVESTIGATING';

            return (
              <div
                key={inc.id}
                onClick={() => setActiveIncidentId(inc.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF4ED] border-[#590D22] shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-extrabold text-xs text-[#590D22]">
                    {inc.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase ${
                      isOpen
                        ? 'bg-red-600 text-white animate-pulse'
                        : isInvestigating
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-[#1C1917]">{inc.workerName}</h4>
                <p className="text-xs text-stone-500 font-medium truncate mt-0.5">{inc.location}</p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-200/60 text-xs">
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(inc.timestamp).toLocaleDateString()}
                  </span>
                  <span className="font-mono font-black text-red-600">
                    {inc.exposure} ppm·h
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Incident Record */}
        {currentIncident && (
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            {/* Header banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-[#E63946] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                    {currentIncident.id}
                  </span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs font-bold text-stone-600">{currentIncident.severity.toUpperCase()} SEVERITY</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#1C1917] mt-1">
                  High Exposure Event: {currentIncident.workerName}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">{currentIncident.location}</p>
              </div>

              {/* Status Update Buttons */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => handleUpdateStatus(currentIncident.id, 'OPEN')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    currentIncident.status === 'OPEN' ? 'bg-red-600 text-white shadow-sm' : 'text-stone-600'
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => handleUpdateStatus(currentIncident.id, 'INVESTIGATING')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    currentIncident.status === 'INVESTIGATING' ? 'bg-amber-500 text-white shadow-sm' : 'text-stone-600'
                  }`}
                >
                  Investigating
                </button>
                <button
                  onClick={() => handleUpdateStatus(currentIncident.id, 'RESOLVED')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    currentIncident.status === 'RESOLVED' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-600'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl">
                <span className="text-[10px] font-bold text-red-800 uppercase block">Recorded Peak Exposure</span>
                <span className="text-xl font-black text-red-600 font-mono">{currentIncident.exposure} ppm·h</span>
              </div>
              <div className="p-3 bg-[#FAF4ED] border border-[#590D22]/10 rounded-xl">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Assigned Supervisor</span>
                <span className="text-xs font-extrabold text-[#1C1917]">{currentIncident.assignedSupervisor}</span>
              </div>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Associated Reading ID</span>
                <span className="text-xs font-mono font-bold text-[#590D22]">{currentIncident.readingId}</span>
              </div>
            </div>

            {/* Incident Notes */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#1C1917] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#E63946]" />
                Supervisor Investigation Notes
              </h4>
              <div className="space-y-2">
                {currentIncident.notes.map((note, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-medium">
                    {note}
                  </div>
                ))}
              </div>

              {/* Add Note Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add supervisor note or medical clearance update..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  className="flex-1 px-3 py-2 text-xs bg-[#FAF4ED] border border-[#590D22]/15 rounded-xl text-[#1C1917] focus:outline-none focus:border-[#E63946]"
                />
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-[#590D22] hover:bg-[#400918] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Add Note
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <h4 className="text-xs font-extrabold text-[#1C1917] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#590D22]" />
                Audit Trail & Response Timeline
              </h4>

              <div className="space-y-2.5 relative pl-4 border-l-2 border-stone-200">
                {currentIncident.timeline.map((tl, i) => (
                  <div key={i} className="relative text-xs">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#E63946]" />
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1C1917] text-[11px]">{tl.time}</span>
                      <span className="text-stone-400">•</span>
                      <span className="font-bold text-stone-700">{tl.action}</span>
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">By: {tl.by}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
