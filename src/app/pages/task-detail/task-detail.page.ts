import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, IonicModule, DatePipe],
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {
  task?: Task;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.taskService.tasks$.subscribe(() => {
      this.task = this.taskService.getTaskById(id);
    });
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.task = this.taskService.getTaskById(id);
  }

  get priorityColor(): string {
    const map: Record<string, string> = { high: 'danger', medium: 'warning', low: 'success' };
    return map[this.task?.priority || 'medium'];
  }

  get priorityLabel(): string {
    const map: Record<string, string> = { high: '🔴 Alta', medium: '🟠 Media', low: '🟢 Baja' };
    return map[this.task?.priority || 'medium'];
  }

  get isOverdue(): boolean { return !!this.task && this.taskService.isOverdue(this.task); }

  get createdAgo(): string {
    if (!this.task) return '';
    const days = Math.floor((Date.now() - new Date(this.task.createdAt).getTime()) / 86400000);
    if (days === 0) return 'Hoy';
    if (days === 1) return '1 día';
    return `${days} días`;
  }

  openEdit() {
    if (this.task) this.router.navigate(['/task-form', this.task.id]);
  }

  async toggleComplete() {
    if (!this.task) return;
    await this.taskService.markCompleted(this.task.id, !this.task.completed);
    const msg = this.task.completed ? 'Tarea reactivada' : '¡Tarea completada! 🎉';
    this.showToast(msg, 'success');
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: `¿Eliminar "${this.task?.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: async () => {
          await this.taskService.deleteTask(this.task!.id);
          this.router.navigate(['/tabs/home']);
        }}
      ]
    });
    await alert.present();
  }

  goBack() { this.router.navigate(['/tabs/home']); }

  private async showToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    await t.present();
  }
}
