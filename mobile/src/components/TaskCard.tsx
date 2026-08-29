import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { Task } from '../types';
import { Badge } from './Badge';
import { getUrgencyInfo } from '../utils/urgency';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleComplete: () => void;
  onDelete?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggleComplete,
}) => {
  const isCompleted = task.status === 'COMPLETED';
  const urgency = getUrgencyInfo(task.deadline, task.priority, task.status);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isCompleted && styles.completedCard,
        urgency.isOverdue && !isCompleted && styles.overdueCard,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Top badges row */}
      <View style={styles.badgeRow}>
        <View style={styles.leftBadges}>
          <Badge type="priority" value={task.priority} />
          <Badge type="category" value={task.category} style={styles.categoryBadge} />
        </View>

        {urgency.isOverdue && !isCompleted && (
          <View style={styles.overduePill}>
            <Text style={styles.overduePillText}>⚠️ OVERDUE</Text>
          </View>
        )}
      </View>

      {/* Main Content & Checkbox */}
      <View style={styles.bodyRow}>
        <TouchableOpacity
          style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
          onPress={onToggleComplete}
          activeOpacity={0.7}
        >
          {isCompleted && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>

        <View style={styles.contentColumn}>
          <Text
            style={[styles.title, isCompleted && styles.completedTitle]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {task.description.length > 0 && (
            <Text
              style={[styles.description, isCompleted && styles.completedDescription]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          )}

          {/* Deadline / Countdown Row */}
          <View style={styles.deadlineRow}>
            <Text
              style={[
                styles.deadlineText,
                urgency.isOverdue && !isCompleted && styles.overdueDeadlineText,
                isCompleted && styles.completedDeadlineText,
              ]}
            >
              {isCompleted ? '✓ Completed' : `⏰ ${urgency.dueLabel}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  completedCard: {
    opacity: 0.65,
    borderColor: 'rgba(35, 50, 77, 0.4)',
  },
  overdueCard: {
    borderColor: 'rgba(239, 68, 68, 0.45)',
    backgroundColor: '#1A1824',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leftBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryBadge: {
    marginLeft: 4,
  },
  overduePill: {
    backgroundColor: colors.overdueBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.overdueBorder,
  },
  overduePillText: {
    color: colors.overdue,
    fontSize: 10,
    fontWeight: '800',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  contentColumn: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 22,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    color: colors.textSubtle,
  },
  deadlineRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  overdueDeadlineText: {
    color: colors.overdue,
    fontWeight: '700',
  },
  completedDeadlineText: {
    color: colors.success,
  },
});
