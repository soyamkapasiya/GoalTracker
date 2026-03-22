'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field, FieldLabel } from '@/components/ui/field'

interface WeekGoalSetupProps {
  weeklyGoal: number
  dailyGoal: number
  onGoalSet: (weeklyGoal: number) => void
  isNewWeek: boolean
}

export function WeekGoalSetup({
  weeklyGoal,
  dailyGoal,
  onGoalSet,
  isNewWeek,
}: WeekGoalSetupProps) {
  const [inputValue, setInputValue] = useState(weeklyGoal.toString())
  const [isEditing, setIsEditing] = useState(isNewWeek && weeklyGoal === 0)
  const [error, setError] = useState('')

  useEffect(() => {
    setInputValue(weeklyGoal.toString())
  }, [weeklyGoal])

  const handleSave = () => {
    const goal = parseFloat(inputValue)

    if (isNaN(goal) || goal <= 0) {
      setError('Please enter a valid goal (greater than 0)')
      return
    }

    if (goal > 168) {
      setError('Weekly goal cannot exceed 168 hours')
      return
    }

    onGoalSet(goal)
    setIsEditing(false)
    setError('')
  }

  const handleCancel = () => {
    setInputValue(weeklyGoal.toString())
    setIsEditing(false)
    setError('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const quickSetGoals = [21, 28, 35, 42, 49]

  if (!isEditing && weeklyGoal > 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-900 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Weekly Study Goal</span>
            <span className="text-sm font-normal text-slate-600 dark:text-slate-300">
              Set
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                Weekly Target
              </p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {weeklyGoal}
                <span className="text-lg text-slate-600 dark:text-slate-400 ml-1">h</span>
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                Daily Average
              </p>
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                {dailyGoal.toFixed(1)}
                <span className="text-lg text-slate-600 dark:text-slate-400 ml-1">h</span>
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-emerald-200 dark:border-emerald-700">
            <p className="text-xs text-slate-600 dark:text-slate-300 text-center">
              You're targeting{' '}
              <span className="font-semibold">{dailyGoal.toFixed(1)} hours</span> per day to reach your weekly goal.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="w-full text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900"
          >
            Change Goal
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎯</span> Set Your Weekly Study Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field>
          <FieldLabel htmlFor="weekly-goal">
            How many hours do you want to study this week?
          </FieldLabel>
          <Input
            id="weekly-goal"
            type="number"
            min="1"
            max="168"
            step="0.5"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setError('')
            }}
            onKeyDown={handleKeyPress}
            placeholder="e.g., 35"
            autoFocus
            className="text-lg font-semibold"
          />
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
            Enter your target in hours (1-168). We'll break this into daily milestones.
          </p>
        </Field>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Quick Set Goals */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Quick Goals
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {quickSetGoals.map((goal) => (
              <button
                key={goal}
                onClick={() => setInputValue(goal.toString())}
                className={`
                  p-2 rounded-lg border-2 font-semibold transition-all
                  ${
                    inputValue === goal.toString()
                      ? 'bg-blue-600 dark:bg-blue-700 border-blue-700 dark:border-blue-800 text-white'
                      : 'bg-white dark:bg-slate-800 border-blue-300 dark:border-blue-600 text-slate-900 dark:text-white hover:border-blue-500 dark:hover:border-blue-400'
                  }
                `}
              >
                {goal}h
              </button>
            ))}
          </div>
        </div>

        {/* Daily Breakdown Preview */}
        {inputValue && !isNaN(parseFloat(inputValue)) && parseFloat(inputValue) > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Your Daily Target
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {(parseFloat(inputValue) / 7).toFixed(1)}
              <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">h per day</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              This breaks down into 10 checkpoints of 30 minutes each day
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Start Tracking
          </Button>
          {weeklyGoal > 0 && (
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
