'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface WeekSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function WeekSelector({ selectedDate, onDateChange }: WeekSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    d.setDate(d.getDate() - d.getDay() + 1)
    return d
  }

  const getWeekEnd = (date: Date) => {
    const d = new Date(date)
    d.setDate(d.getDate() - d.getDay() + 7)
    return d
  }

  const weekStart = getWeekStart(selectedDate)
  const weekEnd = getWeekEnd(selectedDate)

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 7)
    onDateChange(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 7)
    onDateChange(newDate)
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  const isCurrentWeek = () => {
    const today = new Date()
    const currentWeekStart = getWeekStart(today)
    const selectedWeekStart = getWeekStart(selectedDate)
    return currentWeekStart.toDateString() === selectedWeekStart.toDateString()
  }

  return (
    <Card className="border-0 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 shadow-md">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Week Display */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
              Current Week
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {weekStart.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}{' '}
              -
              {weekEnd.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isCurrentWeek() ? 'This week' : 'Past week'}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevWeek}
              className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              ← Previous
            </Button>

            {!isCurrentWeek() && (
              <Button
                variant="default"
                size="sm"
                onClick={handleToday}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Today
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextWeek}
              className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Next →
            </Button>

            {/* Calendar Popover */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  📅
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      onDateChange(date)
                      setIsOpen(false)
                    }
                  }}
                  disabled={(date) => {
                    // Disable future dates
                    return date > new Date()
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
