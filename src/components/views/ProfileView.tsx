import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { BandDetailsModal } from '../profile/BandDetailsModal';
import { SystemStatusModal } from '../profile/SystemStatusModal';
import { SupportModal } from '../profile/SupportModal';
import { NotificationSettingsModal } from '../profile/NotificationSettingsModal';
import { BottomSheet } from '../common/BottomSheet';
import { QRCodeView } from '../common/QRCodeView';
import { EmployeeReportModal } from '../reports/EmployeeReportModal';
import {
  User, ShieldCheck, QrCode, RotateCcw, CheckCircle2, Award, HardHat, Zap,
  Bell, Globe, Sliders, Shield, HelpCircle, Info, ChevronRight, Activity,
  Lock, BookOpen, Clock, FileText, Check, Cpu, Sparkles, Download,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { worker, activeEmployee, band, openScanner, addToast } = useApp();

  const [isBandModalOpen, setIsBandModalOpen] = useState(false);
  const [isSystemStatusOpen, setIsSystemStatusOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotifSettingsOpen, setIsNotifSettingsOpen] = useState(false);
  const [isSafetySheetOpen, setIsSafetySheetOpen] = useState(false);
  const [isPrivacySheetOpen, setIsPrivacySheetOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [doseUnit, setDoseUnit] = useState<'ppmh' | 'mgm3'>('ppmh');

  const currentEmp = activeEmployee || worker;

  const handleLanguageChange = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    addToast({
      type: 'info',
      title: lang === 'en' ? 'Language set to English' : 'भाषा हिंदी चुनी गई (Hindi Selected)',
      description: 'Interface prepared for multilingual localization.',
    });
  };

  const handleUnitChange = (unit: 'ppmh' | 'mgm3') => {
    setDoseUnit(unit);
    addToast({
      type: 'info',
      title: `Units set to ${unit === 'ppmh' ? 'ppm·h (PPM Hours)' : 'mg/m³·h'}`,
      description: 'Display calculations updated across dosage meters.',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">

      {/* ── HEADER ── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
          Profile &amp; QR Identity
        </h1>
        <p className="text-xs text-stone-500 font-semibold mt-0.5">
          Worker identity, assigned dosimeter wristband, safety credentials &amp; field settings
        </p>
      </div>

      {/* ── WORKER CARD & QR IDENTITY ── */}
      <div className="bg-[#FAF4ED] p-6 rounded-3xl border border-[#590D22]/12 shadow-warm-card flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row relative z-10 flex-1">
          {/* Styled Initials Avatar */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#590D22] to-[#E63946] text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-4 border-white shrink-0">
            {currentEmp.name.split(' ').map(n => n[0]).join('')}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-2xl font-black text-[#1C1917] tracking-tight">
                {currentEmp.name}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                ACTIVE SHIFT
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-[#590D22]">
              {currentEmp.employeeId} • {currentEmp.designation || currentEmp.role}
            </p>
            <p className="text-xs text-stone-600 font-semibold">
              Department: <strong className="text-[#1C1917]">{currentEmp.department || 'Maintenance Department'}</strong> • {currentEmp.shift || 'Day Shift'}
            </p>
            <p className="text-xs text-stone-500 font-medium">
              Supervisor: <strong className="text-stone-800">{currentEmp.supervisor || 'Sanjay Kumar'}</strong>
            </p>
          </div>
        </div>

        {/* Embedded Employee QR Identity Code */}
        <div className="shrink-0 relative z-10">
          <QRCodeView
            value={currentEmp.qrPayload || currentEmp.employeeId}
            label="Worker Safety QR"
            size={140}
            showDetails={true}
          />
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 relative z-10 w-full lg:w-auto">
          <Button variant="primary" size="md" onClick={openScanner} className="shadow-warm-hero w-full">
            Scan Dosimeter Band
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsReportOpen(true)}
            className="w-full text-xs font-bold"
            icon={<FileText className="w-4 h-4 text-[#590D22]" />}
          >
            Occupational Safety Report
          </Button>
        </div>
      </div>

      {/* ── SECTION: ASSIGNED DOSIMETER ── */}
      <Card variant="white" className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1C1917]">
                Assigned Dosimeter
              </h3>
              <p className="text-xs font-mono text-stone-500 font-semibold">
                {band.serialNumber}
              </p>
            </div>
          </div>

          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            PAIRED
          </span>
        </div>

        {/* Structured Grid Fields */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#FAF4ED] p-3 rounded-2xl border border-[#590D22]/08">
            <span className="text-stone-500 font-bold block">Band ID</span>
            <span className="font-mono font-black text-[#590D22] mt-0.5 block">{band.serialNumber}</span>
          </div>

          <div className="bg-[#FAF4ED] p-3 rounded-2xl border border-[#590D22]/08">
            <span className="text-stone-500 font-bold block">Status</span>
            <span className="font-extrabold text-emerald-700 mt-0.5 block">Active</span>
          </div>

          <div className="bg-[#FAF4ED] p-3 rounded-2xl border border-[#590D22]/08">
            <span className="text-stone-500 font-bold block">Batch</span>
            <span className="font-mono font-bold text-[#1C1917] mt-0.5 block">BATCH-09</span>
          </div>

          <div className="bg-[#FAF4ED] p-3 rounded-2xl border border-[#590D22]/08">
            <span className="text-stone-500 font-bold block">Manufactured</span>
            <span className="font-bold text-[#1C1917] mt-0.5 block">01 Sep 2026</span>
          </div>

          <div className="bg-[#FAF4ED] p-3 rounded-2xl border border-[#590D22]/08">
            <span className="text-stone-500 font-bold block">Expiry</span>
            <span className="font-bold text-stone-800 mt-0.5 block">30 Sep 2026</span>
          </div>

          <div className="bg-[#FAF4ED] p-3 rounded-2xl border border-[#590D22]/08">
            <span className="text-stone-500 font-bold block">Expiry Status</span>
            <span className="font-extrabold text-emerald-700 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Valid
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full text-xs font-bold py-3"
          icon={<QrCode className="w-4 h-4 text-[#590D22]" />}
          onClick={() => setIsBandModalOpen(true)}
        >
          View Complete Band Details &amp; Optical Gauge
        </Button>
      </Card>

      {/* ── SETTINGS & PREFERENCES GROUP ── */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-[#590D22] uppercase tracking-wider px-1">
          Settings &amp; Support Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* 1. Notification Settings */}
          <div
            onClick={() => setIsNotifSettingsOpen(true)}
            className="p-4 bg-white rounded-3xl border border-stone-200/90 shadow-warm-card hover:shadow-warm-lg hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 text-[#E63946] rounded-2xl border border-red-100">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1C1917] text-sm">Notification Settings</h4>
                <p className="text-xs text-stone-500 font-medium">High exposure alerts &amp; supervisor updates</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400" />
          </div>

          {/* 2. Language Selector */}
          <div className="p-4 bg-white rounded-3xl border border-stone-200/90 shadow-warm-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1C1917] text-sm">Language</h4>
                <p className="text-xs text-stone-500 font-medium">Multilingual interface selection</p>
              </div>
            </div>

            <div className="flex gap-1 bg-[#FAF4ED] p-1 rounded-2xl border border-[#590D22]/10 text-xs font-bold">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  language === 'en' ? 'bg-[#590D22] text-white shadow-xs' : 'text-stone-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  language === 'hi' ? 'bg-[#590D22] text-white shadow-xs' : 'text-stone-600'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* 3. Measurement Units */}
          <div className="p-4 bg-white rounded-3xl border border-stone-200/90 shadow-warm-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1C1917] text-sm">Units &amp; Thresholds</h4>
                <p className="text-xs text-stone-500 font-medium">Cumulative exposure display unit</p>
              </div>
            </div>

            <div className="flex gap-1 bg-[#FAF4ED] p-1 rounded-2xl border border-[#590D22]/10 text-xs font-bold">
              <button
                onClick={() => handleUnitChange('ppmh')}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  doseUnit === 'ppmh' ? 'bg-[#590D22] text-white shadow-xs' : 'text-stone-600'
                }`}
              >
                ppm·h
              </button>
              <button
                onClick={() => handleUnitChange('mgm3')}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  doseUnit === 'mgm3' ? 'bg-[#590D22] text-white shadow-xs' : 'text-stone-600'
                }`}
              >
                mg/m³·h
              </button>
            </div>
          </div>

          {/* 4. Safety Instructions */}
          <div
            onClick={() => setIsSafetySheetOpen(true)}
            className="p-4 bg-white rounded-3xl border border-stone-200/90 shadow-warm-card hover:shadow-warm-lg hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1C1917] text-sm">Safety Instructions</h4>
                <p className="text-xs text-stone-500 font-medium">H₂S emergency protocols &amp; PPE guide</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400" />
          </div>

          {/* 5. Privacy & Data Security */}
          <div
            onClick={() => setIsPrivacySheetOpen(true)}
            className="p-4 bg-white rounded-3xl border border-stone-200/90 shadow-warm-card hover:shadow-warm-lg hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-700 rounded-2xl border border-purple-100">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1C1917] text-sm">Privacy &amp; Data Storage</h4>
                <p className="text-xs text-stone-500 font-medium">Local encryption &amp; plant sync policy</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400" />
          </div>

          {/* 6. Help & Support */}
          <div
            onClick={() => setIsSupportOpen(true)}
            className="p-4 bg-white rounded-3xl border border-stone-200/90 shadow-warm-card hover:shadow-warm-lg hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FAF4ED] text-[#590D22] rounded-2xl border border-[#590D22]/10">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1C1917] text-sm">Help &amp; Support</h4>
                <p className="text-xs text-stone-500 font-medium">Safety team, tech desk &amp; report issue</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400" />
          </div>

        </div>
      </div>

      {/* ── ABOUT & SYSTEM STATUS CARD ── */}
      <Card variant="white" className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-stone-100 text-stone-700 rounded-2xl">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1C1917]">
                About H₂S Guard
              </h3>
              <p className="text-xs text-stone-500 font-semibold">
                Industrial Dosimetry Application Info
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold"
            icon={<Activity className="w-3.5 h-3.5 text-emerald-600" />}
            onClick={() => setIsSystemStatusOpen(true)}
          >
            System Status
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-stone-500 font-bold block text-[10px]">APP VERSION</span>
            <span className="font-extrabold text-[#1C1917] mt-0.5 block">v1.4.2-industrial</span>
          </div>
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-stone-500 font-bold block text-[10px]">MODEL VERSION</span>
            <span className="font-extrabold text-[#590D22] mt-0.5 block">H2S-COLOR-v1.2</span>
          </div>
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-stone-500 font-bold block text-[10px]">CALIBRATION</span>
            <span className="font-extrabold text-stone-800 mt-0.5 block">CAL-2026-09</span>
          </div>
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-stone-500 font-bold block text-[10px]">SYSTEM STATUS</span>
            <span className="font-extrabold text-emerald-700 mt-0.5 block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Operational
            </span>
          </div>
        </div>
      </Card>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MODALS & SHEETS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <BandDetailsModal isOpen={isBandModalOpen} onClose={() => setIsBandModalOpen(false)} />
      <SystemStatusModal isOpen={isSystemStatusOpen} onClose={() => setIsSystemStatusOpen(false)} />
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      <NotificationSettingsModal isOpen={isNotifSettingsOpen} onClose={() => setIsNotifSettingsOpen(false)} />

      {/* Safety Instructions Sheet */}
      <BottomSheet isOpen={isSafetySheetOpen} onClose={() => setIsSafetySheetOpen(false)} title="H₂S Emergency & PPE Protocols">
        <div className="space-y-4 text-sm">
          <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#590D22]/10">
            <h4 className="font-extrabold text-[#590D22] text-sm">Hydrogen Sulfide (H₂S) Plant Protocol</h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              H₂S is a toxic, flammable gas. Continuous shift dosimetry monitoring protects against insidious exposure buildup.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <p className="font-bold text-[#1C1917]">Normal Range (&lt; 25 ppm·h)</p>
              <p className="text-stone-500 mt-0.5">Continue routine shift activities. Rescan dosimeter every 4 hours or post-task.</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
              <p className="font-bold">Attention Level (25 - 50 ppm·h)</p>
              <p className="mt-0.5 opacity-90">Verify area ventilation. Minimize un-necessary time in active gas zones.</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900">
              <p className="font-bold">Action Threshold (&gt; 50 ppm·h)</p>
              <p className="mt-0.5 opacity-90">Evacuate area to safe assembly zone. Supervisor and Safety Lead automatically dispatched.</p>
            </div>
          </div>

          <Button variant="burgundy" className="w-full font-bold" onClick={() => setIsSafetySheetOpen(false)}>
            Close Protocols
          </Button>
        </div>
      </BottomSheet>

      {/* Privacy Policy Sheet */}
      <BottomSheet isOpen={isPrivacySheetOpen} onClose={() => setIsPrivacySheetOpen(false)} title="Privacy & Data Storage Policy">
        <div className="space-y-4 text-sm text-stone-700">
          <p className="leading-relaxed">
            H₂S Guard stores optical exposure data locally on your device for offline availability, and synchronizes encrypted logs to your plant's internal safety server.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <p className="font-bold text-[#1C1917]">Camera Usage</p>
              <p className="text-stone-500 mt-0.5">Camera feed is processed in real-time on-device. No raw video frames are saved without optical color feature extraction.</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <p className="font-bold text-[#1C1917]">Encrypted Incident Ledger</p>
              <p className="text-stone-500 mt-0.5">Exposure events are digitally signed and logged to satisfy OSHA &amp; industrial compliance standards.</p>
            </div>
          </div>

          <Button variant="burgundy" className="w-full font-bold" onClick={() => setIsPrivacySheetOpen(false)}>
            Understood
          </Button>
        </div>
      </BottomSheet>

      {/* Occupational Exposure Report Modal */}
      {isReportOpen && (
        <EmployeeReportModal
          selectedEmployeeId={currentEmp.employeeId}
          onClose={() => setIsReportOpen(false)}
        />
      )}

    </div>
  );
};
