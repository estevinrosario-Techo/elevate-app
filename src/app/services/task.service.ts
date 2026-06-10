import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task, Priority } from '../models/task.model';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

const TASK_PREFIX = 'task_';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private nextNotifId = 1000;

  constructor(
    private storage: StorageService,
    private notifService: NotificationService
  ) {}

  async init(): Promise<void> {
    await this.loadAllTasks();
    const idSaved = await this.storage.get<number>('next_notif_id');
    if (idSaved) this.nextNotifId = idSaved;
  }

  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  getPendingTasks(): Task[] {
    return this.getTasks()
      .filter(t => !t.completed)
      .sort((a, b) => {
        const pOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
        const pDiff = pOrder[a.priority] - pOrder[b.priority];
        if (pDiff !== 0) return pDiff;
        if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      });
  }

  getCompletedTasks(): Task[] {
    return this.getTasks()
      .filter(t => t.completed)
      .sort((a, b) => {
        const aDate = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bDate = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return bDate - aDate;
      });
  }

  getTaskById(id: string): Task | undefined {
    return this.getTasks().find(t => t.id === id);
  }

  async createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt' | 'notificationId'>): Promise<Task> {
    const id = this.generateId();
    const notifId = this.nextNotifId++;
    await this.storage.set('next_notif_id', this.nextNotifId);

    const task: Task = {
      ...data,
      id,
      completed: false,
      completedAt: null,
      notificationId: notifId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.storage.set(TASK_PREFIX + id, task);
    await this.loadAllTasks();

    if (task.dueDate && task.reminderEnabled) {
      await this.notifService.scheduleReminder(task.id, task.title, task.dueDate, notifId);
    }

    return task;
  }

  async updateTask(id: string, data: Partial<Task>): Promise<void> {
    const existing = this.getTaskById(id);
    if (!existing) return;

    // Cancel old notification if any
    if (existing.notificationId !== null) {
      await this.notifService.cancelReminder(existing.notificationId);
    }

    const updated: Task = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };

    await this.storage.set(TASK_PREFIX + id, updated);
    await this.loadAllTasks();

    // Reschedule if needed
    if (updated.dueDate && updated.reminderEnabled && updated.notificationId !== null) {
      await this.notifService.scheduleReminder(updated.id, updated.title, updated.dueDate, updated.notificationId);
    }
  }

  async deleteTask(id: string): Promise<void> {
    const existing = this.getTaskById(id);
    if (existing?.notificationId !== null && existing?.notificationId !== undefined) {
      await this.notifService.cancelReminder(existing.notificationId);
    }
    await this.storage.remove(TASK_PREFIX + id);
    await this.loadAllTasks();
  }

  async markCompleted(id: string, completed: boolean): Promise<void> {
    await this.updateTask(id, {
      completed,
      completedAt: completed ? new Date().toISOString() : null,
    });
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }

  searchAndFilter(tasks: Task[], search: string, priorityFilter: Priority | 'all', categoryFilter: string): Task[] {
    return tasks.filter(t => {
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchCategory = !categoryFilter || categoryFilter === 'all' || t.category === categoryFilter;
      return matchSearch && matchPriority && matchCategory;
    });
  }

  private async loadAllTasks(): Promise<void> {
    const keys = await this.storage.keys();
    const taskKeys = keys.filter(k => k.startsWith(TASK_PREFIX));
    const tasks: Task[] = [];
    for (const key of taskKeys) {
      const task = await this.storage.get<Task>(key);
      if (task) tasks.push(task);
    }
    this.tasksSubject.next(tasks);
  }

  private generateId(): string {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
  }
}
