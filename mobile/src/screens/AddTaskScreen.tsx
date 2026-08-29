import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TaskPriority, TaskCategory } from '../types';
import { useTaskStore } from '../store/taskStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

const CATEGORIES: TaskCategory[] = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'];
const PRIORITIES: { label: string; value: TaskPriority; color: string }[] = [
  { label: '🟢 LOW', value: 'LOW', color: colors.priorityLow },
  { label: '🟡 MEDIUM', value: 'MEDIUM', color: colors.priorityMedium },
  { label: '🔥 HIGH', value: 'HIGH', color: colors.priorityHigh },
];

export const AddTaskScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('HIGH');
  const [category, setCategory] = useState<TaskCategory>('Work');

  // Deadline presets
  const getPresetDate = (hoursFromNow: number) => {
    const d = new Date();
    d.setTime(d.getTime() + hoursFromNow * 60 * 60 * 1000);
    return d.toISOString();
  };

  const [deadlines] = useState([
    { label: 'In 3 Hours', getIso: () => getPresetDate(3) },
    { label: 'Today • 6:00 PM', getIso: () => {
      const d = new Date();
      d.setHours(18, 0, 0, 0);
      if (d.getTime() < Date.now()) d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
      return d.toISOString();
    }},
    { label: 'Tomorrow • 10:00 AM', getIso: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(10, 0, 0, 0);
      return d.toISOString();
    }},
    { label: 'Next Week', getIso: () => getPresetDate(7 * 24) },
  ]);

  const [selectedDeadlineIndex, setSelectedDeadlineIndex] = useState(1);
  const [customDeadline, setCustomDeadline] = useState(deadlines[1].getIso());

  const addTask = useTaskStore((state) => state.addTask);
  const loading = useTaskStore((state) => state.loading);

  const handleSelectPreset = (index: number) => {
    setSelectedDeadlineIndex(index);
    setCustomDeadline(deadlines[index].getIso());
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for this task.');
      return;
    }

    const success = await addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      deadline: customDeadline,
    });

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to create task. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Task</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.label}>TASK TITLE *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Complete React Native Assignment"
            placeholderTextColor={colors.textSubtle}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add details, links, or notes..."
            placeholderTextColor={colors.textSubtle}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Priority Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>PRIORITY LEVEL</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => {
              const active = priority === p.value;
              return (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityPill,
                    active && {
                      backgroundColor: p.color,
                      borderColor: p.color,
                    },
                  ]}
                  onPress={() => setPriority(p.value)}
                >
                  <Text
                    style={[
                      styles.priorityPillText,
                      active && { color: '#FFFFFF', fontWeight: '700' },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Category Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>CATEGORY</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Deadline Preset Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>DEADLINE</Text>
          <View style={styles.deadlinesColumn}>
            {deadlines.map((dl, idx) => {
              const active = selectedDeadlineIndex === idx;
              return (
                <TouchableOpacity
                  key={dl.label}
                  style={[styles.deadlineOption, active && styles.deadlineOptionActive]}
                  onPress={() => handleSelectPreset(idx)}
                >
                  <Text style={[styles.deadlineOptionText, active && styles.deadlineOptionTextActive]}>
                    ⏰ {dl.label}
                  </Text>
                  {active && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.createButton, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>Create Task</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backButtonText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 22,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSubtle,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  priorityPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  deadlinesColumn: {
    gap: 8,
  },
  deadlineOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  deadlineOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  deadlineOptionText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  deadlineOptionTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  checkIcon: {
    color: colors.primary,
    fontWeight: '800',
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
