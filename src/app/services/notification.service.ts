import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private permissionGranted = false;

  constructor(private storage: StorageService) {}

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      this.permissionGranted = false;
      return false;
    }
    const result = await Notification.requestPermission();
    this.permissionGranted = result === 'granted';
    return this.permissionGranted;
  }

  async scheduleReminder(taskId: string, title: string, dueDate: string, notificationId: number): Promise<void> {
    const due = new Date(dueDate);
    const notifDate = new Date(due.getTime() - 24 * 60 * 60 * 1000);
    const now = new Date();
    if (notifDate <= now) return;

    const delay = notifDate.getTime() - now.getTime();
    const timerId = window.setTimeout(() => {
      if (this.permissionGranted) {
        new Notification('⏰ Tarea próxima a vencer', {
          body: `"${title}" vence mañana.`,
          icon: '/assets/icon/favicon.png',
          tag: `task-${taskId}`,
        });
      }
    }, delay);

    // Persist timer info so we can cancel later
    const pending = (await this.storage.get<Record<string, number>>('pending_notifications')) || {};
    pending[String(notificationId)] = timerId;
    await this.storage.set('pending_notifications', pending);
  }

  async cancelReminder(notificationId: number): Promise<void> {
    const pending = (await this.storage.get<Record<string, number>>('pending_notifications')) || {};
    const timerId = pending[String(notificationId)];
    if (timerId !== undefined) {
      window.clearTimeout(timerId);
      delete pending[String(notificationId)];
      await this.storage.set('pending_notifications', pending);
    }
  }
}
