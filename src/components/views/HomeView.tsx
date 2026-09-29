import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import {
  Scan,
  ShieldAlert,
  Clock,
  Activity,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Info,
  Camera,
  Bell,
  Radio,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    worker,
    band,
    latestReading,
    todayReadings,
    alerts,
    openScanner,
    openNotificationCenter,
    setActiveTab,
    setSelectedReading,
    unreadNotificationsCount,
  } = useApp();

  const unreadAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="space-y-6 animate-fadeIn pb-4">
      {/* Top Header Row: Logo, Worker Greeting, Notification Bell */}
      <div className="flex items-center justify-between bg-corp-light dark:bg-stone-800 p-4 sm:p-5 rounded-3xl border border-stone-200 dark:border-stone-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden border border-stone-200">
            <img src="/mrpl-logo.png" alt="MRPL Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold text-[#1C1917] dark:text-white tracking-tight font-display">
                H₂S <span className="text-corp-accent">Guard</span>
              </h1>
              <span className="text-[10px] font-extrabold bg-corp-primary/10 text-corp-primary dark:bg-corp-accent/20 dark:text-corp-accent px-2 py-0.5 rounded-full uppercase tracking-wider">
                Industrial
              </span>
            </div>
            <p className="text-xs font-semibold text-stone-600 dark:text-stone-400 mt-0.5">
              Welcome back, <span className="text-[#1C1917] dark:text-white font-bold">{worker.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button
            onClick={openNotificationCenter}
            className="relative p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-[#1C1917] dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors cursor-pointer shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-corp-primary dark:text-corp-accent" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white dark:border-stone-800 animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hero Card: Prominent Scan Dosimeter Action */}
      <div className="relative overflow-hidden bg-gradient-to-br from-corp-primary via-[#2E7D32] to-[#4CAF50] text-white rounded-3xl p-6 sm:p-10 shadow-corp-hero border border-white/10">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute right-16 top-4 w-36 h-36 rounded-full bg-corp-accent/40 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-white/95 border border-white/15">
              <Camera className="w-4 h-4 text-corp-accent" />
              <span>Mobile Optical Camera & QR Scanner</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight font-display">
              Scan Dosimeter
            </h2>
            <p className="text-xs sm:text-sm text-stone-100 leading-relaxed font-medium max-w-sm">
              Measure your latest H₂S exposure dose by capturing your passive wristband colorimetric indicator strip.
            </p>
          </div>

          <button
            onClick={openScanner}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-stone-50 text-corp-primary rounded-full font-black text-base shadow-2xl flex items-center justify-center gap-3 transition-transform transform active:scale-95 cursor-pointer border border-white/20 shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-corp-primary/10 flex items-center justify-center">
              <Camera className="w-5 h-5 stroke-[2.5] text-corp-primary" />
            </div>
            <span>Scan Now</span>
          </button>
        </div>
      </div>

      {/* Grid: Today's Exposure & Current Band */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Today's Exposure */}
        <Card variant="white" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-corp-primary/10 dark:bg-corp-primary/20 text-corp-primary dark:text-corp-accent rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1C1917] dark:text-white">
                    Today's Exposure
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                    Shift Cumulative TWA Dose
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-corp-primary dark:text-corp-accent font-mono bg-corp-primary/10 dark:bg-corp-primary/20 px-2.5 py-1 rounded-lg">
                OSHA: 50 ppm·h
              </span>
            </div>

            <div className="my-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#1C1917] dark:text-white font-mono tracking-tight">
                {worker.accumulatedShiftPpmH}
              </span>
              <span className="text-sm font-bold text-stone-500 dark:text-stone-400">ppm·h</span>

              <div className="ml-auto text-right">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {((worker.accumulatedShiftPpmH / 50) * 100).toFixed(0)}% Shift Limit
                </span>
              </div>
            </div>

            <div className="space-y-1.5 mt-4">
              <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 font-semibold">
                <span>0 ppm·h</span>
                <span>25 (Attention)</span>
                <span>50 (Action Limit)</span>
              </div>
              <div className="h-3 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-200 dark:border-stone-700">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-corp-accent via-amber-500 to-red-500"
                  style={{
                    width: `${Math.min(
                      (worker.accumulatedShiftPpmH / 50) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
              Scans today: {todayReadings.length}
            </span>
            <button
              onClick={() => setActiveTab('history')}
              className="text-corp-primary dark:text-corp-accent font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              View Full History <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Current Band */}
        <Card variant="white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1C1917]">
                  Current Band
                </h3>
                <p className="text-xs font-mono text-stone-500 font-semibold">
                  {band.serialNumber}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 text-xs font-extrabold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              ACTIVE
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-semibold">Sensor Model:</span>
              <span className="font-bold text-[#1C1917]">{band.model}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-semibold">Optical Integrity:</span>
              <span className="font-bold text-emerald-700">{band.opticalIntegrityPct}%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500 font-semibold">Calibration Due:</span>
              <span className="font-bold text-stone-800">{band.calibrationDueDate}</span>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-bold"
              onClick={() => setActiveTab('profile')}
            >
              View Band Profile & Pairing
            </Button>
          </div>
        </Card>
      </div>

      {/* Grid: Last Reading & Recent Alert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Last Reading */}
        <Card variant="white" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-extrabold text-[#1C1917]">
                Last Reading
              </h3>
              {latestReading && <StatusBadge status={latestReading.status} size="sm" />}
            </div>

            {latestReading ? (
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#1C1917] font-mono">
                    {latestReading.exposureDosePpmH}
                  </span>
                  <span className="text-xs font-bold text-stone-500">ppm·h</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md ml-auto border border-emerald-200">
                    Confidence {latestReading.confidencePct}%
                  </span>
                </div>

                <div className="bg-[#FAF4ED] p-3 rounded-2xl border border-[#590D22]/08 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Location:</span>
                    <span className="font-bold text-[#1C1917] truncate max-w-[180px]">
                      {latestReading.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Duration:</span>
                    <span className="font-bold text-[#1C1917]">
                      {Math.floor(latestReading.shiftDurationMinutes / 60)}h{' '}
                      {latestReading.shiftDurationMinutes % 60}m
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-stone-500 font-medium">Indicator Pad Color:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-stone-300 shadow-sm"
                      style={{ backgroundColor: latestReading.colorShiftHex }}
                    />
                    <span className="font-mono text-stone-700 font-bold">
                      {latestReading.colorShiftHex}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-stone-500">No scans recorded yet for this shift.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-right">
            <button
              onClick={() => {
                if (latestReading) {
                  setSelectedReading(latestReading);
                  setActiveTab('history');
                }
              }}
              className="text-xs font-bold text-[#590D22] hover:text-[#E63946] flex items-center gap-1 justify-end cursor-pointer"
            >
              Analyze Optical Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Recent Alert */}
        <Card variant="white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-[#FAF4ED] text-[#E63946] rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1C1917]">
                  Recent Alert
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {unreadAlerts.length} Active System Notices
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs font-bold text-[#E63946] hover:underline cursor-pointer"
            >
              All Alerts
            </button>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-2xl border text-xs transition-colors ${
                  alert.severity === 'critical'
                    ? 'bg-red-50/70 border-red-200 text-red-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="truncate">{alert.title}</span>
                  <span className="text-[10px] font-mono text-stone-500">
                    {new Date(alert.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-[11px] line-clamp-2 opacity-90">{alert.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Safety Compliance Footnote */}
      <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#590D22]/10 text-xs text-stone-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#590D22] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Industrial Safety Dosimetry Protocol:</strong> H₂S Guard measures cumulative shift exposure dose ($ppm \cdot h$). Always verify wristband positioning and ensure clear lighting prior to optical camera capture.
        </p>
      </div>
    </div>
  );
};
