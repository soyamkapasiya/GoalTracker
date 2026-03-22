'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Settings, 
  X, 
  LayoutDashboard, 
  Calendar, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Circle, 
  MoreHorizontal,
  Flame,
  Zap,
  Target,
  Play,
  RotateCcw,
  Pause,
  Timer,
  PieChart as PieChartIcon,
  BarChart2,
  Activity,
  History
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { CATS, useUltimateHabitTracker, Habit } from '@/hooks/useUltimateHabitTracker';

const DAYS7 = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface MetricCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  sub?: string;
  color: 'emerald' | 'orange' | 'purple' | 'blue';
}

function MetricCard({ icon, value, label, sub, color }: MetricCardProps) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <div className={`p-3 rounded-xl border ${colorMap[color]} group transition-all`}>
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-black text-white">{value}</div>
        {sub && <div className="text-[9px] font-medium opacity-60">{sub}</div>}
      </div>
    </div>
  );
}

interface ViewProps {
  habits: Habit[];
  stats: any;
  weekChartData: any[];
  curYear: number;
  curMonth: number;
}

function AnalyticsView({ habits, stats, weekChartData, curYear, curMonth }: ViewProps) {
  const categoriesData = CATS.map((c, i) => {
    const total = habits.filter((h: Habit) => h.cat === i).reduce((acc: number, h: Habit) => {
      const monthStr = String(curMonth + 1).padStart(2, '0');
      const hKeys = Object.keys(h.done).filter(k => k.startsWith(`${curYear}-${monthStr}`));
      return acc + hKeys.reduce((a, k) => a + (h.done[k] || 0), 0);
    }, 0);
    return { name: c.name, value: total, color: c.color };
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0d1117] custom-scrollbar">
      <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-20">
        <header>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <PieChartIcon size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white leading-tight">Advanced Analytics</h2>
              <p className="text-sm text-[#8b949e]">Deep dive into your performance and focus metrics.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard icon={<Zap size={18}/>} value={stats.totalHours.toFixed(1)} label="Total Hours" sub="hrs this month" color="blue" />
          <MetricCard icon={<Award size={18}/>} value={stats.perfectDays} label="Perfect Days" sub="met daily target" color="emerald" />
          <MetricCard icon={<Flame size={18}/>} value={stats.bestStreak} label="Longest Streak" sub="day count" color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col shadow-xl">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <BarChart2 size={16} className="text-blue-500" />
              Weekly Progress Distribution
            </h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b949e', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b949e', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#30363d' }}
                    contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', color: '#e6edf3' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {weekChartData.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.value >= 80 ? '#3fb950' : '#316dca'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col shadow-xl">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" />
              Category Allocation (Hours)
            </h3>
            <div className="flex-1 flex flex-col gap-6 justify-center">
              {categoriesData.map((c: any) => (
                <div key={c.name} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">{c.name}</span>
                    <span className="text-[#8b949e]">{c.value.toFixed(1)}h</span>
                  </div>
                  <div className="h-2 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((c.value / (stats.totalHours || 1)) * 100, 100)}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryView({ habits, curYear, curMonth }: Pick<ViewProps, 'habits' | 'curYear' | 'curMonth'>) {
  const history = useMemo(() => {
    const logs: any[] = [];
    const monthStr = String(curMonth + 1).padStart(2, '0');
    
    habits.forEach((h: Habit) => {
      Object.keys(h.done).forEach(k => {
        if (k.startsWith(`${curYear}-${monthStr}`)) {
          logs.push({
            date: new Date(k),
            habitName: h.name,
            hours: h.done[k],
            color: CATS[h.cat].color,
            key: k
          });
        }
      });
    });

    return logs.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [habits, curYear, curMonth]);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0d1117] custom-scrollbar">
      <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-20">
        <header>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white leading-tight">Activity Log</h2>
              <p className="text-sm text-[#8b949e]">Detailed history of all your tracked work hours.</p>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-3">
          {history.length > 0 ? history.map((log: any, i: number) => (
            <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex items-center justify-between group hover:border-blue-500/40 hover:bg-[#1c2128] transition-all shadow-lg active:scale-[0.995]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0d1117] flex flex-col items-center justify-center border border-[#30363d] group-hover:border-blue-500/30">
                  <span className="text-[10px] font-bold text-[#8b949e] uppercase">{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(log.date)}</span>
                  <span className="text-sm font-black text-white">{log.date.getDate()}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: log.color }} />
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{log.habitName}</h4>
                  </div>
                  <p className="text-[10px] text-[#8b949e] font-mono mt-0.5">{log.key}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-blue-500">{log.hours.toFixed(1)}</span>
                <span className="text-[10px] font-bold text-[#8b949e] ml-1 uppercase">hrs</span>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-24 text-[#30363d] bg-[#161b22]/30 border-2 border-dashed border-[#30363d] rounded-2xl">
              <History size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-bold text-[#8b949e]">No activity recorded for this period.</p>
              <p className="text-[10px] text-[#484f58] mt-1">Start a timer to see logs here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function UltimateHabitTracker() {
  const { habits, loading, toggleDone, updateHours, addHabit, updateHabit, deleteHabit } = useUltimateHabitTracker();
  const [currentView, setCurrentView] = useState<'Main View' | 'Analytics' | 'History'>('Main View');
  const [curMonth, setCurMonth] = useState(new Date().getMonth());
  const [curYear, setCurYear] = useState(new Date().getFullYear());
  const [dailyGoal, setDailyGoal] = useState(2.5); // Global daily hours goal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState(0);
  const [newGoal, setNewGoal] = useState(20);
  const [newSessionGoal, setNewSessionGoal] = useState(1);
  const [hoveredCell, setHoveredCell] = useState<{hi: string, d: number} | null>(null);

  // Timer State
  const [activeTimerHabit, setActiveTimerHabit] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 mins
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'short' | 'long'>('pomodoro');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      // Optional: Sound notification/completion logic
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const resetTimer = (mode: typeof timerMode) => {
    setTimerMode(mode);
    setTimerRunning(false);
    if (mode === 'pomodoro') setTimerSeconds(1500);
    else if (mode === 'short') setTimerSeconds(300);
    else if (mode === 'long') setTimerSeconds(900);
  };

  const dim = useMemo(() => new Date(curYear, curMonth + 1, 0).getDate(), [curYear, curMonth]);
  const today = useMemo(() => new Date(), []);
  const todayCol = (curYear === today.getFullYear() && curMonth === today.getMonth()) ? today.getDate() : -1;

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(curYear, curMonth));

  const stats = useMemo(() => {
    let doneCells = 0;
    let totalCells = 0;
    let perfectDays = 0;
    const dayCounts = Array(dim + 1).fill(0);

    habits.forEach(h => {
      for (let d = 1; d <= dim; d++) {
        const key = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        if (h.done[key]) {
          doneCells++;
          dayCounts[d] += h.done[key];
        }
      }
    });

    const totalHours = habits.reduce((acc, h) => {
      let hVal = 0;
      Object.keys(h.done).forEach(k => {
        if (k.startsWith(`${curYear}-${String(curMonth + 1).padStart(2, '0')}`)) hVal += h.done[k];
      });
      return acc + hVal;
    }, 0);

    for (let d = 1; d <= dim; d++) {
      const dt = new Date(curYear, curMonth, d);
      if (dt <= today && dayCounts[d] >= dailyGoal && habits.length > 0) {
        perfectDays++;
      }
    }

    const overallPct = (habits.length > 0 && dim > 0) ? Math.round(doneCells / (dim * habits.length) * 100) : 0;

    let bestStreak = 0;
    let currentStreak = 0;
    for (let d = 1; d <= dim; d++) {
      const dt = new Date(curYear, curMonth, d);
      if (dt > today) break;
      const allDone = habits.length > 0 && dayCounts[d] >= dailyGoal;
      if (allDone) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return { overallPct, doneCells, perfectDays, bestStreak, dayCounts, totalHours };
  }, [habits, curYear, curMonth, dim, today]);

  const weekChartData = useMemo(() => {
    const data = [];
    for (let w = 0; w < 5; w++) {
      let done = 0;
      let total = 0;
      for (let d = w * 7 + 1; d <= Math.min((w + 1) * 7, dim); d++) {
        const dt = new Date(curYear, curMonth, d);
        if (dt <= today) {
          habits.forEach(() => total++);
          done += stats.dayCounts[d];
        }
      }
      data.push({ name: `W${w + 1}`, value: total > 0 ? Math.round(done / total * 100) : 0 });
    }
    return data;
  }, [habits, stats.dayCounts, dim, curYear, curMonth, today]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <Zap className="text-blue-500 animate-bounce" />
        </div>
        <p className="font-semibold">Loading habit data...</p>
      </div>
    </div>
  );


  const handleAdd = () => {
    if (!newName.trim()) return;
    if (isEditing && editingHabitId) {
      updateHabit(editingHabitId, newName, newCat, newGoal, newSessionGoal);
    } else {
      addHabit(newName, newCat, newGoal, newSessionGoal);
    }
    closeModal();
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingHabitId(null);
    setNewName('');
    setNewCat(0);
    setNewGoal(20);
    setNewSessionGoal(1);
    setIsModalOpen(true);
  };

  const openEditModal = (h: Habit) => {
    setIsEditing(true);
    setEditingHabitId(h.id);
    setNewName(h.name);
    setNewCat(h.cat);
    setNewGoal(h.goal);
    setNewSessionGoal(h.sessionGoal || 1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewName('');
    setIsEditing(false);
    setEditingHabitId(null);
  };

  const handleDelete = (id: string) => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (editingHabitId) {
      deleteHabit(editingHabitId);
      setIsDeleteConfirmOpen(false);
      closeModal();
    }
  };

  const getMonthDoneTotal = (h: Habit) => {
    const keys = Object.keys(h.done).filter(k => k.startsWith(`${curYear}-${String(curMonth + 1).padStart(2, '0')}`));
    return keys.reduce((acc, k) => acc + (h.done[k] || 0), 0);
  };

  const ringDashLen = 138;

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-[#e6edf3] font-sans selection:bg-blue-500/30">
      {/* Top Bar */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-md px-6 flex items-center gap-8 z-30 sticky top-0">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <Zap className="text-white" size={18} fill="currentColor" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-white tracking-widest uppercase leading-none">ULTIMATE</span>
            <span className="text-[14px] font-bold text-blue-500 -mt-0.5">Habit Tracker</span>
          </div>
        </div>
        
        <div className="flex gap-1 overflow-hidden p-0.5">
          {(['Main View', 'Analytics', 'History'] as const).map(m => (
             <button 
               key={m} 
               onClick={() => setCurrentView(m)}
               className={`px-4 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${m === currentView ? 'bg-[#30363d] text-white shadow-sm' : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]/30'}`}
             >
               {m}
             </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-1.5 border border-[#30363d] shadow-inner">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-blue-500" />
              <select 
                value={curYear} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurYear(parseInt(e.target.value))}
                className="bg-transparent border-none text-[11px] outline-none font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
              >
                {[2024, 2025, 2026].map(y => <option key={y} value={y} className="bg-[#161b22]">{y}</option>)}
              </select>
            </div>
            <div className="w-px h-3 bg-[#30363d]" />
            <select 
              value={curMonth} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurMonth(parseInt(e.target.value))}
              className="bg-transparent border-none text-[11px] outline-none font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
            >
              {Array.from({length: 12}).map((_, i) => (
                <option key={i} value={i} className="bg-[#161b22]">{new Intl.DateTimeFormat('en-US', {month: 'long'}).format(new Date(2025, i))}</option>
              ))}
            </select>
          </div>
          <button className="p-2 bg-[#21262d] border border-[#30363d] hover:border-blue-500/50 hover:bg-[#30363d] rounded-lg transition-all group">
            <Settings size={15} className="text-[#8b949e] group-hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="h-7 bg-[#161b22] border-b border-[#30363d] px-4 flex items-center gap-2 text-[10px] text-[#8b949e]">
        <span className="text-blue-500 font-bold font-mono">fx</span>
        <span className="font-mono">
          {hoveredCell 
            ? `=COUNTIF(${String.fromCharCode(66 + hoveredCell.d)}3:AF3,"done") — ${habits.find(h=>h.id===hoveredCell.hi)?.name} Day ${hoveredCell.d}`
            : '=COUNTIF(B3:AF3,"done") — click a cell to see formula'}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {currentView === 'Main View' ? (
          <>
            {/* Left Sidebar */}
            <div className="w-[220px] bg-[#161b22] border-r border-[#30363d] overflow-y-auto custom-scrollbar flex flex-col">
          <div className="p-4 flex flex-col gap-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Daily Target</h3>
                <span className="text-[10px] font-bold text-blue-500">{dailyGoal}h</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="range" 
                  min="0.5" 
                  max="12" 
                  step="0.5" 
                  value={dailyGoal} 
                  onChange={(e) => setDailyGoal(parseFloat(e.target.value))}
                  className="flex-1 accent-blue-500 h-1 bg-[#21262d] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] mb-3">This Month</h3>
              
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 mb-3 flex items-center gap-4 group transition-all hover:border-blue-500/50">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#21262d" strokeWidth="4" />
                    <circle 
                      cx="28" cy="28" r="22" fill="none" stroke="#3fb950" strokeWidth="4" 
                      strokeDasharray={ringDashLen}
                      strokeDashoffset={ringDashLen - (stats.overallPct / 100) * ringDashLen}
                      strokeLinecap="round" 
                      className="transition-all duration-1000 ease-out"
                      transform="rotate(-90 28 28)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                    {stats.overallPct}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-[#8b949e]">Overall</div>
                  <div className="text-[14px] font-bold text-[#e6edf3]">Progress</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <MetricCard icon={<CheckCircle2 size={14}/>} value={stats.totalHours.toFixed(1)} label="Total Hours" sub="hrs this month" color="emerald" />
                <MetricCard icon={<Flame size={14}/>} value={stats.bestStreak} label="Best Streak" color="orange" />
                <MetricCard icon={<Award size={14}/>} value={stats.perfectDays} label="Perfect Days" color="purple" />
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] mb-3 flex items-center justify-between">
                Daily Activity
                <TrendingUp size={10} />
              </h3>
              <div className="h-[60px] flex items-end gap-1 px-1">
                {stats.dayCounts.slice(1).map((cnt, i) => {
                  const d = i + 1;
                  const isTod = d === todayCol;
                  const h = Math.max(4, (cnt / (dailyGoal || 1)) * 56);
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-t-[1px] transition-all duration-300 ${isTod ? 'bg-blue-500' : cnt >= dailyGoal ? 'bg-[#3fb950]' : cnt > 0 ? 'bg-[#1f6feb]/60' : 'bg-[#21262d]'}`}
                      style={{ height: `${Math.min(h, 56)}px` }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-[9px] font-medium text-[#8b949e]">
                <span>1</span>
                <span>{dim}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Habits</h3>
                <Target size={11} className="text-[#8b949e]" />
              </div>
              <div className="flex flex-col gap-3">
                {habits.slice(0, 5).map((h: Habit) => {
                  const done = getMonthDoneTotal(h);
                  const pct = Math.round(done / h.goal * 100);
                  const color = CATS[h.cat].color;
                  return (
                    <div key={h.id} className="group">
                      <div className="flex items-center justify-between text-[10px] mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                          <span className="font-semibold">{h.name}</span>
                        </div>
                        <span className={pct >= 100 ? 'text-emerald-500' : 'text-[#8b949e]'}>{done.toFixed(1)}/{h.goal}</span>
                      </div>
                      <div className="h-1 bg-[#21262d] rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-500" 
                          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={openAddModal}
                className="w-full mt-6 py-2 border border-dashed border-[#30363d] rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:border-[#8b949e] hover:bg-[#21262d] transition-all text-[11px] font-medium flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add New Habit
              </button>
            </div>
          </div>
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-auto bg-[#0d1117] custom-scrollbar">
          <table className="w-full border-collapse border-spacing-0 select-none min-w-[max-content]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#161b22]">
                <th className="sticky left-0 z-20 bg-[#161b22] border-r border-[#30363d] border-b border-[#21262d] p-0 min-w-[200px]">
                  <div className="h-10 flex items-center px-4 text-[10px] font-bold text-[#8b949e] tracking-tight text-left">
                    HABIT
                  </div>
                </th>
                {Array.from({length: dim}).map((_, i) => {
                  const d = i + 1;
                  const dateObj = new Date(curYear, curMonth, d);
                  const dw = DAYS7[dateObj.getDay()];
                  const isTod = d === todayCol;
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                  return (
                    <th 
                      key={i} 
                      className={`h-10 min-w-[28px] border-b border-[#21262d] border-r border-[#21262d] p-0 transition-colors ${isTod ? 'bg-blue-500/10' : ''} ${stats.dayCounts[d] >= dailyGoal ? 'bg-emerald-500/5' : ''}`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className={`text-[8px] font-bold ${isWeekend ? 'text-[#f85149]' : 'text-[#8b949e]'}`}>{dw}</span>
                        <span className={`text-[11px] font-bold ${isTod ? 'text-blue-500' : 'text-[#e6edf3]'}`}>{d}</span>
                      </div>
                    </th>
                  );
                })}
                <th className="h-10 min-w-[45px] border-b border-[#21262d] p-0 bg-[#161b22] text-[9px] font-bold text-[#8b949e]">DONE</th>
                <th className="h-10 min-w-[45px] border-b border-[#21262d] p-0 bg-[#161b22] text-[9px] font-bold text-[#8b949e]">GOAL</th>
                <th className="h-10 min-w-[45px] border-b border-[#21262d] p-0 bg-[#161b22] text-[9px] font-bold text-[#8b949e]">%</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((h: Habit, hi: number) => {
                const doneTotal = getMonthDoneTotal(h);
                const pct = Math.round(doneTotal / h.goal * 100);
                const color = CATS[h.cat].color;
                
                return (
                  <tr key={h.id} className="group hover:bg-[#161b22]/30 transition-colors">
                    <td 
                      className="sticky left-0 z-[5] bg-[#161b22] group-hover:bg-[#1c2128] border-r border-[#30363d] border-b border-[#21262d] p-0 h-[30px] cursor-pointer"
                      onClick={() => openEditModal(h)}
                    >
                      <div className="flex items-center gap-2.5 px-4 h-full">
                        <div className="w-2 h-2 rounded-full ring-2 ring-black/20" style={{ backgroundColor: color }} />
                        <span className="text-[11px] font-medium truncate max-w-[140px] text-[#e6edf3]">{h.name}</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-[#30363d] rounded transition-all text-[9px] text-blue-500 font-bold uppercase tracking-tighter">
                          Edit
                        </div>
                      </div>
                    </td>
                    {Array.from({length: dim}).map((_, i) => {
                      const d = i + 1;
                      const dateKey = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                      const doneVal = h.done[dateKey] || 0;
                      const fut = new Date(curYear, curMonth, d) > today;
                      const isTod = d === todayCol;
                      
                      return (
                        <td 
                          key={i} 
                          onMouseEnter={() => setHoveredCell({hi: h.id, d})}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => !fut && toggleDone(h.id, dateKey)}
                          className={`h-[30px] border-b border-[#21262d] border-r border-[#21262d] p-0 group/cell cursor-pointer relative ${isTod ? 'bg-blue-500/5' : ''}`}
                        >
                          <div className={`absolute inset-0 transition-opacity bg-white/5 opacity-0 group-hover/cell:opacity-100 z-0`} />
                          <div className="flex items-center justify-center relative z-[1] w-full h-full">
                            <div 
                              className={`w-[18px] h-[18px] rounded-[4px] transition-all duration-300 ease-out shadow-sm flex items-center justify-center ${doneVal > 0 ? '' : fut ? 'opacity-20' : 'bg-[#161b22] hover:bg-[#21262d] border border-white/5'}`}
                              style={{ 
                                backgroundColor: doneVal > 0 ? color : undefined,
                                boxShadow: doneVal > 0 ? `0 0 12px ${color}60, inset 0 0 4px rgba(255,255,255,0.2)` : 'none',
                                transform: doneVal > 0 ? 'scale(1)' : 'scale(0.8)',
                                border: doneVal > 0 ? `1px solid ${color}80` : undefined
                              }}
                            >
                              {doneVal > 0 && <span className="text-[8px] font-bold text-black drop-shadow-sm">{doneVal >= 1 ? Math.floor(doneVal) : doneVal.toFixed(1)}</span>}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    <td className="h-[30px] border-b border-[#21262d] p-0 text-center font-mono text-[11px] font-bold" style={{ color: pct >= 100 ? '#3fb950' : pct >= 60 ? '#d29922' : '#f85149' }}>
                      {doneTotal.toFixed(1)}
                    </td>
                    <td className="h-[30px] border-b border-[#21262d] p-0 text-center text-[10px] text-[#8b949e] font-medium">
                      {h.goal}
                    </td>
                    <td className="h-[30px] border-b border-[#21262d] p-0 text-center font-mono text-[11px] font-bold" style={{ color: pct >= 100 ? '#3fb950' : pct >= 60 ? '#d29922' : '#f85149' }}>
                      {pct}%
                    </td>
                  </tr>
                );
              })}
              {/* Bottom Summary Row */}
              <tr className="bg-[#161b22]/50 border-t-2 border-[#30363d]">
                <td className="sticky left-0 z-[5] bg-[#1c2128] border-r border-[#30363d] p-0 h-[32px]">
                  <div className="flex items-center px-4 h-full text-[10px] font-bold text-[#8b949e] tracking-widest">
                    DAY TOTAL
                  </div>
                </td>
                {Array.from({length: dim}).map((_, i) => {
                  const d = i + 1;
                  const cnt = stats.dayCounts[d];
                  const p = dailyGoal > 0 ? (cnt / dailyGoal) : 0;
                  const bg = p >= 1.0 ? '#1a4e2a' : p >= 0.5 ? '#4e3e1a' : p > 0 ? '#1f2b3e' : 'transparent';
                  const textColor = p >= 1.0 ? '#3fb950' : p >= 0.5 ? '#d29922' : p > 0 ? '#58a6ff' : '#21262d';
                  
                  return (
                    <td key={i} className="h-[32px] border-r border-[#21262d] p-0 text-center text-[10px] font-bold" style={{ backgroundColor: bg, color: textColor }}>
                      {cnt > 0 ? Number(cnt).toFixed(1) : ''}
                    </td>
                  );
                })}
                <td colSpan={3} className="bg-[#161b22]/50" />
              </tr>
            </tbody>
          </table>
          <div className="h-20" /> {/* Spacer */}
        </div>

        {/* Right Panel */}
        <div className="w-[240px] bg-[#161b22] border-l border-[#30363d] overflow-y-auto custom-scrollbar flex flex-col p-4 gap-6">
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] mb-2 flex items-center justify-between">
              Timer
              <Timer size={11} className={timerRunning ? 'text-blue-500 animate-pulse' : ''} />
            </h3>
            
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 flex flex-col items-center gap-3 relative overflow-hidden group/timer">
              {/* Timer Background Glow */}
              <div className={`absolute inset-0 bg-blue-500/5 transition-opacity duration-1000 ${timerRunning ? 'opacity-100' : 'opacity-0'}`} />
              
              <div className="flex gap-1.5 mb-1 z-10">
                {(['pomodoro', 'short', 'long'] as const).map(m => (
                  <button 
                    key={m}
                    onClick={() => resetTimer(m)}
                    className={`text-[8px] px-2 py-0.5 rounded-full border transition-all ${timerMode === m ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'border-[#30363d] text-[#8b949e] hover:border-[#484f58]'}`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>

              <div className="text-3xl font-black font-mono text-white tracking-widest z-10">
                {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{Math.floor(timerSeconds % 60).toString().padStart(2, '0')}
              </div>

              <div className="w-full h-1 bg-[#21262d] rounded-full overflow-hidden z-10">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${(timerSeconds / (timerMode === 'pomodoro' ? 1500 : timerMode === 'short' ? 300 : 900)) * 100}%` }}
                />
              </div>

              <div className="flex gap-2 w-full z-10">
                <button 
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all ${timerRunning ? 'bg-[#30363d] text-white hover:bg-[#484f58]' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20'}`}
                >
                  {timerRunning ? <><Pause size={12}/> Pause</> : <><Play size={12}/> Start</>}
                </button>
                <button 
                  onClick={() => resetTimer(timerMode)}
                  className="p-1.5 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-all"
                >
                  <RotateCcw size={12} />
                </button>
              </div>

              <select 
                value={activeTimerHabit || ''}
                onChange={(e) => {
                  const id = e.target.value;
                  setActiveTimerHabit(id || null);
                  if (id) {
                    const h = habits.find(x => x.id === id);
                    if (h && h.sessionGoal) {
                      setTimerSeconds(h.sessionGoal * 3600);
                      setTimerRunning(false);
                    }
                  }
                }}
                className="w-full bg-[#161b22] border border-[#30363d] text-[9px] px-2 py-1.5 rounded-lg outline-none text-[#8c949e] focus:border-[#484f58] transition-all z-10"
              >
                <option value="">Select current task...</option>
                {habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>

              {timerSeconds === 0 && activeTimerHabit && (
                <button 
                  onClick={() => {
                    const hKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
                    const targetHabit = habits.find(h=>h.id===activeTimerHabit);
                    const addHrs = targetHabit?.sessionGoal || 0.4;
                    updateHours(activeTimerHabit, hKey, (targetHabit?.done[hKey] || 0) + addHrs);
                    resetTimer(timerMode);
                    if (targetHabit?.sessionGoal) setTimerSeconds(targetHabit.sessionGoal * 3600);
                  }}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold rounded-lg animate-bounce z-10"
                >
                  Log Spent Time
                </button>
              )}
            </div>
            <p className="text-[8px] text-center text-[#8b949e] mt-2 italic">Finish a session to log hours automatically</p>
          </section>

          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] mb-4">Top Habits</h3>
            <div className="flex flex-col gap-3">
              {[...habits]
                .sort((a, b) => (getMonthDoneTotal(b)/b.goal) - (getMonthDoneTotal(a)/a.goal))
                .slice(0, 5)
                .map(h => {
                  const done = getMonthDoneTotal(h);
                  const pct = Math.round(done / h.goal * 100);
                  const color = CATS[h.cat].color;
                  return (
                    <div key={h.id} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[10px] text-[#e6edf3]">
                        <span className="truncate max-w-[120px] font-medium">{h.name}</span>
                        <span className="font-bold flex items-center gap-1" style={{ color: pct >= 100 ? '#3fb950' : '#8b949e'}}>
                          {done.toFixed(1)}h
                          <span className="text-[8px] opacity-60">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-[18px] bg-[#0d1117] rounded-sm p-[2px] border border-[#21262d]">
                        <div className="h-full rounded-sm opacity-80" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] mb-4">Visual Analytics</h3>
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekChartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8b949e', fontSize: 10 }}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(58, 62, 71, 0.4)' }}
                    contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '4px', fontSize: '10px', color: '#e6edf3' }}
                  />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={24}>
                    {weekChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value >= 80 ? '#3fb950' : entry.value >= 50 ? '#d29922' : '#316dca'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-center text-[#8b949e] mt-2">Weekly completion rates</p>
          </section>

          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] mb-4">Streaks Matrix</h3>
            <div className="flex flex-col gap-5">
              {habits.slice(0, 4).map(h => (
                <div key={h.id}>
                  <div className="text-[9px] font-semibold text-[#8b949e] mb-2 truncate">{h.name}</div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({length: 28}).map((_, i) => {
                      const dateKey = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                      const isDone = !!h.done[dateKey];
                      const fut = new Date(curYear, curMonth, i + 1) > today;
                      return (
                        <div 
                          key={i} 
                          className="w-3.5 h-3.5 rounded-[2px]" 
                          style={{ backgroundColor: isDone ? CATS[h.cat].color : fut ? '#161b22' : '#21262d' }} 
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-auto pt-4 border-t border-[#30363d]">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] mb-3">Legend</h3>
            <div className="flex flex-wrap gap-2">
              {CATS.map(c => (
                <div key={c.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-[9px] text-[#8b949e]">{c.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </>
    ) : currentView === 'Analytics' ? (
      <AnalyticsView habits={habits} stats={stats} weekChartData={weekChartData} curYear={curYear} curMonth={curMonth} />
    ) : (
      <HistoryView habits={habits} curYear={curYear} curMonth={curMonth} />
    )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161b22] border border-[#30363d] w-full max-w-[320px] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[#30363d]">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                {isEditing ? <Settings size={16} className="text-blue-500" /> : <Plus size={16} className="text-blue-500" />}
                {isEditing ? 'Edit Habit' : 'Add New Habit'}
              </h2>
              <button onClick={closeModal} className="text-[#8b949e] hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Name</label>
                <input 
                  autoFocus
                  value={newName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                  placeholder="e.g. Morning Yoga"
                  className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#484f58] outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATS.map((c, i: number) => (
                    <button 
                      key={c.name}
                      onClick={() => setNewCat(i)}
                      className={`py-1.5 px-2 rounded-md border text-[10px] font-medium transition-all ${newCat === i ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#484f58]'}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Hourly Goal (this month)</label>
                <input 
                  type="number"
                  min={1}
                  max={200}
                  step={0.5}
                  value={newGoal}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGoal(parseFloat(e.target.value) || 0)}
                  className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Timer Goal (per session)</label>
                <input 
                  type="number"
                  min={0.1}
                  max={12}
                  step={0.1}
                  value={newSessionGoal}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSessionGoal(parseFloat(e.target.value) || 0)}
                  className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-[9px] text-[#8b949e]">Sets the timer automatically when this habit is selected.</p>
              </div>
              
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex gap-2">
                  <button 
                    onClick={closeModal}
                    className="flex-1 py-2 rounded-lg border border-[#30363d] text-[#e6edf3] text-[12px] font-semibold hover:bg-[#21262d] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAdd}
                    className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                  >
                    {isEditing ? 'Save Changes' : 'Create Habit'}
                  </button>
                </div>
                {isEditing && (
                  <button 
                    onClick={() => editingHabitId && handleDelete(editingHabitId)}
                    className="w-full py-2 mt-2 rounded-lg text-red-500 border border-red-500/20 hover:bg-red-500/10 text-[11px] font-semibold transition-all"
                  >
                    Delete Habit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#161b22] border border-[#f85149]/30 w-full max-w-[280px] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 bg-[#f85149]/10 rounded-full flex items-center justify-center">
                <X size={24} className="text-[#f85149]" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-white mb-1">Delete Habit?</h3>
                <p className="text-[10px] text-[#8b949e]">This will permanently remove "{habits.find(h=>h.id===editingHabitId)?.name}" and all tracked hours.</p>
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-2 bg-[#f85149] hover:bg-[#da3633] text-white text-[11px] font-bold rounded-lg transition-all"
                >
                  Yes, Delete it
                </button>
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="w-full py-2 text-[#8b949e] hover:text-[#e6edf3] text-[11px] font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for scrollbars */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d1117;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 10px;
          border: 2px solid #0d1117;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #484f58;
        }
      `}</style>
    </div>
  );
}

