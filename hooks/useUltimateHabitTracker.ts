'use client';

import { useState, useEffect } from 'react';

export interface Habit {
  id: string;
  name: string;
  cat: number;
  goal: number;
  sessionGoal?: number; // Target hours per session (e.g. 2.5)
  done: Record<string, number>; // key: "YYYY-MM-DD", value: hours (0 to 24)
}

export const CATS = [
  { name: 'Fitness', color: '#3fb950' },
  { name: 'Reading', color: '#58a6ff' },
  { name: 'Wellness', color: '#bc8cff' },
  { name: 'Productivity', color: '#f0883e' },
  { name: 'Learning', color: '#d29922' },
  { name: 'Health', color: '#f85149' },
];

const STORAGE_KEY = 'ultimateHabitTrackerData';

export function useUltimateHabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHabits(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse habits:', e);
        setHabits(getInitialHabits());
      }
    } else {
      setHabits(getInitialHabits());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits, loading]);

  const getInitialHabits = (): Habit[] => {
    const initial: Habit[] = [
      { id: '1', name: 'Morning Run', cat: 0, goal: 20, sessionGoal: 0.5, done: {} },
      { id: '2', name: 'Read 10 Pages', cat: 1, goal: 25, sessionGoal: 1, done: {} },
      { id: '3', name: 'Meditation', cat: 2, goal: 22, sessionGoal: 0.25, done: {} },
      { id: '4', name: 'No Sugar', cat: 5, goal: 18, sessionGoal: 0, done: {} },
      { id: '5', name: 'Code 1hr', cat: 3, goal: 20, sessionGoal: 1, done: {} },
      { id: '6', name: 'Stretch', cat: 2, goal: 15, sessionGoal: 0.25, done: {} },
      { id: '7', name: 'Journal', cat: 3, goal: 28, sessionGoal: 0.25, done: {} },
      { id: '8', name: '10k Steps', cat: 0, goal: 20, sessionGoal: 1.5, done: {} },
    ];
    
    // Seed some data for the current month
    const now = new Date();
    initial.forEach(h => {
      for (let m = 0; m <= now.getMonth(); m++) {
        const dim = new Date(now.getFullYear(), m + 1, 0).getDate();
        const maxDay = m === now.getMonth() ? now.getDate() : dim;
        for (let d = 1; d <= maxDay; d++) {
          if (Math.random() < 0.65) {
            const key = `${now.getFullYear()}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            h.done[key] = Math.round(Math.random() * 2 * 10) / 10 || 1; // 0.1 to 2.0 hours
          }
        }
      }
    });

    return initial;
  };

  const toggleDone = (habitId: string, dateKey: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newDone = { ...h.done };
        if (newDone[dateKey]) {
          delete newDone[dateKey];
        } else {
          newDone[dateKey] = 1; // Default to 1 hour if toggled on
        }
        return { ...h, done: newDone };
      }
      return h;
    }));
  };

  const updateHours = (habitId: string, dateKey: string, hours: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newDone = { ...h.done };
        if (hours <= 0) {
          delete newDone[dateKey];
        } else {
          newDone[dateKey] = hours;
        }
        return { ...h, done: newDone };
      }
      return h;
    }));
  };

  const addHabit = (name: string, cat: number, goal: number, sessionGoal: number = 1) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      cat,
      goal,
      sessionGoal,
      done: {},
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (id: string, name: string, cat: number, goal: number, sessionGoal: number = 1) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name, cat, goal, sessionGoal } : h));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  return {
    habits,
    loading,
    toggleDone,
    updateHours,
    addHabit,
    updateHabit,
    deleteHabit,
  };
}
