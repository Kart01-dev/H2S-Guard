import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MobileProfileScreen() {
  const { worker, band, recalibrateBand, currentRole, setRole, resetSystemData } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Worker Info Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: worker.avatarUrl }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{worker.name}</Text>
            <Text style={styles.sub}>{worker.employeeId} • {worker.department}</Text>
            <Text style={styles.roleTag}>Role: {worker.role}</Text>
          </View>
        </View>

        {/* Active Role Selector */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Perspective View Role</Text>
          <View style={styles.roleBtnRow}>
            {(['worker', 'supervisor', 'admin'] as const).map(r => (
              <TouchableOpacity
                key={r}
                style={[styles.roleBtn, currentRole === r && styles.roleBtnActive]}
                onPress={() => setRole(r)}
              >
                <Text style={[styles.roleBtnText, currentRole === r && styles.roleBtnTextActive]}>
                  {r.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dosimeter Band Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Paired Dosimeter Band</Text>
          <View style={styles.bandRow}>
            <Text style={styles.bandLabel}>Serial Number</Text>
            <Text style={styles.bandVal}>{band.serialNumber}</Text>
          </View>
          <View style={styles.bandRow}>
            <Text style={styles.bandLabel}>Optical Integrity</Text>
            <Text style={styles.bandVal}>{band.opticalIntegrityPct}%</Text>
          </View>
          <View style={styles.bandRow}>
            <Text style={styles.bandLabel}>Calibration Due</Text>
            <Text style={styles.bandVal}>{band.calibrationDueDate}</Text>
          </View>

          <TouchableOpacity style={styles.recalBtn} onPress={recalibrateBand}>
            <Text style={styles.recalBtnText}>🔄 Recalibrate Optical Matrix</Text>
          </TouchableOpacity>
        </View>

        {/* Reset System Button */}
        <TouchableOpacity style={styles.resetBtn} onPress={resetSystemData}>
          <Text style={styles.resetBtnText}>Clear Local Storage & Reset Demo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF4ED' },
  content: { padding: 16, gap: 16 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(89,13,34,0.08)', gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#E7E5E4' },
  info: { gap: 2 },
  name: { fontSize: 18, fontWeight: '900', color: '#1C1917' },
  sub: { fontSize: 12, color: '#78716C', fontWeight: '600' },
  roleTag: { fontSize: 11, fontWeight: '700', color: '#E63946', marginTop: 2 },

  sectionCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(89,13,34,0.08)', gap: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: '#1C1917' },
  roleBtnRow: { flexDirection: 'row', gap: 8 },
  roleBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FAF4ED', alignItems: 'center', borderWidth: 1, borderColor: '#E7E5E4' },
  roleBtnActive: { backgroundColor: '#590D22', borderColor: '#590D22' },
  roleBtnText: { fontSize: 10, fontWeight: '800', color: '#44403C' },
  roleBtnTextActive: { color: '#FFFFFF' },

  bandRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bandLabel: { fontSize: 12, color: '#78716C', fontWeight: '600' },
  bandVal: { fontSize: 12, fontWeight: '800', color: '#1C1917' },
  recalBtn: { backgroundColor: '#590D22', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  recalBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },

  resetBtn: { backgroundColor: '#FEF2F2', padding: 14, borderRadius: 16, alignItems: 'center', borderBottomWidth: 1, borderColor: '#FECACA' },
  resetBtnText: { color: '#991B1B', fontWeight: '800', fontSize: 12 },
});
