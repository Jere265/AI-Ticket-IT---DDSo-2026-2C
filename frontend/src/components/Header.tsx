import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  titulo?: string;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ titulo, onOpenSettings }) => {
  const { rol, setRol, backendConectado } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.ticketIcon}>
            <Text style={styles.ticketText}>AI</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>Ticket It</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: backendConectado ? Colors.success : Colors.danger }]} />
              <Text style={styles.statusText}>
                {backendConectado ? 'Backend Online' : 'Sin conexión'}
              </Text>
            </View>
          </View>
        </View>

        {/* Selector de Rol para demo ágil */}
        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[styles.roleBtn, rol === 'comprador' && styles.roleBtnActive]}
            onPress={() => setRol('comprador')}
          >
            <Text style={[styles.roleBtnText, rol === 'comprador' && styles.roleBtnTextActive]}>
              Comprador
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, rol === 'organizador' && styles.roleBtnActive]}
            onPress={() => setRol('organizador')}
          >
            <Text style={[styles.roleBtnText, rol === 'organizador' && styles.roleBtnTextActive]}>
              Organizador
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {titulo && <Text style={styles.pageTitle}>{titulo}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ticketIcon: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  roleBtnActive: {
    backgroundColor: Colors.primary,
  },
  roleBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 10,
  },
});
