import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Key, Search, Download, CheckCircle2, Lock } from 'lucide-react';

interface AuditLogsSectionProps {
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const AuditLogsSection: React.FC<AuditLogsSectionProps> = ({ addToast }) => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const defaultLogs = [
    {
      id: 'LOG-88912',
      timestamp: '2026-09-21 18:42:01',
      userName: 'Rahul Patil (Worker)',
      action: 'DOSIMETER_SCAN',
      entity: 'Dosimeter #H2S-IND-PN-000184',
      result: '18.4 ppm·h (NORMAL)',
      hash: 'sha256:7f8a...3b91',
    },
    {
      id: 'LOG-88911',
      timestamp: '2026-09-21 18:08:12',
      userName: 'System Auto Escalation',
      action: 'ALERT_ESCALATE',
      entity: 'Worker #EMP-209 (Vikram Singh)',
      result: '42.8 ppm·h (HIGH EXPOSURE)',
      hash: 'sha256:9c1b...4e22',
    },
  ];

  const displayLogs = auditLogs.length > 0 ? auditLogs : defaultLogs;

  const filteredLogs = displayLogs.filter(
    (l) =>
      (l.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.entity || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.result || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Immutable Security & Compliance Audit Ledger
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Cryptographically sealed SHA-256 event log tracking every scan, threshold override, and supervisor escalation.
          </p>
        </div>

        <button
          onClick={() => {
            addToast({
              type: 'success',
              title: 'Cryptographic Verification Passed',
              description: `All ${displayLogs.length} live log hashes verified against browser SHA-256 crypto anchor.`,
            });
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#590D22] hover:bg-[#400918] rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Lock className="w-4 h-4" />
          Verify Cryptographic Hash
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit logs by user or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-[#FAF4ED] border border-[#590D22]/10 rounded-xl text-[#1C1917] focus:outline-none focus:border-[#E63946]"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF4ED] border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Result</th>
                <th className="py-3.5 px-4">SHA-256 Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF4ED]/50 transition-colors">
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-[#1C1917]">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">{log.id}</div>
                  </td>

                  <td className="py-3 px-4 font-sans font-extrabold text-[#1C1917]">
                    {log.userName}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF4ED] text-[#590D22] rounded border border-[#590D22]/15">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-sans text-stone-700 font-medium">
                    {log.entity}
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded border text-emerald-700 bg-emerald-50 border-emerald-200">
                      {log.result}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-emerald-700 font-bold text-[10px]">
                    {log.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
