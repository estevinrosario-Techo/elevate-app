import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

interface TaskGroup { label: string; tasks: Task[]; }

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [CommonModule, IonicModule, DatePipe],
  templateUrl: './completed.page.html',
  styleUrls: ['./completed.page.scss'],
})
export class CompletedPage implements OnInit {
  completedTasks: Task[] = [];
  groupedTasks: TaskGroup[] = [];

  constructor(
    private taskService: TaskService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.taskService.tasks$.subscribe(() => {
      this.completedTasks = this.taskService.getCompletedTasks();
      this.groupedTasks = this.groupByWeek(this.completedTasks);
    });
  }

  private groupByWeek(tasks: Task[]): TaskGroup[] {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const groups: Record<string, Task[]> = {
      'Esta semana': [],
      'Semana anterior': [],
      'Anteriores': [],
    };

    tasks.forEach(t => {
      const date = t.completedAt ? new Date(t.completedAt) : new Date(t.updatedAt);
      if (date >= startOfThisWeek) groups['Esta semana'].push(t);
      else if (date >= startOfLastWeek) groups['Semana anterior'].push(t);
      else groups['Anteriores'].push(t);
    });

    return Object.entries(groups)
      .filter(([, tasks]) => tasks.length > 0)
      .map(([label, tasks]) => ({ label, tasks }));
  }

  async restoreTask(task: Task) {
    await this.taskService.markCompleted(task.id, false);
    const t = await this.toastCtrl.create({ message: 'Tarea restaurada ✓', duration: 2000, color: 'primary' });
    await t.present();
  }

  async confirmDelete(task: Task) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: `¿Eliminar "${task.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: async () => { await this.taskService.deleteTask(task.id); } }
      ]
    });
    await alert.present();
  }
}
