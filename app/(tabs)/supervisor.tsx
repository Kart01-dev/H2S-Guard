import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MobileSupervisorScreen() {
  const { readings, alerts, todayReadings, triggerDemoEvent } = useApp();

  const highAlerts = alerts.filter(a => a.severity === 'critical');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Supervisor Command & Monitor</Text>
        <Text style={styles.subtitle}>Site-Wide Worker Exposure Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* KPI Cards */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiNum}>{todayReadings.length}</Text>
            <Text style={styles.kpiLabel}>Total Scans Today</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={[styles.kpiNum, { color: '#E63946' }]}>{highAlerts.length}</Text>
            <Text style={styles.kpiLabel}>Critical Incidents</Text>
          </View>
        </View>

        {/* Quick Demo Controls */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Simulate Shift Incidents</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.demoBtn} onPress={() => triggerDemoEvent('demo_high')}>
              <Text style={styles.demoBtnText}>🚨 Trigger High Exposure</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoBtn} onPress={() => triggerDemoEvent('demo_attention')}>
              <Text style={styles.demoBtnText}>⚠️ Trigger Attention</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Incident Stream */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Live Exposure Stream</Text>
          {readings.slice(0, 5).map(r => (
            <View key={r.id} style={styles.streamRow}>
              <View style={{flex: 1}}>
                <Text style={styles.streamWorker}>{r.workerName}</Text>
                <Text style={styles.streamLoc}>{r.location}</Text>
              </View>
              <Text style={styles.streamDose}>{r.exposureDosePpmH.toFixed(1)} ppm·h</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF4ED' },
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: 'rgba(89,13,34,0.08)' },
  title: { fontSize: 20, fontWeight: '900', color: '#1C1917' },
  subtitle: { fontSize: 12, color: '#78716C', marginTop: 2 },
  content: { padding: 16, gap: 16 },
  kpiGrid: { flexDirection: 'row', gap: 12 },
  kpiCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(89,13,34,0.08)', gap: 4 },
  kpiNum: { fontSize: 28, fontWeight: '900', color: '#1C1917' },
  kpiLabel: { fontSize: 11, fontWeight: '700', color: '#78716C' },
  sectionCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(89,13,34,0.08)', gap: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: '#1C1917' },
  btnRow: { flexDirection: 'row', gap: 8 },
  demoBtn: { flex: 1, backgroundColor: '#590D22', padding: 12, borderRadius: 12, alignItems: 'center' },
  demoBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 11 },
  streamRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F4' },
  streamWorker: { fontSize: 13, fontWeight: '800', color: '#1C1917' },
  streamLoc: { fontSize: 11, color: '#78716C' },
  streamDose: { fontSize: 14, fontWeight: '900', color: '#590D22' },
});
