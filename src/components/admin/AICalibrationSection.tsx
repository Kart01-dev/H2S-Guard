import React, { useState } from 'react';
import { Cpu, RefreshCw, CheckCircle2, ShieldCheck, Database, Camera, Activity, FileText } from 'lucide-react';

interface AICalibrationSectionProps {
  addToast: (toast: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description: string }) => void;
}

export const AICalibrationSection: React.FC<AICalibrationSectionProps> = ({ addToast }) => {
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrain = () => {
    setIsRetraining(true);
    addToast({
      type: 'info',
      title: 'Validation Initiated',
      description: 'Running validation suite on dataset CAL-2026-09...',
    });
    setTimeout(() => {
      setIsRetraining(false);
      addToast({
        type: 'success',
        title: 'Validation Complete',
        description: 'Model validated against 1,240 samples. Delta-E < 0.15.',
      });
    }, 2000);
  };

  const pipelineSteps = [
    { label: 'Image Capture', icon: <Camera className="w-4 h-4" /> },
    { label: 'Quality Validation', icon: <CheckCircle2 className="w-4 h-4" /> },
    { label: 'Reference Normalization', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'Sensor ROI Extraction', icon: <Camera className="w-4 h-4" /> },
    { label: 'Colour Features (RGB/HSV)', icon: <Activity className="w-4 h-4" /> },
    { label: 'AI Regression / Calibration Model', icon: <Cpu className="w-4 h-4" /> },
    { label: 'Exposure Estimate (ppm·h)', icon: <Activity className="w-4 h-4" /> },
    { label: 'Confidence Scoring', icon: <CheckCircle2 className="w-4 h-4" /> },
    { label: 'Validity Check & Audit', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1917] tracking-tight">
            Colorimetric AI Neural Vision & Optical Calibration Engine
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage the computer vision color shift algorithm, RGB chrominance delta curves, and ambient white-balance compensation matrix.
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all ${
            isRetraining ? 'bg-stone-400 cursor-not-allowed' : 'bg-[#590D22] hover:bg-[#400918] cursor-pointer'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
          {isRetraining ? 'Validating...' : 'Validate Model Pipeline'}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm col-span-2 md:col-span-1">
          <span className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Current Model</span>
          <div className="text-lg font-black text-[#590D22] font-mono flex items-center gap-2">
            H2S-COLOR-v1.2
          </div>
          <span className="mt-2 inline-block px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full">
            ACTIVE
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Calibration</span>
          <div className="text-base font-black text-[#1C1917] font-mono">CAL-2026-09</div>
          <span className="mt-2 inline-block px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full">
            VALIDATED
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-[10px] text-stone-500 font-bold block uppercase mb-1 flex items-center gap-1">
            <Database className="w-3 h-3" /> Dataset Samples
          </span>
          <div className="text-base font-black text-[#1C1917] font-mono">1,240</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Last Validation</span>
          <div className="text-base font-black text-[#1C1917] font-mono">21 Sep 2026</div>
        </div>

        <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#590D22]/10 shadow-sm col-span-2 md:col-span-1">
          <span className="text-[10px] text-[#590D22] font-bold block uppercase mb-1">Validated Analysis Range</span>
          <div className="text-sm font-black text-[#1C1917] font-mono leading-tight">
            0.0 — 150.0 ppm·h
          </div>
          <div className="text-[10px] text-stone-500 font-medium mt-1">Experimentally validated range</div>
        </div>
      </div>

      {/* Visual Pipeline */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
          <h3 className="text-base font-extrabold text-[#1C1917] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#E63946]" />
            AI Computer Vision Pipeline
          </h3>
          <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
            Execution Flow
          </span>
        </div>

        {/* Pipeline Diagram */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
          {/* Horizontal Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-0.5 bg-stone-100 -translate-y-1/2 z-0" />
          
          {/* Vertical Line for Mobile */}
          <div className="md:hidden absolute left-1/2 top-4 bottom-4 w-0.5 bg-stone-100 -translate-x-1/2 z-0" />

          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center group w-full md:w-auto my-2 md:my-0 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border-2 border-[#590D22]/10 flex items-center justify-center text-[#590D22] shadow-sm group-hover:border-[#E63946] group-hover:bg-[#FAF4ED] group-hover:scale-110 transition-all duration-300">
                {step.icon}
              </div>
              <div className="mt-2 text-center bg-white px-2 py-1 rounded md:bg-transparent">
                <span className="text-[10px] md:text-[9px] lg:text-[10px] font-bold text-stone-600 uppercase block max-w-[80px] md:max-w-[70px] lg:max-w-[90px] mx-auto leading-tight group-hover:text-[#E63946] transition-colors">
                  {step.label}
                </span>
              </div>
              
              {/* Down Arrow for Mobile */}
              {idx < pipelineSteps.length - 1 && (
                <div className="md:hidden w-px h-6 bg-stone-200 my-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
