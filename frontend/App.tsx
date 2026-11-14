import React from 'react';
import { SafeAreaView, View, Text, StatusBar } from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#003366' }}>
            AI Ticket IT
          </Text>
          <Text style={{ fontSize: 16, color: '#666', marginTop: 8 }}>
            App Móvil - React Native
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}