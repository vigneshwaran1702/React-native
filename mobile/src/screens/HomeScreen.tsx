import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useTaskStore } from '../store/taskStore';
import { Header } from '../components/Header';
import { StatsDashboard } from '../components/StatsDashboard';
import { FilterBar } from '../components/FilterBar';
import { TaskCard } from '../components/TaskCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const tasks = useTaskStore((state) => state.tasks);
  const stats = useTaskStore((state) => state.stats);
  const loading = useTaskStore((state) => state.loading);
  const refreshing = useTaskStore((state) => state.refreshing);
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const selectedCategory = useTaskStore((state) => state.selectedCategory);
  const selectedPriority = useTaskStore((state) => state.selectedPriority);
  const selectedStatus = useTaskStore((state) => state.selectedStatus);
  const sortBy = useTaskStore((state) => state.sortBy);

  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const fetchStats = useTaskStore((state) => state.fetchStats);
  const refreshAll = useTaskStore((state) => state.refreshAll);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const setSearchQuery = useTaskStore((state) => state.setSearchQuery);
  const setCategoryFilter = useTaskStore((state) => state.setCategoryFilter);
  const setPriorityFilter = useTaskStore((state) => state.setPriorityFilter);
  const setStatusFilter = useTaskStore((state) => state.setStatusFilter);
  const setSortBy = useTaskStore((state) => state.setSortBy);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const renderEmptyState = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Loading your tasks...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎉</Text>
        <Text style={styles.emptyTitle}>No tasks found</Text>
        <Text style={styles.emptyText}>
          {searchQuery || selectedCategory !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All'
            ? 'No tasks match your selected filter criteria.'
            : 'You are all caught up! Tap the + button to create a new task.'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            <Header />
            <StatsDashboard stats={stats} />
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategorySelect={setCategoryFilter}
              selectedPriority={selectedPriority}
              onPrioritySelect={setPriorityFilter}
              selectedStatus={selectedStatus}
              onStatusSelect={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>
                {sortBy === 'smart' ? '⚡ SMART PRIORITIZED TASKS' : 'YOUR TASKS'}
              </Text>
              <Text style={styles.taskCountBadge}>{tasks.length}</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetails', { taskId: item._id })}
            onToggleComplete={() => toggleComplete(item._id)}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAll}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 90,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 10,
  },
  listTitle: {
    ...typography.badge,
    color: colors.textSubtle,
    fontSize: 11,
  },
  taskCountBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 6,
  },
  emptyText: {
    ...typography.subtitle,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 34,
  },
});
