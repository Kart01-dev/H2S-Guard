import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useApp } from '../src/context/AppContext';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { presetScanScenarios } from '../src/data/mockData';
import type { SafetyStatus } from '../src/types';

export default function MobileScanScreen() {
  const { addReading, worker, band } = useApp();
  const router = useRouter();

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [saved, setSaved] = useState(false);

  const scenario = presetScanScenarios[selectedPreset];

  const handleCapture = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(scenario);
    }, 1200);
  };

  const handleSave = () => {
    if (!result) return;
    addReading({
      workerId: worker.id,
      workerName: worker.name,
      bandId: band.serialNumber,
      exposureDosePpmH: result.exposureDosePpmH,
      status: result.status as SafetyStatus,
      confidencePct: result.confidencePct,
      shiftDurationMinutes: result.shiftDurationMinutes,
      exposureRatePpmH: result.exposureRatePpmH,
      location: 'Pump Station B - Sector 4',
      colorShiftHex: result.colorShiftHex,
      baselineColorHex: result.baselineColorHex,
      qualityScorePct: result.qualityScorePct,
      deltaE: result.deltaE,
      rawRgb: result.rawRgb,
    });
    setSaved(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Dosimeter</Text>
        <View style={{ width: 50 }} />
      </View>

      {!result ? (
        <View style={styles.viewport}>
          {/* Target Frame */}
          <View style={styles.targetFrame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            <Text style={styles.frameLabel}>Place wristband inside frame</Text>
          </View>

          {analyzing ? (
            <View style={styles.analyzingBox}>
              <Text style={styles.analyzingText}>Analyzing optical color matrix...</Text>
              <Text style={styles.analyzingSub}>Calculating ΔE shift &amp; ppm·h dose</Text>
            </View>
          ) : (
            <View style={styles.controlsBox}>
              <Text style={styles.presetLabel}>Demo Preset Scan Scenario:</Text>
              <View style={styles.presetRow}>
                {presetScanScenarios.map((sc, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.presetChip, selectedPreset === idx && styles.presetChipActive]}
                    onPress={() => setSelectedPreset(idx)}
                  >
                    <Text style={[styles.presetText, selectedPreset === idx && styles.presetTextActive]}>
                      {sc.status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.shutterBtn} onPress={handleCapture}>
                <Text style={styles.shutterText}>📷 Capture &amp; Analyze</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.resultHeader}>EXPOSURE RESULT</Text>
            <Text style={styles.resultStatus}>{result.status}</Text>
            <Text style={styles.doseLarge}>{result.exposureDosePpmH.toFixed(1)} <Text style={{ fontSize: 16 }}>ppm·h</Text></Text>
            <Text style={styles.confidenceText}>Confidence: {result.confidencePct}% • ΔE {result.deltaE.toFixed(1)}</Text>
          </View>

          {!saved ? (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>💾 Save Reading</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.savedBox}>
              <Text style={styles.savedText}>✓ Reading Saved to Shift Record</Text>
            </View>
          )}

          <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  closeBtn: { padding: 8 },
  closeText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  headerTitle: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  viewport: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  targetFrame: {
    width: 260,
    height: 260,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: '#E63946' },
  tl: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  tr: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  bl: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  br: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  frameLabel: { color: '#E7E5E4', fontSize: 12, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  controlsBox: { marginTop: 40, width: '100%', alignItems: 'center', gap: 14 },
  presetLabel: { color: '#A8A29E', fontSize: 11, fontWeight: '700' },
  presetRow: { flexDirection: 'row', gap: 6 },
  presetChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: '#27272A' },
  presetChipActive: { backgroundColor: '#E63946' },
  presetText: { color: '#A8A29E', fontSize: 10, fontWeight: '800' },
  presetTextActive: { color: '#FFFFFF' },
  shutterBtn: { backgroundColor: '#E63946', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 20, width: '100%', alignItems: 'center' },
  shutterText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  analyzingBox: { marginTop: 40, alignItems: 'center', gap: 8 },
  analyzingText: { color: '#FFB703', fontSize: 16, fontWeight: '900' },
  analyzingSub: { color: '#A8A29E', fontSize: 12 },

  resultContainer: { padding: 20, gap: 16 },
  resultCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 24, alignItems: 'center', gap: 8 },
  resultHeader: { fontSize: 11, fontWeight: '900', color: '#78716C', letterSpacing: 1 },
  resultStatus: { fontSize: 24, fontWeight: '900', color: '#590D22' },
  doseLarge: { fontSize: 44, fontWeight: '900', color: '#1C1917' },
  confidenceText: { fontSize: 12, color: '#78716C', fontWeight: '600' },
  saveBtn: { backgroundColor: '#E63946', padding: 16, borderRadius: 16, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  savedBox: { backgroundColor: '#DCFCE7', padding: 14, borderRadius: 16, alignItems: 'center' },
  savedText: { color: '#15803D', fontWeight: '800', fontSize: 14 },
  doneBtn: { padding: 14, alignItems: 'center' },
  doneBtnText: { color: '#A8A29E', fontWeight: '700', fontSize: 14 },
});
