import { Injectable } from '@angular/core';
import { TaskService } from './task.service';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  weeklyCompleted: number;
  weeklyTotal: number;
  weeklyRate: number;
  byPriority: { high: number; medium: number; low: number };
  byCategory: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private taskService: TaskService) {}

  getStats(): TaskStats {
    const all = this.taskService.getTasks();
    const completed = all.filter(t => t.completed);
    const pending = all.filter(t => !t.completed);
    const overdue = pending.filter(t => this.taskService.isOverdue(t));

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyCompleted = completed.filter(t =>
      t.completedAt && new Date(t.completedAt) >= startOfWeek
    );
    const weeklyTotal = all.filter(t =>
      new Date(t.createdAt) >= startOfWeek
    );

    const byPriority = { high: 0, medium: 0, low: 0 };
    pending.forEach(t => byPriority[t.priority]++);

    const byCategory: Record<string, number> = {};
    all.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
    });

    return {
      total: all.length,
      completed: completed.length,
      pending: pending.length,
      overdue: overdue.length,
      completionRate: all.length > 0 ? Math.round((completed.length / all.length) * 100) : 0,
      weeklyCompleted: weeklyCompleted.length,
      weeklyTotal: weeklyTotal.length,
      weeklyRate: weeklyTotal.length > 0 ? Math.round((weeklyCompleted.length / weeklyTotal.length) * 100) : 0,
      byPriority,
      byCategory,
    };
  }
}
