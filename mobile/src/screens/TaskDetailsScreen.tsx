import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TaskPriority, TaskCategory } from '../types';
import { useTaskStore } from '../store/taskStore';
import { Badge } from '../components/Badge';
import { getUrgencyInfo } from '../utils/urgency';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

const CATEGORIES: TaskCategory[] = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'];
const PRIORITIES: { label: string; value: TaskPriority; color: string }[] = [
  { label: '🟢 LOW', value: 'LOW', color: colors.priorityLow },
  { label: '🟡 MEDIUM', value: 'MEDIUM', color: colors.priorityMedium },
  { label: '🔥 HIGH', value: 'HIGH', color: colors.priorityHigh },
];

export const TaskDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const task = useTaskStore((state) => state.tasks.find((t) => t._id === taskId));

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title || '');
  const [editDescription, setEditDescription] = useState(task?.description || '');
  const [editPriority, setEditPriority] = useState<TaskPriority>(task?.priority || 'MEDIUM');
  const [editCategory, setEditCategory] = useState<TaskCategory>(task?.category || 'Work');

  const updateTask = useTaskStore((state) => state.updateTask);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const loading = useTaskStore((state) => state.loading);

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Task not found or has been deleted.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = task.status === 'COMPLETED';
  const urgency = getUrgencyInfo(task.deadline, task.priority, task.status);

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for this task.');
      return;
    }

    const success = await updateTask(taskId, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
      category: editCategory,
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const success = await deleteTask(taskId);
          if (success) {
            navigation.goBack();
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Task' : 'Task Details'}</Text>
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={styles.headerButton}
        >
          <Text style={[styles.headerButtonText, { color: colors.accent }]}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isEditing ? (
          /* Edit Mode */
          <View style={styles.editSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>TITLE</Text>
              <TextInput
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>DESCRIPTION</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PRIORITY</Text>
              <View style={styles.priorityRow}>
                {PRIORITIES.map((p) => {
                  const active = editPriority === p.value;
                  return (
                    <TouchableOpacity
                      key={p.value}
                      style={[
                        styles.priorityPill,
                        active && { backgroundColor: p.color, borderColor: p.color },
                      ]}
                      onPress={() => setEditPriority(p.value)}
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

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CATEGORY</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => {
                  const active = editCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.categoryChip, active && styles.categoryChipActive]}
                      onPress={() => setEditCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          active && styles.categoryChipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveEdit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* View Mode */
          <View style={styles.viewSection}>
            {/* Status & Priority Badges */}
            <View style={styles.badgeRow}>
              <Badge type="priority" value={task.priority} />
              <Badge type="category" value={task.category} />
              <Badge type="status" value={task.status} />
            </View>

            {/* Overdue Notification Banner */}
            {urgency.isOverdue && !isCompleted && (
              <View style={styles.overdueBanner}>
                <Text style={styles.overdueBannerText}>
                  ⚠️ This task is overdue ({urgency.dueLabel})
                </Text>
              </View>
            )}

            {/* Title */}
            <Text style={[styles.taskTitle, isCompleted && styles.completedTitle]}>
              {task.title}
            </Text>

            {/* Description */}
            <View style={styles.cardBox}>
              <Text style={styles.cardBoxLabel}>DESCRIPTION</Text>
              <Text style={styles.descriptionText}>
                {task.description || 'No additional description provided.'}
              </Text>
            </View>

            {/* Metadata Card */}
            <View style={styles.metaCard}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>⏰ Deadline</Text>
                <Text style={[styles.metaValue, urgency.isOverdue && !isCompleted && { color: colors.overdue }]}>
                  {urgency.dueLabel}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>⚡ Urgency Score</Text>
                <Text style={[styles.metaValue, { color: colors.primary }]}>
                  {task.urgencyScore !== undefined ? `${task.urgencyScore} pts` : 'N/A'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>📅 Created</Text>
                <Text style={styles.metaValue}>
                  {new Date(task.createdAt).toLocaleDateString()}
                </Text>
              </View>

              {task.completedAt && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>✓ Completed</Text>
                    <Text style={[styles.metaValue, { color: colors.success }]}>
                      {new Date(task.completedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[styles.toggleButton, isCompleted && styles.toggleButtonUndo]}
              onPress={() => toggleComplete(taskId)}
              activeOpacity={0.85}
            >
              <Text style={styles.toggleButtonText}>
                {isCompleted ? '↺ Mark as Pending' : '✓ Mark as Completed'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.85}
            >
              <Text style={styles.deleteButtonText}>🗑 Delete Task</Text>
            </TouchableOpacity>
          </View>
        )}
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
  headerButton: {
    paddingVertical: 4,
  },
  headerButtonText: {
    color: colors.textMuted,
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    color: colors.textMuted,
    fontSize: 16,
    marginBottom: 16,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: colors.primary,
    fontWeight: '700',
  },
  viewSection: {},
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  overdueBanner: {
    backgroundColor: colors.overdueBg,
    borderWidth: 1,
    borderColor: colors.overdueBorder,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  overdueBannerText: {
    color: colors.overdue,
    fontWeight: '700',
    fontSize: 13,
  },
  taskTitle: {
    ...typography.h1,
    fontSize: 24,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 32,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  cardBox: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  cardBoxLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSubtle,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  metaCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  metaLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.inputBorder,
    marginVertical: 6,
  },
  toggleButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleButtonUndo: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  deleteButtonText: {
    color: colors.overdue,
    fontSize: 15,
    fontWeight: '700',
  },
  editSection: {},
  fieldGroup: {
    marginBottom: 18,
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
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
