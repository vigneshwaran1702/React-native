import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { TaskPriority, TaskCategory } from '../types';

interface BadgeProps {
  type: 'priority' | 'category' | 'status' | 'urgency';
  value: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ type, value, style }) => {
  let label = value;
  let textColor = colors.text;
  let bgColor = colors.cardHover;
  let borderColor = colors.cardBorder;

  if (type === 'priority') {
    switch (value as TaskPriority) {
      case 'HIGH':
        label = '🔥 HIGH';
        textColor = colors.priorityHigh;
        bgColor = colors.priorityHighBg;
        borderColor = colors.priorityHighBorder;
        break;
      case 'MEDIUM':
        label = '🟡 MEDIUM';
        textColor = colors.priorityMedium;
        bgColor = colors.priorityMediumBg;
        borderColor = colors.priorityMediumBorder;
        break;
      case 'LOW':
        label = '🟢 LOW';
        textColor = colors.priorityLow;
        bgColor = colors.priorityLowBg;
        borderColor = colors.priorityLowBorder;
        break;
    }
  } else if (type === 'category') {
    label = `📁 ${value}`;
    switch (value as TaskCategory) {
      case 'Work':
        textColor = colors.categoryWork;
        bgColor = 'rgba(56, 189, 248, 0.15)';
        borderColor = 'rgba(56, 189, 248, 0.3)';
        break;
      case 'Personal':
        textColor = colors.categoryPersonal;
        bgColor = 'rgba(236, 72, 153, 0.15)';
        borderColor = 'rgba(236, 72, 153, 0.3)';
        break;
      case 'Study':
        textColor = colors.categoryStudy;
        bgColor = 'rgba(168, 85, 247, 0.15)';
        borderColor = 'rgba(168, 85, 247, 0.3)';
        break;
      case 'Health':
        textColor = colors.categoryHealth;
        bgColor = 'rgba(16, 185, 129, 0.15)';
        borderColor = 'rgba(16, 185, 129, 0.3)';
        break;
      case 'Finance':
        textColor = colors.categoryFinance;
        bgColor = 'rgba(245, 158, 11, 0.15)';
        borderColor = 'rgba(245, 158, 11, 0.3)';
        break;
      default:
        textColor = colors.categoryOther;
        bgColor = 'rgba(148, 163, 184, 0.15)';
        borderColor = 'rgba(148, 163, 184, 0.3)';
    }
  } else if (type === 'status') {
    if (value === 'COMPLETED') {
      label = '✓ DONE';
      textColor = colors.success;
      bgColor = colors.successBg;
      borderColor = 'rgba(16, 185, 129, 0.3)';
    } else {
      label = '⏳ PENDING';
      textColor = colors.accent;
      bgColor = 'rgba(56, 189, 248, 0.12)';
      borderColor = 'rgba(56, 189, 248, 0.3)';
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderColor }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
