'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { WeekData, DayMilestones } from '@/hooks/useStudyData'

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAYS_FULL = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
const COLORS = {
  actual: '#10b981',
  goal: '#3b82f6',
  behind: '#ef4444',
}

interface StudyChartsProps {
  weekData: WeekData
}

export function StudyCharts({ weekData }: StudyChartsProps) {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'gauge' | 'timeline'>('line')

  // Prepare chart data
  const chartData = DAYS_FULL.map((day, idx) => {
    const dayData = weekData[day as DayKey] as DayMilestones;
    return {
      name: DAYS_SHORT[idx],
      actual: dayData?.totalHours || 0,
      goal: weekData.startingDailyTarget,
      milestones: dayData?.completedMilestones?.filter(Boolean).length || 0,
    }
  })

  const totalActual = chartData.reduce((sum, d) => sum + d.actual, 0)
  const totalGoal = weekData.startingHourTarget
  const achievementPercent = totalGoal > 0 ? (totalActual / totalGoal) * 100 : 0

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white">{data.name}</p>
          <p className="text-green-600 dark:text-green-400 text-sm">
            Actual: {data.actual.toFixed(1)}h
          </p>
          <p className="text-blue-600 dark:text-blue-400 text-sm">Goal: {data.goal.toFixed(1)}h</p>
          <p className="text-purple-600 dark:text-purple-400 text-sm">
            Milestones: {data.milestones}/10
          </p>
          {data.actual >= data.goal && (
            <p className="text-green-600 dark:text-green-400 text-xs font-semibold mt-1">
              ✓ On Track
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-md">
      <CardHeader>
        <CardTitle>Weekly Progress Visualization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={chartType} onValueChange={(v) => setChartType(v as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="gauge">Gauge</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="line" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke={COLORS.actual}
                  strokeWidth={3}
                  dot={{ fill: COLORS.actual, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Hours Studied"
                />
                <Line
                  type="monotone"
                  dataKey="goal"
                  stroke={COLORS.goal}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Daily Goal"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="bar" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="actual" name="Hours Studied" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.actual >= entry.goal ? COLORS.actual : COLORS.behind}
                    />
                  ))}
                </Bar>
                <Bar dataKey="goal" name="Daily Goal" fill={COLORS.goal} opacity={0.6} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="gauge" className="mt-4">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Background circle */}
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#e2e8f0" strokeWidth="20" />

                  {/* Progress circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke={achievementPercent >= 100 ? '#10b981' : '#3b82f6'}
                    strokeWidth="20"
                    strokeDasharray={`${(achievementPercent / 100) * 565.48} 565.48`}
                    strokeLinecap="round"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '100px 100px',
                      transition: 'stroke-dasharray 0.5s ease-in-out',
                    }}
                  />

                  {/* Center text */}
                  <text x="100" y="95" textAnchor="middle" className="text-3xl font-bold" fill="#1e293b">
                    {Math.round(achievementPercent)}%
                  </text>
                  <text x="100" y="115" textAnchor="middle" className="text-xs" fill="#64748b">
                    {totalActual.toFixed(1)}h / {totalGoal}h
                  </text>
                </svg>
              </div>
              <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-4">
                {achievementPercent >= 100
                  ? 'Goal exceeded! Great work!'
                  : `${Math.round(100 - achievementPercent)}% more to reach weekly goal`}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <div className="space-y-4">
              {chartData.map((day, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{day.name}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      {day.actual.toFixed(1)}h - {day.milestones} milestones
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: day.milestones }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-2 bg-green-500 rounded-full"
                        style={{ animation: 'pulse 1s infinite' }}
                      />
                    ))}
                    {Array.from({ length: Math.max(0, 10 - day.milestones) }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="flex-1 h-2 bg-slate-300 dark:bg-slate-600 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
