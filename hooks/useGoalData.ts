'use client';

import { useState, useEffect } from 'react';

export interface DailyCheckpoint {
  date: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  name: string;
  category: string;
  target: number;
  frequency: 'daily' | 'weekly';
  unit?: string;
  createdAt: string;
  dailyCheckpoints?: DailyCheckpoint[];
  weeklyCheckpoints?: Record<number, boolean>;
  progress?: number;
}

export interface WeekData {
  weekStartDate: string;
  goals: Goal[];
  streaks: {
    current: number;
    longest: number;
  };
  achievements: string[];
}

const STORAGE_KEY = 'goalTrackerData';
const DEFAULT_GOALS: Goal[] = [
  {
    id: '1',
    name: 'Workout',
    category: 'fitness',
    target: 5,
    frequency: 'daily',
    unit: 'sessions',
    createdAt: new Date().toISOString(),
    dailyCheckpoints: Array(7)
      .fill(null)
      .map((_, i) => ({
        date: getDateString(i),
        completed: false,
      })),
  },
  {
    id: '2',
    name: 'Read 10 pages',
    category: 'reading',
    target: 10,
    frequency: 'daily',
    unit: 'pages',
    createdAt: new Date().toISOString(),
    dailyCheckpoints: Array(7)
      .fill(null)
      .map((_, i) => ({
        date: getDateString(i),
        completed: false,
      })),
  },
  {
    id: '3',
    name: 'Meditation',
    category: 'wellness',
    target: 20,
    frequency: 'daily',
    unit: 'minutes',
    createdAt: new Date().toISOString(),
    dailyCheckpoints: Array(7)
      .fill(null)
      .map((_, i) => ({
        date: getDateString(i),
        completed: false,
      })),
  },
];

function getDateString(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

function getWeekStartDate(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

export function useGoalData() {
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const weekStart = getWeekStartDate();

      if (stored) {
        const data = JSON.parse(stored);
        if (data[weekStart]) {
          setWeekData(data[weekStart]);
        } else {
          initializeWeek(weekStart);
        }
      } else {
        initializeWeek(weekStart);
      }
    } catch (error) {
      console.error('Failed to load goal data:', error);
      initializeWeek(getWeekStartDate());
    } finally {
      setLoading(false);
    }
  };

  const initializeWeek = (weekStart: string) => {
    const newWeekData: WeekData = {
      weekStartDate: weekStart,
      goals: DEFAULT_GOALS,
      streaks: { current: 0, longest: 0 },
      achievements: [],
    };
    setWeekData(newWeekData);
    saveData(newWeekData);
  };

  const saveData = (data: WeekData) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || '{}';
      const allData = JSON.parse(stored);
      allData[data.weekStartDate] = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('Failed to save goal data:', error);
    }
  };

  const toggleDailyCheckpoint = (goalId: string, dayIndex: number) => {
    if (!weekData) return;

    const updatedGoals = weekData.goals.map((goal) => {
      if (goal.id === goalId && goal.dailyCheckpoints) {
        const updated = [...goal.dailyCheckpoints];
        updated[dayIndex] = {
          ...updated[dayIndex],
          completed: !updated[dayIndex].completed,
        };
        return { ...goal, dailyCheckpoints: updated };
      }
      return goal;
    });

    const updatedWeekData = { ...weekData, goals: updatedGoals };
    setWeekData(updatedWeekData);
    saveData(updatedWeekData);
  };

  const toggleWeeklyCheckpoint = (goalId: string, week: number) => {
    if (!weekData) return;

    const updatedGoals = weekData.goals.map((goal) => {
      if (goal.id === goalId) {
        const weeklyCheckpoints = goal.weeklyCheckpoints || {};
        return {
          ...goal,
          weeklyCheckpoints: {
            ...weeklyCheckpoints,
            [week]: !weeklyCheckpoints[week],
          },
        };
      }
      return goal;
    });

    const updatedWeekData = { ...weekData, goals: updatedGoals };
    setWeekData(updatedWeekData);
    saveData(updatedWeekData);
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'dailyCheckpoints'>) => {
    if (!weekData) return;

    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      dailyCheckpoints: Array(7)
        .fill(null)
        .map((_, i) => ({
          date: getDateString(i),
          completed: false,
        })),
    };

    const updatedWeekData = {
      ...weekData,
      goals: [...weekData.goals, newGoal],
    };
    setWeekData(updatedWeekData);
    saveData(updatedWeekData);
  };

  const removeGoal = (goalId: string) => {
    if (!weekData) return;

    const updatedWeekData = {
      ...weekData,
      goals: weekData.goals.filter((g) => g.id !== goalId),
    };
    setWeekData(updatedWeekData);
    saveData(updatedWeekData);
  };

  const calculateDailyProgress = (goal: Goal): number => {
    if (!goal.dailyCheckpoints) return 0;
    const completed = goal.dailyCheckpoints.filter((cp) => cp.completed).length;
    return (completed / goal.dailyCheckpoints.length) * 100;
  };

  const calculateWeeklyProgress = (goal: Goal): number => {
    if (!goal.weeklyCheckpoints) return 0;
    const completed = Object.values(goal.weeklyCheckpoints).filter((v) => v).length;
    return (completed / 5) * 100;
  };

  return {
    weekData,
    loading,
    toggleDailyCheckpoint,
    toggleWeeklyCheckpoint,
    addGoal,
    removeGoal,
    calculateDailyProgress,
    calculateWeeklyProgress,
  };
}
