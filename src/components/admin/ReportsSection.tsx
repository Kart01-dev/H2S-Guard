import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, Calendar, Filter, CheckCircle2 } from 'lucide-react';
import { generateMRPLReport } from '../../utils/pdfGenerator';
import { adminReadings } from '../../data/adminMockData';

interface ReportsSectionProps {
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({ addToast }) => {
  const [reportType, setReportType] = useState('OSHA_1910');

  const handleGenerateReport = () => {
    // Generate dummy data based on adminReadings
    const columns = ['Timestamp', 'Worker', 'Dosimeter ID', 'Exposure (ppm·h)', 'Status', 'Location'];
    const data = adminReadings.map(r => [
      r.timestamp,
      r.workerName,
      r.bandId,
      r.exposure.toString(),
      r.status,
      r.location
    ]);

    const titleMap: Record<string, string> = {
      'OSHA_1910': 'OSHA 1910.1000 H2S Compliance Audit',
      'NIOSH_REL': 'NIOSH REL Cumulative Exposure Audit',
      'SHIFT_BRIEF': '24-Hour Shift Exposure Briefing',
      'FLEET_HEALTH': 'Dosimeter Fleet Calibration Log'
    };

    generateMRPLReport(titleMap[reportType] || 'Safety Report', data, columns);

    addToast({
      type: 'success',
      title: 'Compliance Report Generated',
      description: 'Downloaded audit-ready PDF formatted to MRPL standard.',
    });
  };

  const reportsList = [
    {
      id: 'REP-2026-0921',
      title: 'OSHA 1910.1000 H₂S Dosimetry Compliance Audit',
      type: 'OSHA Standard',
      date: '21 Sep 2026',
      status: 'AUDIT READY',
      size: '2.4 MB',
    },
    {
      id: 'REP-2026-0920',
      title: 'Daily Executive Plant Exposure Summary',
      type: 'Executive Briefing',
      date: '20 Sep 2026',
      status: 'VERIFIED',
      size: '1.8 MB',
    },
    {
      id: 'REP-2026-0919',
      title: 'Sector B High Exposure Incident Incident Audit',
      type: 'Incident Investigation',
      date: '19 Sep 2026',
      status: 'SIGNED OFF',
      size: '3.1 MB',
    },
    {
      id: 'REP-2026-0915',
      title: 'Passive Substrate Expiration & Calibration Log',
      type: 'Quality Control',
      date: '15 Sep 2026',
      status: 'ARCHIVED',
      size: '1.2 MB',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Compliance & Executive Report Generator
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Generate regulatory compliance documentation, OSHA 1910.1000 audit logs, and plant executive briefing PDFs.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#590D22] hover:bg-[#400918] rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Generate New Audit Report
        </button>
      </div>

      {/* Generator Form Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-[#1C1917] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#E63946]" />
          Custom Regulatory Report Builder
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-600 block mb-1">Select Report Template</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-[#FAF4ED] border border-[#590D22]/15 rounded-xl px-3 py-2 text-xs font-bold text-[#1C1917] focus:outline-none"
            >
              <option value="OSHA_1910">OSHA 1910.1000 H₂S Permissible Limit Audit</option>
              <option value="NIOSH_REL">NIOSH REL Cumulative Exposure Audit</option>
              <option value="SHIFT_BRIEF">24-Hour Shift Exposure Briefing</option>
              <option value="FLEET_HEALTH">Dosimeter Fleet Calibration & Expiry Log</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-600 block mb-1">Time Horizon</label>
            <select className="w-full bg-[#FAF4ED] border border-[#590D22]/15 rounded-xl px-3 py-2 text-xs font-bold text-[#1C1917] focus:outline-none">
              <option>Today (21 Sep 2026)</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date (2026)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-600 block mb-1">Export Format</label>
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={handleGenerateReport}
                className="flex-1 py-2 text-xs font-bold bg-[#E63946] text-white rounded-xl hover:bg-[#D62828] transition-all cursor-pointer text-center"
              >
                PDF (Official Seal)
              </button>
              <button
                onClick={handleGenerateReport}
                className="flex-1 py-2 text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl transition-all cursor-pointer text-center"
              >
                CSV / Raw Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Previously Generated Reports List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3 p-5">
        <h3 className="text-sm font-extrabold text-[#1C1917]">
          Archived & Verified Compliance Audits
        </h3>

        <div className="divide-y divide-stone-100">
          {reportsList.map((rep) => (
            <div key={rep.id} className="py-3 flex items-center justify-between gap-4 hover:bg-[#FAF4ED]/40 transition-colors rounded-xl px-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF4ED] border border-[#590D22]/15 flex items-center justify-center text-[#590D22] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#1C1917]">{rep.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                    <span className="font-mono">{rep.id}</span>
                    <span>•</span>
                    <span>{rep.date}</span>
                    <span>•</span>
                    <span>{rep.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  {rep.status}
                </span>
                <button
                  onClick={handleGenerateReport}
                  className="p-2 text-stone-600 hover:text-[#E63946] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
