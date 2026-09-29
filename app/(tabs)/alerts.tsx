import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AlertItem } from '../../src/types';

export default function MobileAlertsScreen() {
  const { alerts, acknowledgeAlert, resolveAlert, simulateEscalationTimeout } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Alerts & Incidents</Text>
        <Text style={styles.subtitle}>Supervisor Escalation Lifecycle & Incident Resolution</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {alerts.map(alt => (
          <TouchableOpacity
            key={alt.id}
            style={[styles.alertCard, alt.severity === 'critical' ? styles.borderRed : alt.severity === 'warning' ? styles.borderAmber : styles.borderStone]}
            onPress={() => setSelectedAlert(alt)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.alertTitle}>{alt.title}</Text>
              <View style={[styles.badge, alt.resolved ? styles.bgGreen : alt.acknowledged ? styles.bgBlue : styles.bgRed]}>
                <Text style={styles.badgeText}>{alt.resolved ? 'RESOLVED' : alt.acknowledged ? 'ACKNOWLEDGED' : 'ACTIVE'}</Text>
              </View>
            </View>

            <Text style={styles.message}>{alt.message}</Text>
            <Text style={styles.location}>📍 {alt.location || 'Site Area'} • {new Date(alt.timestamp).toLocaleTimeString()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <Modal animationType="slide" transparent visible={!!selectedAlert}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedAlert.title}</Text>
              <Text style={styles.modalMessage}>{selectedAlert.message}</Text>

              <View style={styles.detailBox}>
                <Text style={styles.detailItem}>Location: {selectedAlert.location}</Text>
                <Text style={styles.detailItem}>Category: {selectedAlert.category}</Text>
                <Text style={styles.detailItem}>Severity: {selectedAlert.severity.toUpperCase()}</Text>
                <Text style={styles.detailItem}>Status: {selectedAlert.resolved ? 'Resolved ✓' : selectedAlert.acknowledged ? 'Acknowledged ✓' : 'Pending'}</Text>
              </View>

              <View style={styles.btnRow}>
                {!selectedAlert.acknowledged && (
                  <TouchableOpacity
                    style={styles.btnAck}
                    onPress={() => {
                      acknowledgeAlert(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                  >
                    <Text style={styles.btnText}>Acknowledge</Text>
                  </TouchableOpacity>
                )}

                {!selectedAlert.resolved && (
                  <TouchableOpacity
                    style={styles.btnResolve}
                    onPress={() => {
                      resolveAlert(selectedAlert.id, 'Resolved via mobile application.');
                      setSelectedAlert(null);
                    }}
                  >
                    <Text style={styles.btnText}>Resolve Incident</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity style={styles.btnClose} onPress={() => setSelectedAlert(null)}>
                <Text style={styles.btnCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF4ED' },
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: 'rgba(89,13,34,0.08)' },
  title: { fontSize: 20, fontWeight: '900', color: '#1C1917' },
  subtitle: { fontSize: 12, color: '#78716C', marginTop: 2 },
  listContainer: { padding: 16, gap: 12 },
  alertCard: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 18, borderWidth: 2, gap: 8 },
  borderRed: { borderColor: '#FCA5A5' },
  borderAmber: { borderColor: '#FDE68A' },
  borderStone: { borderColor: '#E7E5E4' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertTitle: { fontSize: 14, fontWeight: '800', color: '#1C1917', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  bgGreen: { backgroundColor: '#DCFCE7' },
  bgBlue: { backgroundColor: '#DBEAFE' },
  bgRed: { backgroundColor: '#FEE2E2' },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#1C1917' },
  message: { fontSize: 12, color: '#44403C', lineHeight: 16 },
  location: { fontSize: 11, color: '#78716C', fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#1C1917' },
  modalMessage: { fontSize: 13, color: '#44403C' },
  detailBox: { backgroundColor: '#FAF4ED', padding: 12, borderRadius: 12, gap: 4 },
  detailItem: { fontSize: 12, fontWeight: '600', color: '#590D22' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnAck: { flex: 1, backgroundColor: '#590D22', padding: 12, borderRadius: 12, alignItems: 'center' },
  btnResolve: { flex: 1, backgroundColor: '#16A34A', padding: 12, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  btnClose: { padding: 12, alignItems: 'center', marginTop: 4 },
  btnCloseText: { color: '#78716C', fontWeight: '700' },
});
