export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  category: string;
  dueDate: string | null;
  completed: boolean;
  completedAt: string | null;
  notificationId: number | null;
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
