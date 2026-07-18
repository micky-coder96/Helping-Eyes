// src/components/ResultCard.tsx - Simple Version
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface ResultCardProps {
  title?: string;
  description?: string;
  variant?: 'success' | 'error' | 'info';
  onClose?: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
  timestamp?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title = 'Result',
  description,
  variant = 'success',
  onClose,
  onRetry,
  showRetry = false,
  timestamp,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'error':
        return {bg: '#FEE2E2', border: '#DC2626', icon: '❌'};
      case 'info':
        return {bg: '#DBEAFE', border: '#3B82F6', icon: 'ℹ️'};
      default:
        return {bg: '#D1FAE5', border: '#10B981', icon: '✅'};
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.bg,
          borderLeftColor: colors.border,
        },
      ]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>{colors.icon}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.description}>{description}</Text>

      {timestamp && <Text style={styles.timestamp}>🕒 {timestamp}</Text>}

      {showRetry && onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>⟳ Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ResultCard;
