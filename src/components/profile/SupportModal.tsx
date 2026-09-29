import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { Button } from '../common/Button';
import {
  HelpCircle, Shield, PhoneCall, Mail, MessageSquare, AlertCircle, CheckCircle2,
  FileText, Send, Wrench, Sparkles, BookOpen,
} from 'lucide-react';

export const SupportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'contacts' | 'guide' | 'report'>('contacts');

  const [issueCategory, setIssueCategory] = useState('optical_glare');
  const [issueMessage, setIssueMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast({
      type: 'success',
      title: 'Field Ticket Logged',
      description: 'Issue report sent to Safety Tech Team (Ticket #SUP-8842).',
    });
    setTimeout(() => {
      setSubmitted(false);
      setIssueMessage('');
      onClose();
    }, 1200);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Help & Field Support">
      <div className="space-y-4 text-sm">

        {/* Sub Tabs */}
        <div className="flex items-center gap-1 bg-[#FAF4ED] p-1 rounded-2xl border border-[#590D22]/10">
          {[
            { id: 'contacts', label: 'Support Contacts' },
            { id: 'guide', label: 'Dosimeter Help' },
            { id: 'report', label: 'Report an Issue' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveSubTab(id as any)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSubTab === id ? 'bg-[#590D22] text-white shadow-xs' : 'text-stone-600 hover:text-[#1C1917]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── SUB TAB 1: CONTACTS ── */}
        {activeSubTab === 'contacts' && (
          <div className="space-y-3">
            {/* Safety Team */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-warm-card space-y-2">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-extrabold text-[#1C1917] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#E63946]" /> Safety Team (Plant Sector 4)
                </span>
                <span className="text-[10px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
                  24/7 On-Duty
                </span>
              </div>
              <div className="text-xs space-y-1 text-stone-600">
                <p><strong className="text-[#1C1917]">Safety Lead:</strong> Sanjay Kumar (H₂S Field Safety Officer)</p>
                <p><strong className="text-[#1C1917]">Radio Channel:</strong> Channel 4 (Emergency H₂S Line)</p>
                <p><strong className="text-[#1C1917]">Internal Extension:</strong> <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-[#590D22] font-bold">#4401</code></p>
                <p><strong className="text-[#1C1917]">Internal Email:</strong> safety.sector4@plant.internal</p>
              </div>
            </div>

            {/* Technical Support */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-warm-card space-y-2">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-extrabold text-[#1C1917] flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#590D22]" /> Technical Support &amp; Calibration
                </span>
                <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                  Shift Hours
                </span>
              </div>
              <div className="text-xs space-y-1 text-stone-600">
                <p><strong className="text-[#1C1917]">Field Help Desk:</strong> H₂S Guard Optical System Team</p>
                <p><strong className="text-[#1C1917]">Internal Extension:</strong> <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-[#590D22] font-bold">#8008</code></p>
                <p><strong className="text-[#1C1917]">Internal Email:</strong> support@h2sguard.internal</p>
              </div>
            </div>
          </div>
        )}

        {/* ── SUB TAB 2: DOSIMETER HELP GUIDE ── */}
        {activeSubTab === 'guide' && (
          <div className="space-y-3 text-xs">
            <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#590D22]/10 space-y-2">
              <h4 className="font-extrabold text-[#590D22] text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Optical Camera Scan Best Practices
              </h4>
              <p className="text-stone-700 leading-relaxed font-medium">
                Follow these guidelines to avoid invalid scans and ensure maximum dose estimation confidence:
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2.5">
              {[
                { title: '1. Position inside frame', text: 'Hold camera 15-20 cm from wristband until the outer frame turns green.' },
                { title: '2. Avoid direct glare', text: 'Tilt wristband slightly away from direct overhead sun or harsh spotlight.' },
                { title: '3. Keep matrix clean', text: 'Wipe dust or moisture off the colorimetric pad prior to capturing.' },
                { title: '4. Verify QR band code', text: 'Ensure the QR code alongside the color pad is un-obscured.' },
              ].map((g) => (
                <div key={g.title} className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                  <p className="font-bold text-[#1C1917]">{g.title}</p>
                  <p className="text-stone-500 mt-0.5">{g.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SUB TAB 3: REPORT AN ISSUE ── */}
        {activeSubTab === 'report' && (
          <form onSubmit={handleSubmitIssue} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#1C1917] block mb-1">Issue Category</label>
              <select
                value={issueCategory}
                onChange={e => setIssueCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-[#1C1917]"
              >
                <option value="optical_glare">Optical Camera Glare / Rescan Failure</option>
                <option value="band_damage">Physical Wristband Damage / Stain</option>
                <option value="sync_delay">Cloud Sync / Notification Delay</option>
                <option value="other">Other Field Issue</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1C1917] block mb-1">Issue Description</label>
              <textarea
                rows={3}
                required
                placeholder="Describe what happened in the field..."
                value={issueMessage}
                onChange={e => setIssueMessage(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#E63946] focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full font-bold shadow-warm-hero"
              isLoading={submitted}
              icon={<Send className="w-4 h-4" />}
            >
              Submit Ticket to Safety Support
            </Button>
          </form>
        )}

        <Button variant="burgundy" className="w-full font-bold" onClick={onClose}>
          Close Help
        </Button>
      </div>
    </BottomSheet>
  );
};
