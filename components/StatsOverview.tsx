'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { WeekData } from '@/hooks/useStudyData'

const DAYS_FULL = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

interface StatsOverviewProps {
  weekData: WeekData
}

export function StatsOverview({ weekData }: StatsOverviewProps) {
  // Calculate metrics
  const totalHours = DAYS_FULL.reduce(
    (sum, day) => sum + (weekData[day as keyof WeekData]?.totalHours || 0),
    0
  )

  const completedDays = DAYS_FULL.filter(
    (day) => weekData[day as keyof WeekData]?.completed
  ).length

  const averageHours = completedDays > 0 ? totalHours / 7 : 0
  const goalAchievementPercent =
    weekData.startingHourTarget > 0
      ? (totalHours / weekData.startingHourTarget) * 100
      : 0

  const daysRemaining = 7 - completedDays
  const totalMilestones = DAYS_FULL.reduce(
    (sum, day) => sum + (weekData[day as keyof WeekData]?.completedMilestones?.filter(Boolean).length || 0),
    0
  )

  const StatCard = ({
    label,
    value,
    unit,
    icon,
    color,
    percent,
  }: {
    label: string
    value: number | string
    unit?: string
    icon: string
    color: string
    percent?: number
  }) => (
    <Card className="border-0 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {value}
              {unit && <span className="text-lg text-slate-500 dark:text-slate-400 ml-1">{unit}</span>}
            </p>
            {percent !== undefined && (
              <div className="mt-2 space-y-1">
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {Math.round(percent)}% of goal
                </p>
              </div>
            )}
          </div>
          <div className={`text-3xl ${color.replace('bg-', 'text-').replace('-500', '').replace('-600', '').replace('-400', '')}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        label="Total Hours This Week"
        value={totalHours.toFixed(1)}
        unit="h"
        icon="⏱️"
        color="bg-blue-500"
        percent={goalAchievementPercent}
      />

      <StatCard
        label="Average Daily Hours"
        value={averageHours.toFixed(1)}
        unit="h"
        icon="📊"
        color="bg-green-500"
      />

      <StatCard
        label="Days on Track"
        value={completedDays}
        unit={`/ 7`}
        icon="✓"
        color="bg-purple-500"
        percent={(completedDays / 7) * 100}
      />

      <StatCard
        label="Daily Target"
        value={weekData.startingDailyTarget.toFixed(1)}
        unit="h"
        icon="🎯"
        color="bg-orange-500"
      />

      <StatCard
        label="Days Remaining"
        value={daysRemaining}
        unit={daysRemaining === 1 ? 'day' : 'days'}
        icon="📅"
        color={daysRemaining > 3 ? 'bg-green-500' : daysRemaining > 0 ? 'bg-yellow-500' : 'bg-red-500'}
      />

      <StatCard
        label="Milestones Completed"
        value={totalMilestones}
        unit={`/ ${7 * 10}`}
        icon="🏁"
        color="bg-pink-500"
        percent={(totalMilestones / (7 * 10)) * 100}
      />
    </div>
  )
}
