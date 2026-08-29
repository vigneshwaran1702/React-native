import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { TaskStats } from '../types';

interface StatsDashboardProps {
  stats: TaskStats | null;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;
  const pending = stats?.pending ?? 0;
  const completionRate = stats?.completionRate ?? 0;
  const overdue = stats?.overdue ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>OVERVIEW</Text>
        {overdue > 0 && (
          <View style={styles.overdueBadge}>
            <Text style={styles.overdueText}>🔴 {overdue} Overdue</Text>
          </View>
        )}
      </View>

      <View style={styles.cardsRow}>
        <View style={[styles.statCard, styles.totalCard]}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>

        <View style={[styles.statCard, styles.doneCard]}>
          <Text style={[styles.statValue, { color: colors.success }]}>{completed}</Text>
          <Text style={styles.statLabel}>DONE</Text>
        </View>

        <View style={[styles.statCard, styles.pendingCard]}>
          <Text style={[styles.statValue, { color: colors.accent }]}>{pending}</Text>
          <Text style={styles.statLabel}>PENDING</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Completion Rate</Text>
          <Text style={styles.progressValue}>{completionRate}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(Math.max(completionRate, 0), 100)}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    ...typography.badge,
    color: colors.textSubtle,
    fontSize: 12,
  },
  overdueBadge: {
    backgroundColor: colors.overdueBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.overdueBorder,
  },
  overdueText: {
    color: colors.overdue,
    fontSize: 11,
    fontWeight: '700',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  totalCard: {},
  doneCard: {},
  pendingCard: {},
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    ...typography.badge,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  progressSection: {
    marginTop: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: colors.inputBg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
});
