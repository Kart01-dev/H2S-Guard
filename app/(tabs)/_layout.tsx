import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../../src/context/AppContext';

export default function TabsLayout() {
  const { unreadAlertsCount, currentRole } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E63946',
        tabBarInactiveTintColor: '#78716C',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: 'rgba(89,13,34,0.1)',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>📊</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarBadge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#E63946', fontSize: 10 },
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>⚠️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>👤</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="supervisor"
        options={{
          title: 'Supervisor',
          href: currentRole === 'worker' ? null : '/supervisor',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>🛡️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          href: currentRole === 'admin' ? '/admin' : null,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>⚙️</Text>
          ),
        }}
      />
    </Tabs>
  );
}
