'use client';

import { WeekData, Goal } from '@/hooks/useGoalData';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CompactGoalDashboardProps {
  weekData: WeekData | null;
  calculateDailyProgress: (goal: Goal) => number;
  calculateWeeklyProgress: (goal: Goal) => number;
  toggleDailyCheckpoint: (goalId: string, dayIndex: number) => void;
  toggleWeeklyCheckpoint: (goalId: string, week: number) => void;
  onAddGoal: () => void;
  onRemoveGoal: (goalId: string) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function CompactGoalDashboard({
  weekData,
  calculateDailyProgress,
  calculateWeeklyProgress,
  toggleDailyCheckpoint,
  toggleWeeklyCheckpoint,
  onAddGoal,
  onRemoveGoal,
}: CompactGoalDashboardProps) {
  if (!weekData) return null;

  const dailyGoals = weekData.goals.filter((g) => g.frequency === 'daily');
  const weeklyGoals = weekData.goals.filter((g) => g.frequency === 'weekly');

  // Calculate overall progress
  const totalDailyProgress =
    dailyGoals.length > 0
      ? dailyGoals.reduce((sum, g) => sum + calculateDailyProgress(g), 0) / dailyGoals.length
      : 0;

  const totalWeeklyProgress =
    weeklyGoals.length > 0
      ? weeklyGoals.reduce((sum, g) => sum + calculateWeeklyProgress(g), 0) / weeklyGoals.length
      : 0;

  const progressData = [
    { name: 'Done', value: totalDailyProgress, fill: '#10b981' },
    { name: 'Remaining', value: 100 - totalDailyProgress, fill: '#e5e7eb' },
  ];

  const barData = dailyGoals.slice(0, 4).map((goal, i) => ({
    name: goal.name.substring(0, 12),
    current: calculateDailyProgress(goal),
    target: 100,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Personal Goals Tracker</h1>
          <p className="text-sm text-gray-600">Week of {weekData.weekStartDate}</p>
        </div>
        <Button onClick={onAddGoal} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Goal</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Left: Progress Charts */}
        <div className="lg:col-span-1 grid grid-cols-1 gap-4 min-h-0">
          {/* Daily Progress Pie */}
          <Card className="p-4 flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Daily Progress</h3>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {progressData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-2xl font-bold text-green-600">{Math.round(totalDailyProgress)}%</p>
              <p className="text-xs text-gray-600">Done</p>
            </div>
          </Card>

          {/* Weekly Stats */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Weekly Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Daily Goals:</span>
                <span className="font-semibold">{dailyGoals.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Weekly Goals:</span>
                <span className="font-semibold">{weeklyGoals.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress:</span>
                <span className="font-semibold text-green-600">{Math.round(totalDailyProgress)}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Middle: Bar Chart & Goals List */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          {/* Bar Chart */}
          {barData.length > 0 && (
            <Card className="p-4 flex-shrink-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Top Goals Progress</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${Math.round(value as number)}%`} />
                  <Bar dataKey="current" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Daily Goals Checkboxes */}
          {dailyGoals.length > 0 && (
            <Card className="p-4 flex-1 overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Daily Goals</h3>
              <div className="space-y-2 text-xs">
                {dailyGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-2 pb-2 border-b">
                    <span className="flex-1 font-medium truncate">{goal.name}</span>
                    <div className="flex gap-1 flex-shrink-0">
                      {goal.dailyCheckpoints?.map((cp, idx) => (
                        <button
                          key={idx}
                          onClick={() => toggleDailyCheckpoint(goal.id, idx)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                            cp.completed
                              ? 'bg-green-500 border-green-600'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {cp.completed && <span className="text-white text-xs font-bold">✓</span>}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveGoal(goal.id)}
                      className="h-5 w-5 p-0 flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Weekly Goals Section */}
      {weeklyGoals.length > 0 && (
        <Card className="p-4 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Weekly Goals</h3>
          <div className="space-y-2 text-xs">
            {weeklyGoals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between pb-2 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{goal.name}</p>
                  <p className="text-gray-600">Target: {goal.target}</p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((week) => (
                    <button
                      key={week}
                      onClick={() => toggleWeeklyCheckpoint(goal.id, week)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition text-xs font-bold ${
                        goal.weeklyCheckpoints?.[week]
                          ? 'bg-green-500 border-green-600 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {week}
                    </button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveGoal(goal.id)}
                  className="h-5 w-5 p-0"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
