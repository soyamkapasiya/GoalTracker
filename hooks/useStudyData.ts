'use client'

import { useState, useEffect, useCallback } from 'react'

export interface DayMilestones {
  hoursMilestones: number[] // [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, ...]
  completedMilestones: boolean[]
  totalHours: number
  completed: boolean
}

export interface WeekData {
  startingHourTarget: number // Weekly goal
  startingDailyTarget: number // Daily goal (calculated)
  monday: DayMilestones
  tuesday: DayMilestones
  wednesday: DayMilestones
  thursday: DayMilestones
  friday: DayMilestones
  saturday: DayMilestones
  sunday: DayMilestones
}

export interface Streak {
  current: number
  longest: number
  lastUpdated: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  unlockedDate?: string
  icon: string
}

export interface StudyAppData {
  weeks: Record<string, WeekData>
  streaks: Streak
  achievements: Record<string, Achievement>
}

const STORAGE_KEY = 'studyTrackerData'
const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

const ACHIEVEMENTS: Record<string, Achievement> = {
  first_week: {
    id: 'first_week',
    name: 'First Step',
    description: 'Complete your first week',
    icon: '🚀',
  },
  week_7: {
    id: 'week_7',
    name: 'Week Warrior',
    description: 'Maintain 7-day streak',
    icon: '⚡',
  },
  week_14: {
    id: 'week_14',
    name: 'Two Weeks Strong',
    description: 'Maintain 14-day streak',
    icon: '💪',
  },
  week_30: {
    id: 'week_30',
    name: 'Monthly Master',
    description: 'Maintain 30-day streak',
    icon: '🏆',
  },
  perfect_week: {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Complete all 7 days above goal',
    icon: '⭐',
  },
  perfect_5_weeks: {
    id: 'perfect_5_weeks',
    name: 'Consistency King',
    description: 'Complete 5 perfect weeks',
    icon: '👑',
  },
  milestone_speed: {
    id: 'milestone_speed',
    name: 'Speed Demon',
    description: 'Complete 10 milestones in one day',
    icon: '🔥',
  },
  total_100_hours: {
    id: 'total_100_hours',
    name: 'Centurion',
    description: 'Study 100+ hours',
    icon: '💯',
  },
}

export const useStudyData = () => {
  const [data, setData] = useState<StudyAppData | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setData(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse study data:', e)
        setData(getDefaultData())
      }
    } else {
      setData(getDefaultData())
    }
    setLoading(false)
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (data && !loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [data, loading])

  const getDefaultData = useCallback((): StudyAppData => {
    return {
      weeks: {},
      streaks: {
        current: 0,
        longest: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      achievements: ACHIEVEMENTS,
    }
  }, [])

  const getWeekKey = useCallback((date: Date): string => {
    const d = new Date(date)
    d.setDate(d.getDate() - d.getDay() + 1) // Get Monday of the week
    return d.toISOString().split('T')[0]
  }, [])

  const getWeekData = useCallback(
    (date: Date): WeekData => {
      if (!data) return getDefaultWeekData(0)
      const weekKey = getWeekKey(date)
      return data.weeks[weekKey] || getDefaultWeekData(0)
    },
    [data, getWeekKey]
  )

  const getDefaultWeekData = (weeklyGoal: number = 0): WeekData => {
    const dailyGoal = weeklyGoal > 0 ? Math.round(weeklyGoal / 7 * 10) / 10 : 0
    const defaultDay: DayMilestones = {
      hoursMilestones: Array.from({ length: 10 }, (_, i) => (i + 1) * 0.5),
      completedMilestones: Array(10).fill(false),
      totalHours: 0,
      completed: false,
    }

    return {
      startingHourTarget: weeklyGoal,
      startingDailyTarget: dailyGoal,
      monday: { ...defaultDay },
      tuesday: { ...defaultDay },
      wednesday: { ...defaultDay },
      thursday: { ...defaultDay },
      friday: { ...defaultDay },
      saturday: { ...defaultDay },
      sunday: { ...defaultDay },
    }
  }

  const setWeeklyGoal = useCallback(
    (date: Date, weeklyGoal: number) => {
      if (!data) return
      const weekKey = getWeekKey(date)
      const dailyGoal = weeklyGoal > 0 ? Math.round(weeklyGoal / 7 * 10) / 10 : 0

      setData((prev) => {
        if (!prev) return prev
        const updated = { ...prev }
        const defaultDay: DayMilestones = {
          hoursMilestones: Array.from({ length: 10 }, (_, i) => (i + 1) * 0.5),
          completedMilestones: Array(10).fill(false),
          totalHours: 0,
          completed: false,
        }

        updated.weeks[weekKey] = {
          startingHourTarget: weeklyGoal,
          startingDailyTarget: dailyGoal,
          monday: { ...defaultDay },
          tuesday: { ...defaultDay },
          wednesday: { ...defaultDay },
          thursday: { ...defaultDay },
          friday: { ...defaultDay },
          saturday: { ...defaultDay },
          sunday: { ...defaultDay },
        }

        return updated
      })
    },
    [data, getWeekKey]
  )

  const toggleMilestone = useCallback(
    (date: Date, day: (typeof DAYS_OF_WEEK)[number], milestoneIndex: number) => {
      if (!data) return
      const weekKey = getWeekKey(date)

      setData((prev) => {
        if (!prev || !prev.weeks[weekKey]) return prev
        const updated = { ...prev }
        const weekData = updated.weeks[weekKey]
        const dayData = weekData[day]

        // Toggle the milestone
        dayData.completedMilestones[milestoneIndex] = !dayData.completedMilestones[milestoneIndex]

        // Recalculate total hours
        dayData.totalHours = dayData.completedMilestones.reduce(
          (sum, completed, idx) => sum + (completed ? dayData.hoursMilestones[idx] : 0),
          0
        )

        // Check if daily goal is reached
        dayData.completed = dayData.totalHours >= weekData.startingDailyTarget

        // Update streak
        updated.streaks = updateStreakLogic(
          updated.streaks,
          weekData,
          weekKey
        )

        // Update achievements
        updated.achievements = checkAndUnlockAchievements(
          updated.achievements,
          updated.streaks,
          weekData,
          dayData
        )

        return updated
      })
    },
    [data, getWeekKey]
  )

  return {
    data,
    loading,
    getWeekData,
    setWeeklyGoal,
    toggleMilestone,
    getWeekKey,
  }
}

const updateStreakLogic = (streaks: Streak, weekData: WeekData, weekKey: string): Streak => {
  const today = new Date().toISOString().split('T')[0]
  const isToday = weekKey === getWeekKeyStatic(new Date())

  if (!isToday) return streaks

  const allDaysCompleted = (
    weekData.monday.completed &&
    weekData.tuesday.completed &&
    weekData.wednesday.completed &&
    weekData.thursday.completed &&
    weekData.friday.completed &&
    weekData.saturday.completed &&
    weekData.sunday.completed
  )

  if (allDaysCompleted) {
    const newCurrent = streaks.current + 1
    return {
      current: newCurrent,
      longest: Math.max(streaks.longest, newCurrent),
      lastUpdated: today,
    }
  }

  return streaks
}

const checkAndUnlockAchievements = (
  achievements: Record<string, Achievement>,
  streaks: Streak,
  weekData: WeekData,
  dayData: DayMilestones
): Record<string, Achievement> => {
  const updated = { ...achievements }

  // Streak achievements
  if (streaks.current >= 7 && !updated.week_7.unlockedDate) {
    updated.week_7 = { ...updated.week_7, unlockedDate: new Date().toISOString() }
  }
  if (streaks.current >= 14 && !updated.week_14.unlockedDate) {
    updated.week_14 = { ...updated.week_14, unlockedDate: new Date().toISOString() }
  }
  if (streaks.current >= 30 && !updated.week_30.unlockedDate) {
    updated.week_30 = { ...updated.week_30, unlockedDate: new Date().toISOString() }
  }

  // Milestone speed
  const completedMilestones = dayData.completedMilestones.filter(Boolean).length
  if (completedMilestones >= 10 && !updated.milestone_speed.unlockedDate) {
    updated.milestone_speed = { ...updated.milestone_speed, unlockedDate: new Date().toISOString() }
  }

  return updated
}

const getWeekKeyStatic = (date: Date): string => {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay() + 1)
  return d.toISOString().split('T')[0]
}
