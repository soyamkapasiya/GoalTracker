'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Goal } from '@/hooks/useGoalData';

interface GoalCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'dailyCheckpoints'>) => void;
}

const CATEGORIES = ['fitness', 'reading', 'wellness', 'productivity', 'learning', 'health', 'other'];
const FREQUENCIES = ['daily', 'weekly'] as const;
const UNITS = ['sessions', 'pages', 'minutes', 'miles', 'reps', 'hours', 'items', 'count'];

export function GoalCreationModal({ isOpen, onClose, onAddGoal }: GoalCreationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'fitness',
    target: 5,
    frequency: 'daily' as const,
    unit: 'sessions',
  });

  const handleAddGoal = () => {
    if (!formData.name.trim()) return;

    onAddGoal({
      name: formData.name,
      category: formData.category,
      target: formData.target,
      frequency: formData.frequency,
      unit: formData.unit,
    });

    setFormData({
      name: '',
      category: 'fitness',
      target: 5,
      frequency: 'daily',
      unit: 'sessions',
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FieldGroup>
            <FieldLabel htmlFor="goal-name">Goal Name</FieldLabel>
            <Input
              id="goal-name"
              placeholder="e.g., Morning Jog"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <select
              id="category"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="frequency">Frequency</FieldLabel>
            <select
              id="frequency"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.frequency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  frequency: e.target.value as 'daily' | 'weekly',
                })
              }
            >
              {FREQUENCIES.map((freq) => (
                <option key={freq} value={freq}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </option>
              ))}
            </select>
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup>
              <FieldLabel htmlFor="target">Target</FieldLabel>
              <Input
                id="target"
                type="number"
                min="1"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="unit">Unit</FieldLabel>
              <select
                id="unit"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </FieldGroup>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddGoal} disabled={!formData.name.trim()}>
            Add Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
