'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Streak } from '@/hooks/useStudyData'

interface StreakDisplayProps {
  streak: Streak
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  const [displayCurrent, setDisplayCurrent] = useState(0)
  const [displayLongest, setDisplayLongest] = useState(0)

  // Animate counter on change
  useEffect(() => {
    if (displayCurrent < streak.current) {
      const timer = setTimeout(() => setDisplayCurrent(displayCurrent + 1), 50)
      return () => clearTimeout(timer)
    }
  }, [displayCurrent, streak.current])

  useEffect(() => {
    if (displayLongest < streak.longest) {
      const timer = setTimeout(() => setDisplayLongest(displayLongest + 1), 50)
      return () => clearTimeout(timer)
    }
  }, [displayLongest, streak.longest])

  return (
    <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900 dark:to-orange-900 shadow-md overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 text-8xl">⚡</div>
        <div className="absolute bottom-0 left-0 text-8xl">🔥</div>
      </div>

      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🔥</span> Your Streak
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* Current Streak */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Current Streak</p>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">
              {displayCurrent}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {displayCurrent === 1 ? 'day' : 'days'} 🎯
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Keep going! {displayCurrent > 0 ? 'You\'re doing amazing!' : 'Start your streak today!'}
          </p>
        </div>

        {/* Longest Streak */}
        <div className="border-t border-orange-200 dark:border-orange-700 pt-4 space-y-2">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Personal Record</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 tabular-nums">
              {displayLongest}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {displayLongest === 1 ? 'day' : 'days'} 👑
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Your best performance ever!
          </p>
        </div>

        {/* Streak Meter */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
          <div className="flex justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Progress to 7-day badge</span>
            <span className="text-slate-600 dark:text-slate-400">{displayCurrent}/7</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${(displayCurrent / 7) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
