'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { DayMilestones } from '@/hooks/useStudyData'

const DAYS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

interface DailyMilestoneCardProps {
  day: keyof typeof DAYS
  dayData: DayMilestones
  dailyGoal: number
  onMilestoneToggle: (milestoneIndex: number) => void
}

export function DailyMilestoneCard({
  day,
  dayData,
  dailyGoal,
  onMilestoneToggle,
}: DailyMilestoneCardProps) {
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
  const progressPercent = dailyGoal > 0 ? (dayData.totalHours / dailyGoal) * 100 : 0
  const isCompleted = dayData.totalHours >= dailyGoal

  const handleCheckChange = (index: number) => {
    setAnimatingIndex(index)
    onMilestoneToggle(index)
    setTimeout(() => setAnimatingIndex(null), 300)
  }

  return (
    <Card className="h-full border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{DAYS[day]}</CardTitle>
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {dayData.totalHours.toFixed(1)}h / {dailyGoal.toFixed(1)}h
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={Math.min(progressPercent, 100)} 
            className="h-2.5 rounded-full"
          />
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
            <span>{Math.round(progressPercent)}% towards goal</span>
            {isCompleted && <span className="text-green-600 dark:text-green-400 font-semibold">Goal Reached!</span>}
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Study Checkpoints (30 min each)
          </p>
          <div className="grid grid-cols-5 gap-2">
            {dayData.hoursMilestones.map((milestone, idx) => {
              const isCompleted = dayData.completedMilestones[idx]
              const isAnimating = animatingIndex === idx

              return (
                <div key={idx} className="flex flex-col items-center">
                  <button
                    onClick={() => handleCheckChange(idx)}
                    className={`
                      w-10 h-10 rounded-lg border-2 flex items-center justify-center
                      transition-all duration-200 transform hover:scale-105
                      ${
                        isCompleted
                          ? 'bg-green-500 border-green-600 dark:bg-green-600 dark:border-green-700'
                          : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600'
                      }
                      ${isAnimating ? 'scale-95' : ''}
                    `}
                  >
                    {isCompleted && (
                      <svg
                        className={`w-5 h-5 text-white transition-transform duration-300 ${
                          isAnimating ? 'scale-110' : ''
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                    {milestone}h
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Completed Milestones Counter */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold">
              {dayData.completedMilestones.filter(Boolean).length}
            </span>
            /{dayData.hoursMilestones.length} milestones completed
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
