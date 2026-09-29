import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MobileHomeScreen() {
  const { worker, band, latestReading, todayReadings, alerts, currentRole, setRole } = useApp();
  const router = useRouter();

  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>⚡</Text>
            </View>
            <View>
              <Text style={styles.appName}>H₂S <Text style={styles.appRed}>Guard</Text></Text>
              <Text style={styles.welcomeText}>Welcome, {worker.name}</Text>
            </View>
          </View>

          {/* Role selector pill */}
          <TouchableOpacity
            style={styles.rolePill}
            onPress={() => {
              const nextRole = currentRole === 'worker' ? 'supervisor' : currentRole === 'supervisor' ? 'admin' : 'worker';
              setRole(nextRole);
            }}
          >
            <Text style={styles.roleText}>{currentRole.toUpperCase()} VIEW</Text>
          </TouchableOpacity>
        </View>

        {/* Scan Hero Banner */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>📷 Optical & QR Camera Scanner</Text>
          <Text style={styles.heroTitle}>Scan Dosimeter</Text>
          <Text style={styles.heroSub}>
            Capture your passive wristband indicator strip to record cumulative H₂S dose.
          </Text>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push('/scan')}
          >
            <Text style={styles.scanButtonText}>📷 Open Scanner</Text>
          </TouchableOpacity>
        </View>

        {/* Status Metrics Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>PAIRED WRISTBAND</Text>
            <Text style={styles.metricVal}>{band.serialNumber}</Text>
            <Text style={styles.metricSub}>Integrity {band.opticalIntegrityPct}%</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>SHIFT CUMULATIVE</Text>
            <Text style={styles.metricVal}>{worker.accumulatedShiftPpmH} <Text style={{fontSize: 12}}>ppm·h</Text></Text>
            <Text style={styles.metricSub}>Scans Today: {todayReadings.length}</Text>
          </View>
        </View>

        {/* Latest Reading Card */}
        {latestReading && (
          <View style={styles.readingCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Latest Reading</Text>
              <View style={[styles.statusBadge, latestReading.status === 'HIGH_EXPOSURE' ? styles.bgRed : latestReading.status === 'ATTENTION' ? styles.bgAmber : styles.bgGreen]}>
                <Text style={styles.statusText}>{latestReading.status}</Text>
              </View>
            </View>
            <Text style={styles.doseLarge}>{latestReading.exposureDosePpmH.toFixed(1)} <Text style={{fontSize: 16, color: '#78716C'}}>ppm·h</Text></Text>
            <Text style={styles.locationText}>📍 {latestReading.location}</Text>
            <Text style={styles.timeText}>🕒 {new Date(latestReading.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}

        {/* Active Alerts Banner */}
        {unreadAlerts.length > 0 && (
          <TouchableOpacity style={styles.alertCard} onPress={() => router.push('/alerts')}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={{flex: 1}}>
              <Text style={styles.alertTitle}>{unreadAlerts.length} Unacknowledged Alert(s)</Text>
              <Text style={styles.alertSub}>{unreadAlerts[0].title} - Tap to review</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF4ED' },
  scrollContent: { padding: 16, gap: 16 },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(89,13,34,0.08)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#E63946', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 20 },
  appName: { fontSize: 18, fontWeight: '900', color: '#1C1917' },
  appRed: { color: '#E63946' },
  welcomeText: { fontSize: 12, color: '#78716C', fontWeight: '600' },
  rolePill: { backgroundColor: '#590D22', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  roleText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },

  heroCard: {
    backgroundColor: '#590D22',
    borderRadius: 24,
    padding: 20,
    gap: 8,
  },
  heroTag: { color: '#FFB703', fontSize: 11, fontWeight: '700' },
  heroTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  heroSub: { color: '#E7E5E4', fontSize: 12, lineHeight: 18 },
  scanButton: {
    backgroundColor: '#E63946',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  scanButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },

  metricsRow: { flexDirection: 'row', gap: 12 },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(89,13,34,0.08)',
    gap: 4,
  },
  metricLabel: { fontSize: 9, fontWeight: '800', color: '#78716C' },
  metricVal: { fontSize: 16, fontWeight: '900', color: '#1C1917' },
  metricSub: { fontSize: 10, color: '#A8A29E', fontWeight: '600' },

  readingCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(89,13,34,0.08)',
    gap: 6,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#1C1917' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  bgGreen: { backgroundColor: '#DCFCE7' },
  bgAmber: { backgroundColor: '#FEF3C7' },
  bgRed: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 10, fontWeight: '900', color: '#1C1917' },
  doseLarge: { fontSize: 32, fontWeight: '900', color: '#1C1917' },
  locationText: { fontSize: 12, fontWeight: '600', color: '#44403C' },
  timeText: { fontSize: 11, color: '#78716C' },

  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 12,
  },
  alertIcon: { fontSize: 24 },
  alertTitle: { fontSize: 13, fontWeight: '800', color: '#991B1B' },
  alertSub: { fontSize: 11, color: '#B91C1C' },
});
