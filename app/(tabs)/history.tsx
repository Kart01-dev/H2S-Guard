import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MobileHistoryScreen() {
  const { readings } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'NORMAL' | 'ATTENTION' | 'HIGH_EXPOSURE'>('ALL');

  const filteredReadings = readings.filter(r => filter === 'ALL' || r.status === filter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exposure Logs & History</Text>
        <Text style={styles.subtitle}>Complete digital record of scanned wristbands</Text>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {(['ALL', 'NORMAL', 'ATTENTION', 'HIGH_EXPOSURE'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredReadings.map(rdg => (
          <View key={rdg.id} style={styles.logCard}>
            <View style={styles.cardTop}>
              <Text style={styles.location}>📍 {rdg.location}</Text>
              <View style={[styles.statusBadge, rdg.status === 'HIGH_EXPOSURE' ? styles.bgRed : rdg.status === 'ATTENTION' ? styles.bgAmber : styles.bgGreen]}>
                <Text style={styles.statusText}>{rdg.status}</Text>
              </View>
            </View>

            <View style={styles.doseRow}>
              <Text style={styles.doseVal}>{rdg.exposureDosePpmH.toFixed(1)} <Text style={styles.unit}>ppm·h</Text></Text>
              <Text style={styles.deltaE}>ΔE {rdg.deltaE.toFixed(1)} • {rdg.confidencePct}% conf</Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>Band: {rdg.bandId}</Text>
              <Text style={styles.footerText}>{new Date(rdg.timestamp).toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF4ED' },
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: 'rgba(89,13,34,0.08)' },
  title: { fontSize: 20, fontWeight: '900', color: '#1C1917' },
  subtitle: { fontSize: 12, color: '#78716C', marginTop: 2 },
  filterRow: { flexDirection: 'row', padding: 12, gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7E5E4' },
  filterChipActive: { backgroundColor: '#590D22', borderColor: '#590D22' },
  filterText: { fontSize: 10, fontWeight: '800', color: '#44403C' },
  filterTextActive: { color: '#FFFFFF' },
  listContainer: { padding: 16, gap: 12 },
  logCard: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(89,13,34,0.08)', gap: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  location: { fontSize: 13, fontWeight: '800', color: '#1C1917' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  bgGreen: { backgroundColor: '#DCFCE7' },
  bgAmber: { backgroundColor: '#FEF3C7' },
  bgRed: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 10, fontWeight: '900', color: '#1C1917' },
  doseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  doseVal: { fontSize: 22, fontWeight: '900', color: '#1C1917' },
  unit: { fontSize: 12, color: '#78716C' },
  deltaE: { fontSize: 11, color: '#78716C', fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6, borderTopWidth: 1, borderTopColor: '#F5F5F4' },
  footerText: { fontSize: 10, color: '#A8A29E', fontWeight: '600' },
});
