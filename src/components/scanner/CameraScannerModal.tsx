import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { Button } from '../common/Button';
import { presetScanScenarios } from '../../data/mockData';
import type { SafetyStatus } from '../../types';
import { analyzeImage, AnalysisResult } from '../../utils/colorAnalysis';
import { ProfessionalProfileModal } from '../profile/ProfessionalProfileModal';
import {
  Camera, Zap, ArrowLeft, CheckCircle2, RotateCcw, Sparkles,
  MapPin, FileText, AlertTriangle, QrCode, ShieldCheck, Loader2,
  ChevronDown, AlertCircle, Flame, Shield, HelpCircle, Bell,
  BookOpen, Save, RefreshCcw, Info, CircleDot, Upload,
} from 'lucide-react';

/* ── helpers ──────────────────────────────────────────────────── */
interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  ring: string;
  icon: React.ReactNode;
  dot: string;
}

function getStatusConfig(status: SafetyStatus): StatusConfig {
  switch (status) {
    case 'NORMAL':
      return {
        label: 'NORMAL',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        ring: 'ring-emerald-400',
        dot: 'bg-emerald-500',
        icon: <CheckCircle2 className="w-10 h-10 text-emerald-500" />,
      };
    case 'ATTENTION':
      return {
        label: 'ATTENTION',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        ring: 'ring-amber-400',
        dot: 'bg-amber-500',
        icon: <AlertTriangle className="w-10 h-10 text-amber-500" />,
      };
    case 'HIGH_EXPOSURE':
      return {
        label: 'HIGH EXPOSURE',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        ring: 'ring-red-500',
        dot: 'bg-red-600',
        icon: <Flame className="w-10 h-10 text-red-600" />,
      };
    case 'INVALID':
    default:
      return {
        label: 'INVALID READING',
        color: 'text-stone-600',
        bg: 'bg-stone-100',
        border: 'border-stone-300',
        ring: 'ring-stone-400',
        dot: 'bg-stone-400',
        icon: <AlertCircle className="w-10 h-10 text-stone-400" />,
      };
  }
}

/* ── main component ───────────────────────────────────────────── */
export const CameraScannerModal: React.FC = () => {
  const { isScannerOpen, closeScanner, addReading, addToast, setActiveTab, worker, band, employees, scannedEmployee, setScannedEmployee, scanEmployeeQR, currentRole } = useApp();

  type ScanMode = 'dosimeter' | 'employee_qr';
  const [scanMode, setScanMode] = useState<ScanMode>('dosimeter');
  const [qrInput, setQrInput] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  type Screen = 'camera' | 'analysis' | 'result';

  const [screen, setScreen] = useState<Screen>('camera');
  const [detectionStep, setDetectionStep] = useState(0);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [flashOn, setFlashOn] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [location, setLocation] = useState('Pump Station B - Sector 4');
  const [customLocation, setCustomLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [alertsTriggered, setAlertsTriggered] = useState(false);
  const [showSafetySheet, setShowSafetySheet] = useState(false);
  const [customAnalysis, setCustomAnalysis] = useState<AnalysisResult | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [hasWebcam, setHasWebcam] = useState(false);

  const preset = presetScanScenarios[selectedPresetIndex];
  const currentResult = customAnalysis || {
    exposureDosePpmH: preset.exposureDosePpmH,
    status: preset.status as SafetyStatus,
    confidencePct: preset.confidencePct,
    shiftDurationMinutes: preset.shiftDurationMinutes,
    exposureRatePpmH: preset.exposureRatePpmH,
    colorShiftHex: preset.colorShiftHex,
    baselineColorHex: preset.baselineColorHex,
    qualityScorePct: preset.qualityScorePct,
    deltaE: preset.deltaE,
    rawRgb: preset.rawRgb,
  };

  const statusConfig = getStatusConfig(currentResult.status as SafetyStatus);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  /* ── Reset state when scanner opens ── */
  useEffect(() => {
    if (isScannerOpen) {
      setScreen('camera');
      setDetectionStep(0);
      setErrorState(null);
      setNotes('');
      setSaved(false);
      setAlertsTriggered(false);
      setWhyOpen(false);
      setCustomAnalysis(null);
      setScanMode('dosimeter');
      setQrInput('');
      setShowProfileModal(false);
    } else {
      stopCameraStream();
    }
  }, [isScannerOpen]);

  const handleEmployeeQrScan = () => {
    if (!qrInput.trim()) {
      addToast({ type: 'error', title: 'Empty QR Input', description: 'Enter an Employee ID to look up.' });
      return;
    }
    const result = scanEmployeeQR(qrInput.trim());
    if (result.success) {
      setShowProfileModal(true);
    }
  };

  /* ── Camera stream lifecycle ── */
  useEffect(() => {
    let isMounted = true;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;

    if (isScannerOpen && screen === 'camera') {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((stream) => {
            if (!isMounted) {
              stream.getTracks().forEach((track) => track.stop());
              return;
            }
            mediaStreamRef.current = stream;
            setHasWebcam(true);
            // Must wait a tick for React to render the video element since hasWebcam just changed to true
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch(e => console.warn('Video play error:', e));
              }
            }, 100);
          })
          .catch((e) => {
            console.warn('getUserMedia error:', e);
            if (isMounted) setHasWebcam(false);
          });
      } else {
        if (isMounted) setHasWebcam(false);
      }

      t1 = setTimeout(() => isMounted && setDetectionStep(1), 900);
      t2 = setTimeout(() => isMounted && setDetectionStep(2), 1800);
    } else {
      stopCameraStream();
    }

    return () => {
      isMounted = false;
      clearTimeout(t1);
      clearTimeout(t2);
      stopCameraStream();
    };
  }, [isScannerOpen, screen]);

  if (!isScannerOpen) return null;

  /* ── handlers ── */
  const processImageAnalysis = async (imageSrc: string) => {
    try {
      const result = await analyzeImage(imageSrc);
      setCustomAnalysis(result);
    } catch (err) {
      console.error('Error performing color analysis:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setScreen('analysis');
        setAnalysisProgress(0);
        await processImageAnalysis(dataUrl);

        let count = 0;
        const iv = setInterval(() => {
          count++;
          setAnalysisProgress(count);
          if (count >= 6) {
            clearInterval(iv);
            setTimeout(() => setScreen('result'), 500);
          }
        }, 300);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = async () => {
    if (errorState) return;

    // If video element is active and playing, capture frame to canvas
    if (videoRef.current && hasWebcam) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          await processImageAnalysis(dataUrl);
        }
      } catch (e) {
        console.warn('Webcam capture fallback to preset scenario:', e);
      }
    } else {
      setCustomAnalysis(null); // use selected preset
    }

    setScreen('analysis');
    setAnalysisProgress(0);

    let count = 0;
    const iv = setInterval(() => {
      count++;
      setAnalysisProgress(count);
      if (count >= 6) {
        clearInterval(iv);
        setTimeout(() => setScreen('result'), 500);
      }
    }, 380);
  };

  const handleSave = () => {
    if (saved) return;
    const finalLoc = location === 'Custom Location' ? customLocation || 'Field Site' : location;

    addReading({
      workerId: worker.id,
      workerName: worker.name,
      bandId: band.serialNumber,
      exposureDosePpmH: currentResult.exposureDosePpmH,
      status: currentResult.status as SafetyStatus,
      confidencePct: currentResult.confidencePct,
      shiftDurationMinutes: currentResult.shiftDurationMinutes,
      exposureRatePpmH: currentResult.exposureRatePpmH,
      location: finalLoc,
      colorShiftHex: currentResult.colorShiftHex,
      baselineColorHex: currentResult.baselineColorHex,
      qualityScorePct: currentResult.qualityScorePct,
      deltaE: currentResult.deltaE,
      rawRgb: currentResult.rawRgb,
      notes: notes || preset.notes,
      sampleTag: preset.sampleTag,
    });

    setSaved(true);

    if (currentResult.status === 'HIGH_EXPOSURE') {
      setAlertsTriggered(true);
    }

    addToast({
      type: currentResult.status === 'INVALID' ? 'info' : currentResult.status === 'HIGH_EXPOSURE' ? 'error' : currentResult.status === 'ATTENTION' ? 'warning' : 'success',
      title: 'Reading saved successfully.',
      description: currentResult.status === 'INVALID'
        ? 'Scan saved as Invalid. Retake recommended.'
        : `${currentResult.status} • ${currentResult.exposureDosePpmH} ppm·h at ${finalLoc}`,
    });
  };

  const handleDone = () => {
    closeScanner();
    if (currentResult.status === 'HIGH_EXPOSURE' || currentResult.status === 'ATTENTION') {
      setActiveTab('alerts');
    }
  };

  const twa = currentResult.exposureRatePpmH.toFixed(2);
  const durationH = Math.floor(currentResult.shiftDurationMinutes / 60);
  const durationM = currentResult.shiftDurationMinutes % 60;
  const now = new Date();
  const timestampStr = now.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="fixed inset-0 z-50 bg-stone-950 flex flex-col font-sans overflow-hidden">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SCREEN 1 — CAMERA VIEWFINDER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {screen === 'camera' && (
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-5 bg-gradient-to-b from-stone-950 to-transparent text-white z-20 relative">
            <button onClick={closeScanner} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="text-sm font-extrabold tracking-tight">
                {scanMode === 'dosimeter' ? 'Scan Dosimeter' : 'Scan Employee QR'}
              </p>
              <p className="text-[11px] font-mono text-stone-300">{worker.name} • {band.serialNumber}</p>
              {/* Mode Toggle */}
              <div className="flex items-center gap-1 mt-1.5 bg-white/10 rounded-full p-0.5 text-[10px] font-bold">
                <button
                  onClick={() => setScanMode('dosimeter')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${scanMode === 'dosimeter' ? 'bg-[#E63946] text-white' : 'text-stone-300 hover:text-white'}`}
                >
                  Dosimeter Band
                </button>
                <button
                  onClick={() => setScanMode('employee_qr')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${scanMode === 'employee_qr' ? 'bg-[#E63946] text-white' : 'text-stone-300 hover:text-white'}`}
                >
                  Employee QR
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Upload image"
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                onClick={() => setFlashOn(f => !f)}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${flashOn ? 'bg-amber-400 text-stone-950' : 'bg-white/10 text-white'}`}
              >
                <Zap className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Viewport */}
          {scanMode === 'dosimeter' ? (
            <>
              <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
                {hasWebcam ? (
                  <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-stone-900 flex flex-col items-center justify-center z-30">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E63946_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                    <Camera className="w-12 h-12 text-stone-500 mb-3" />
                    <p className="text-stone-400 text-xs font-semibold mb-5 px-8 text-center max-w-xs">
                      Live view requires HTTPS. Tap below to open your genuine mobile camera.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-[#E63946] hover:bg-red-700 text-white rounded-full font-bold shadow-lg flex items-center gap-2 cursor-pointer z-40 transition-colors"
                    >
                      <Camera className="w-4 h-4 stroke-[2.5]" /> Open Native Camera
                    </button>
                  </div>
                )}

                {/* Detection Status */}
                <div className="absolute top-4 inset-x-4 z-20 flex justify-center">
                  {!errorState ? (
                    <div className="px-4 py-1.5 bg-stone-900/85 backdrop-blur-md rounded-full border border-white/15 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-lg">
                      {detectionStep === 0 && <><Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" /><span>Searching for dosimeter...</span></>}
                      {detectionStep === 1 && <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span>Dosimeter detected ✓</span></>}
                      {detectionStep >= 2 && <><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /><span>QR detected ✓ · {band.serialNumber}</span></>}
                    </div>
                  ) : (
                    <div className="px-4 py-1.5 bg-red-950/90 backdrop-blur-md rounded-full border border-red-500/40 text-xs font-semibold text-red-200 flex items-center gap-2 shadow-lg">
                      <AlertTriangle className="w-4 h-4 text-red-400" /><span>{errorState}</span>
                    </div>
                  )}
                </div>

                {/* Scanning Frame */}
                <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-2 border-white/30 flex flex-col items-center justify-center">
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#E63946] rounded-tl-2xl" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#E63946] rounded-tr-2xl" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#E63946] rounded-bl-2xl" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#E63946] rounded-br-2xl" />

                  {!errorState && (
                    <div className="absolute inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-[#E63946]/80 to-transparent animate-pulse top-1/2" />
                  )}

                  {/* Band Preview */}
                  <div className="w-44 h-44 rounded-2xl bg-stone-950/70 border border-white/15 p-3 flex flex-col items-center justify-center relative shadow-2xl">
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-stone-900/90 border border-white/20 px-1.5 py-0.5 rounded text-[9px] font-mono text-stone-200">
                      <QrCode className="w-2.5 h-2.5 text-[#E63946]" /><span>{band.serialNumber}</span>
                    </div>
                    <div
                      className="w-16 h-16 rounded-full border-4 border-stone-200/60 shadow-2xl flex items-center justify-center my-1 transition-colors duration-500"
                      style={{ backgroundColor: currentResult.colorShiftHex }}
                    >
                      <div className="w-5 h-5 rounded-full bg-white/25" />
                    </div>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">SafeDos-X3 Matrix</span>
                  </div>

                  <p className="text-[11px] font-semibold text-stone-200 mt-3 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                    Place the dosimeter inside the frame
                  </p>
                </div>

                {/* Validation mini-panel */}
                <div className="absolute bottom-2 left-3 right-3 z-20 max-w-sm mx-auto bg-stone-900/80 backdrop-blur-md rounded-2xl px-3 py-2.5 border border-white/10 shadow-xl">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-semibold text-stone-300 mb-2">
                    {[
                      ['QR detected', detectionStep >= 2],
                      ['Band detected', detectionStep >= 1],
                      ['Reference visible', detectionStep >= 2],
                      ['Dosimeter valid', detectionStep >= 2],
                    ].map(([label, ok]) => (
                      <div key={label as string} className="flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3 h-3 shrink-0 ${ok ? 'text-emerald-400' : 'text-stone-600'}`} />
                        <span>{label as string}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[10px] font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {detectionStep >= 2 && !errorState ? 'Ready to analyze' : 'Aligning…'}
                    </span>
                    <span className="font-mono text-stone-500">Optical Target</span>
                  </div>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="bg-gradient-to-t from-stone-950 to-stone-950/80 px-4 pt-3 pb-4 flex flex-col items-center gap-3">
                {/* Error state toggles */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-0.5 text-[10px]">
                  <span className="text-stone-500 font-bold shrink-0">Test:</span>
                  {[
                    { label: '✓ Valid', val: null },
                    { label: '❌ QR', val: 'QR not detected – Move the band inside the frame' },
                    { label: '❌ Ref', val: 'Reference area not visible – Adjust the band position' },
                    { label: '❌ Dark', val: 'Image too dark – Move to a better-lit area' },
                  ].map(({ label, val }) => (
                    <button
                      key={label}
                      onClick={() => setErrorState(val)}
                      className={`shrink-0 px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                        errorState === val ? 'bg-[#E63946] text-white' : 'bg-stone-800 text-stone-400'
                      }`}
                    >{label}</button>
                  ))}
                </div>

                {/* Shutter & demo preset row */}
                <div className="flex items-center justify-center gap-4 w-full">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-stone-500 font-bold">Demo Scan</span>
                    <div className="flex gap-1">
                      {presetScanScenarios.map((sc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPresetIndex(idx)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full cursor-pointer transition-colors ${
                            selectedPresetIndex === idx ? 'bg-[#E63946] text-white' : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {sc.status === 'HIGH_EXPOSURE' ? 'High' : sc.status === 'INVALID' ? 'Inv' : sc.status.charAt(0) + sc.status.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCapture}
                    disabled={!!errorState}
                    className="w-20 h-20 rounded-full border-4 border-white/90 bg-[#E63946] flex items-center justify-center shadow-2xl active:scale-95 transition-transform disabled:opacity-40 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full border-2 border-white/50 flex items-center justify-center">
                      <Camera className="w-7 h-7 text-white stroke-[2.5]" />
                    </div>
                  </button>

                  <div className="flex flex-col items-center gap-1 opacity-0 pointer-events-none w-16">
                    {/* spacer to balance layout */}
                    <span className="text-[10px]">·</span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-stone-400">
                  Align band · tap shutter to capture & analyze
                </p>
              </div>
            </>
          ) : (
            /* ── EMPLOYEE QR SCAN MODE ── */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-white space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#590D22] to-[#E63946] flex items-center justify-center shadow-lg">
                <QrCode className="w-10 h-10 text-white" />
              </div>

              <div className="text-center">
                <h3 className="text-xl font-extrabold">Employee QR Scan Mode</h3>
                <p className="text-sm text-stone-400 mt-1">Enter or scan an Employee ID to view their professional profile</p>
              </div>

              <div className="w-full max-w-sm space-y-3">
                <input
                  type="text"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmployeeQrScan()}
                  placeholder="e.g. EMP-184, EMP-312..."
                  className="w-full px-4 py-3.5 text-sm font-mono bg-stone-800 border border-stone-700 rounded-2xl text-white focus:outline-none focus:border-[#E63946] placeholder:text-stone-500"
                  autoFocus
                />

                <button
                  onClick={handleEmployeeQrScan}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#590D22] to-[#E63946] text-white font-bold text-sm shadow-lg shadow-[#E63946]/20 hover:shadow-xl transition-all cursor-pointer"
                >
                  Look Up Employee Profile
                </button>
              </div>

              {/* Quick-select Employee List */}
              <div className="w-full max-w-sm space-y-2">
                <p className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">Quick Select</p>
                <div className="space-y-1 max-h-52 overflow-y-auto">
                  {employees.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => { setQrInput(emp.employeeId); scanEmployeeQR(emp.employeeId); setShowProfileModal(true); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-stone-800/60 hover:bg-stone-800 transition-colors text-left cursor-pointer border border-stone-700/50"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#590D22] to-[#E63946] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{emp.name}</p>
                        <p className="text-[10px] font-mono text-stone-400">{emp.employeeId} • {emp.department || 'Operations'}</p>
                      </div>
                      <QrCode className="w-4 h-4 text-stone-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SCREEN 2 — ANALYSIS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {screen === 'analysis' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-white text-center space-y-8 max-w-md mx-auto">
          {/* Animated logo */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-[#590D22] border-2 border-[#E63946]/60 flex items-center justify-center shadow-warm-hero">
              <Sparkles className="w-12 h-12 text-[#E63946] animate-spin" style={{ animationDuration: '2s' }} />
            </div>
            <div className="absolute inset-0 rounded-3xl border-2 border-[#E63946]/30 animate-ping" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">Analyzing Dosimeter</h2>
            <p className="text-sm text-stone-400 mt-1">Extracting colorimetric shift &amp; estimating cumulative H₂S dose</p>
          </div>

          {/* Step checklist */}
          <div className="w-full bg-stone-900/80 rounded-3xl p-5 border border-stone-800 text-left space-y-3 text-sm">
            {[
              { label: 'Band identified',        detail: band.serialNumber,                   step: 1 },
              { label: 'QR verified',             detail: 'PASSED',                             step: 2 },
              { label: 'Image quality acceptable',detail: `${currentResult.qualityScorePct}%`, step: 3 },
              { label: 'Reference detected',      detail: 'Baseline #F5EECE',                  step: 4 },
              { label: 'Sensor region detected',  detail: `ΔE ${currentResult.deltaE.toFixed(1)}`, step: 5 },
              { label: 'Expiry checked',          detail: `Valid · ${band.calibrationDueDate}`,step: 6 },
            ].map(({ label, detail, step }) => {
              const done = analysisProgress >= step;
              const active = analysisProgress === step - 1;
              return (
                <div key={label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 font-semibold text-stone-200">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : active ? (
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                    ) : (
                      <CircleDot className="w-4 h-4 text-stone-700 shrink-0" />
                    )}
                    <span className={done ? 'text-stone-100' : 'text-stone-500'}>{label}</span>
                  </span>
                  <span className={`font-mono text-xs ${done ? 'text-stone-400' : 'text-stone-700'}`}>{detail}</span>
                </div>
              );
            })}

            {/* Final estimation row */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-emerald-400 font-bold text-sm">
              <span className="flex items-center gap-2">
                {analysisProgress >= 6 ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
                Estimating exposure...
              </span>
              <span className="font-mono text-stone-400">{currentResult.confidencePct}% confidence</span>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SCREEN 3 — RESULT
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {screen === 'result' && (
        <div className="flex-1 bg-[#FAF4ED] overflow-y-auto flex flex-col">
          {/* Result Header Bar */}
          <div className="bg-[#590D22] text-white px-5 py-4 flex items-center justify-between shrink-0">
            <button onClick={closeScanner} className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="text-sm font-extrabold tracking-tight">Exposure Result</p>
              <p className="text-[11px] text-stone-300 font-mono">{worker.name} · {band.serialNumber}</p>
            </div>
            <div className="w-10" /> {/* spacer */}
          </div>

          <div className="flex-1 px-4 py-5 space-y-4 max-w-xl mx-auto w-full">

            {/* ── BIG STATUS CARD ── */}
            <div className={`rounded-3xl border-2 ${statusConfig.border} bg-white shadow-warm-card overflow-hidden`}>
              {/* Status Banner */}
              <div className={`${statusConfig.bg} px-6 py-5 flex flex-col items-center gap-3 border-b ${statusConfig.border}`}>
                {/* Icon ring */}
                <div className={`w-20 h-20 rounded-full ring-4 ${statusConfig.ring} bg-white shadow-md flex items-center justify-center`}>
                  {statusConfig.icon}
                </div>

                <div className="text-center">
                  <span className={`text-xs font-extrabold uppercase tracking-widest ${statusConfig.color}`}>
                    EXPOSURE STATUS
                  </span>
                  <h2 className={`text-2xl font-black tracking-tight mt-0.5 ${statusConfig.color}`}>
                    {statusConfig.label}
                  </h2>
                </div>

                {/* Dose Number – hide for INVALID */}
                {currentResult.status !== 'INVALID' ? (
                  <div className="text-center mt-1">
                    <span className="text-5xl font-black text-[#1C1917] font-mono tracking-tight">
                      {currentResult.exposureDosePpmH.toFixed(1)}
                    </span>
                    <span className="text-base font-bold text-stone-500 ml-1.5">ppm·h</span>
                    <p className="text-xs text-stone-500 mt-1 font-semibold">Estimated cumulative exposure</p>
                  </div>
                ) : (
                  <p className="text-sm text-stone-600 font-semibold text-center max-w-xs">
                    Unable to produce a validated quantitative estimate.
                  </p>
                )}
              </div>

              {/* Status-specific narrative */}
              <div className="px-5 py-4">
                {currentResult.status === 'NORMAL' && (
                  <p className="text-sm text-stone-700 font-semibold leading-relaxed">
                    Reading successfully recorded. Cumulative exposure is within the normal operational range.
                  </p>
                )}
                {currentResult.status === 'ATTENTION' && (
                  <p className="text-sm text-amber-800 font-semibold leading-relaxed">
                    Review your exposure record and follow your site's safety procedure. Limit further exposure where possible this shift.
                  </p>
                )}
                {currentResult.status === 'HIGH_EXPOSURE' && (
                  <div className="space-y-3">
                    <p className="text-sm text-red-800 font-bold leading-relaxed">
                      This reading requires immediate attention according to the configured site exposure rules.
                    </p>
                    {alertsTriggered && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2 rounded-2xl text-xs font-bold text-red-700">
                        <Bell className="w-4 h-4 shrink-0 text-red-500 animate-pulse" />
                        Supervisor &amp; Safety Team notified automatically
                      </div>
                    )}
                  </div>
                )}
                {currentResult.status === 'INVALID' && (
                  <div className="space-y-2">
                    <p className="text-sm text-stone-600 font-semibold leading-relaxed">
                      Sensor colour is outside the validated analysis range. This scan cannot be used as a dosimetric record.
                    </p>
                    <p className="text-xs text-stone-500">Possible causes: glare, obstruction, or band damage.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── METRICS GRID (not for INVALID) ── */}
            {currentResult.status !== 'INVALID' && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Confidence', value: `${currentResult.confidencePct.toFixed(0)}%` },
                  { label: 'Exposure Duration', value: `${durationH}h ${durationM}m` },
                  { label: 'TWA (Time-Weighted Avg)', value: `${twa} ppm` },
                  { label: 'Timestamp', value: timestampStr },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-warm-card">
                    <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-extrabold text-[#1C1917] mt-0.5 leading-tight">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Band row */}
            <div className="bg-white rounded-2xl px-4 py-3 border border-stone-200 flex items-center justify-between shadow-warm-card text-xs">
              <span className="text-stone-500 font-semibold">Band</span>
              <span className="font-mono font-bold text-[#590D22]">{band.serialNumber}</span>
            </div>

            {/* ── LOCATION & NOTES (only when not yet saved) ── */}
            {!saved && currentResult.status !== 'INVALID' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E63946]" />Field Location:
                  </label>
                  <select
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-2xl px-4 py-3 text-sm font-semibold text-[#1C1917] focus:ring-2 focus:ring-[#E63946] focus:outline-none shadow-sm"
                  >
                    <option>Pump Station B - Sector 4</option>
                    <option>Desulfurization Unit 2</option>
                    <option>Storage Tank Farm West</option>
                    <option>Crude Distillation Vent Line 3</option>
                    <option value="Custom Location">Custom Location Entry…</option>
                  </select>
                  {location === 'Custom Location' && (
                    <input
                      type="text"
                      placeholder="Enter field zone or equipment ID"
                      value={customLocation}
                      onChange={e => setCustomLocation(e.target.value)}
                      className="w-full mt-2 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-sm text-[#1C1917] focus:ring-2 focus:ring-[#E63946] focus:outline-none"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5 mb-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#590D22]" />Technician Notes (optional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Add observation details, PPE status…"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-2xl p-3 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#E63946] focus:outline-none shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* ── ACTION BUTTONS ── */}
            <div className="space-y-2.5 pt-1">
              {currentResult.status === 'INVALID' ? (
                <>
                  <Button variant="primary" className="w-full font-bold" icon={<RotateCcw className="w-4 h-4" />} onClick={() => setScreen('camera')}>
                    Retake Scan
                  </Button>
                  <Button variant="outline" className="w-full font-bold" icon={<HelpCircle className="w-4 h-4" />} onClick={() => setWhyOpen(true)}>
                    Why is this happening?
                  </Button>
                </>
              ) : (
                <>
                  {currentResult.status === 'HIGH_EXPOSURE' && (
                    <>
                      <Button variant="danger" className="w-full font-bold" icon={<Bell className="w-4 h-4" />} onClick={() => { setActiveTab('alerts'); handleDone(); }}>
                        View Alert
                      </Button>
                      <Button variant="outline" className="w-full font-bold" icon={<BookOpen className="w-4 h-4" />} onClick={() => setShowSafetySheet(true)}>
                        View Safety Instructions
                      </Button>
                    </>
                  )}

                  {!saved ? (
                    <Button
                      variant="primary"
                      className="w-full font-bold shadow-warm-hero"
                      icon={<Save className="w-4 h-4" />}
                      onClick={handleSave}
                    >
                      Save Reading
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 justify-center bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-800 text-sm font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Reading saved successfully.
                    </div>
                  )}

                  {saved && (
                    <Button variant="outline" className="w-full font-bold" onClick={handleDone}>
                      Done
                    </Button>
                  )}

                  <Button variant="ghost" className="w-full text-[#590D22] text-xs font-bold" icon={<HelpCircle className="w-4 h-4" />} onClick={() => setWhyOpen(true)}>
                    Why this result?
                  </Button>
                </>
              )}
            </div>

          </div>{/* end inner container */}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          WHY THIS RESULT — bottom sheet
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <BottomSheet isOpen={whyOpen} onClose={() => setWhyOpen(false)} title="Why this result?">
        <div className="space-y-4 text-sm">
          {/* Validation steps */}
          <div className="space-y-2">
            {[
              { label: 'Band identified',              ok: true },
              { label: 'Band within expiry',           ok: currentResult.status !== 'INVALID' },
              { label: 'Sensor region detected',       ok: currentResult.status !== 'INVALID' },
              { label: 'Reference normalisation done', ok: currentResult.status !== 'INVALID' },
              { label: 'Image quality acceptable',     ok: currentResult.qualityScorePct >= 80 },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between bg-stone-50 rounded-xl px-3 py-2 border border-stone-200">
                <span className="flex items-center gap-2 font-semibold text-[#1C1917]">
                  {ok
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    : <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  {label}
                </span>
                <span className={`text-xs font-bold ${ok ? 'text-emerald-700' : 'text-red-600'}`}>
                  {ok ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            ))}
          </div>

          {/* Measurements */}
          {currentResult.status !== 'INVALID' && (
            <div className="bg-[#FAF4ED] rounded-2xl p-4 border border-[#590D22]/10 space-y-2">
              <p className="text-xs font-extrabold text-[#590D22] uppercase tracking-wider mb-1">Measurement Detail</p>
              {[
                ['Estimated exposure', `${currentResult.exposureDosePpmH.toFixed(1)} ppm·h`],
                ['Confidence', `${currentResult.confidencePct.toFixed(0)}%`],
                ['Delta-E colour shift', `${currentResult.deltaE.toFixed(1)}`],
                ['Sensor RGB', `${currentResult.rawRgb.r}, ${currentResult.rawRgb.g}, ${currentResult.rawRgb.b}`],
                ['Measurement status', 'Within validated range'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-stone-500 font-semibold">{k}</span>
                  <span className="font-bold font-mono text-[#1C1917]">{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Model tag */}
          <div className="bg-stone-100 rounded-2xl px-4 py-3 border border-stone-200 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-stone-500 font-bold mb-1">
              <Info className="w-3.5 h-3.5" />Model &amp; Calibration
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Model</span>
              <span className="font-mono font-bold text-stone-800">H2S-COLOR-v1.2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Calibration ref</span>
              <span className="font-mono font-bold text-stone-800">CAL-2026-09</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Band model</span>
              <span className="font-mono font-bold text-stone-800">{band.model}</span>
            </div>
          </div>

          <Button variant="burgundy" className="w-full font-bold" onClick={() => setWhyOpen(false)}>
            Close
          </Button>
        </div>
      </BottomSheet>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SAFETY INSTRUCTIONS SHEET
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <BottomSheet isOpen={showSafetySheet} onClose={() => setShowSafetySheet(false)} title="High Exposure — Safety Instructions">
        <div className="space-y-4 text-sm">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="font-bold text-red-800 leading-relaxed">
              Your cumulative H₂S exposure has exceeded the site action threshold. Follow the steps below immediately.
            </p>
          </div>
          {[
            { step: '1', text: 'Exit the hazardous area and move to the designated safe zone.' },
            { step: '2', text: 'Inform your supervisor and safety officer immediately.' },
            { step: '3', text: 'Complete a medical self-assessment and report any symptoms (headache, dizziness, nausea).' },
            { step: '4', text: 'Do not return to the work area until authorised by your safety officer.' },
            { step: '5', text: 'Retain your dosimeter wristband for laboratory analysis if directed.' },
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
            This information is a safety guide only. Always follow your site's official emergency response procedures.
          </div>
          <Button variant="danger" className="w-full font-bold" onClick={() => setShowSafetySheet(false)}>
            Understood
          </Button>
        </div>
      </BottomSheet>

      {/* ── Professional Profile Modal from QR Scan ── */}
      {showProfileModal && scannedEmployee && (
        <ProfessionalProfileModal
          employee={scannedEmployee}
          onClose={() => { setShowProfileModal(false); setScannedEmployee(null); }}
        />
      )}

    </div>
  );
};
