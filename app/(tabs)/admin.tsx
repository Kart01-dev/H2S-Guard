import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MobileAdminScreen() {
  const { auditLogs } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin & SHA-256 Audit Ledger</Text>
        <Text style={styles.subtitle}>Cryptographically Sealed Compliance Event Log</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {auditLogs.map(log => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.logTop}>
              <Text style={styles.logAction}>{log.action}</Text>
              <Text style={styles.logTime}>{new Date(log.timestamp).toLocaleTimeString()}</Text>
            </View>
            <Text style={styles.logUser}>{log.userName}</Text>
            <Text style={styles.logEntity}>{log.entity} • {log.result}</Text>
            <Text style={styles.logHash}>{log.hash}</Text>
          </View>
        ))}

        {auditLogs.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No live audit events logged yet. Perform a scan or role switch to trigger SHA-256 cryptographic logging.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF4ED' },
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: 'rgba(89,13,34,0.08)' },
  title: { fontSize: 20, fontWeight: '900', color: '#1C1917' },
  subtitle: { fontSize: 12, color: '#78716C', marginTop: 2 },
  content: { padding: 16, gap: 12 },
  logCard: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(89,13,34,0.08)', gap: 4 },
  logTop: { flexDirection: 'row', justifyContent: 'space-between' },
  logAction: { fontSize: 11, fontWeight: '900', color: '#590D22' },
  logTime: { fontSize: 10, color: '#A8A29E' },
  logUser: { fontSize: 13, fontWeight: '800', color: '#1C1917' },
  logEntity: { fontSize: 11, color: '#44403C' },
  logHash: { fontSize: 10, fontFamily: 'monospace', color: '#15803D', fontWeight: '700' },
  emptyCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, alignItems: 'center' },
  emptyText: { fontSize: 12, color: '#78716C', textAlign: 'center' },
});
