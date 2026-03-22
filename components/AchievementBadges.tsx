'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Achievement } from '@/hooks/useStudyData'

interface AchievementBadgesProps {
  achievements: Record<string, Achievement>
}

export function AchievementBadges({ achievements }: AchievementBadgesProps) {
  const [unlockedRecently, setUnlockedRecently] = useState<string[]>([])

  useEffect(() => {
    // Track recently unlocked achievements for animation
    const recently = Object.entries(achievements)
      .filter(([_, ach]) => ach.unlockedDate)
      .map(([_, ach]) => ach.id)
    setUnlockedRecently(recently)
  }, [achievements])

  const achievementsList = Object.values(achievements)
  const unlockedCount = achievementsList.filter((a) => a.unlockedDate).length

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900 dark:to-pink-900 shadow-md overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 text-8xl">⭐</div>
        <div className="absolute bottom-0 left-0 text-8xl">🏆</div>
      </div>

      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="text-2xl">🏆</span> Achievements
          </span>
          <span className="text-sm font-normal text-slate-600 dark:text-slate-300">
            {unlockedCount}/{achievementsList.length}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="space-y-3">
          {achievementsList.map((achievement) => {
            const isUnlocked = !!achievement.unlockedDate
            const isRecentlyUnlocked =
              isUnlocked && unlockedRecently.includes(achievement.id)

            return (
              <div
                key={achievement.id}
                className={`
                  p-3 rounded-lg border transition-all duration-300
                  ${
                    isUnlocked
                      ? 'bg-white dark:bg-slate-800 border-purple-300 dark:border-purple-600 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 opacity-60'
                  }
                  ${isRecentlyUnlocked ? 'ring-2 ring-purple-400 scale-105' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                      text-2xl flex items-center justify-center w-10 h-10 rounded-lg
                      transition-transform duration-300
                      ${isUnlocked ? 'bg-purple-100 dark:bg-purple-800 scale-110' : 'bg-slate-200 dark:bg-slate-600'}
                    `}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {achievement.description}
                    </p>
                    {isUnlocked && achievement.unlockedDate && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">
                        Unlocked{' '}
                        {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {isUnlocked && (
                    <div className="text-lg">✓</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {unlockedCount === 0 && (
          <div className="text-center py-6 text-slate-600 dark:text-slate-300">
            <p className="text-sm">
              Start studying to unlock achievements!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Complete milestones and reach streaks to earn badges
            </p>
          </div>
        )}

        {unlockedCount > 0 && unlockedCount < achievementsList.length && (
          <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
            <p className="text-xs text-slate-600 dark:text-slate-300 text-center">
              {achievementsList.length - unlockedCount} more to unlock
            </p>
          </div>
        )}

        {unlockedCount === achievementsList.length && (
          <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
            <p className="text-center text-sm font-semibold text-purple-600 dark:text-purple-400">
              🎉 All achievements unlocked!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
