import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { TaskService } from '../../services/task.service';
import { Task, Priority } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, DatePipe],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  allTasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchText = '';
  priorityFilter: Priority | 'all' = 'all';
  showFilter = false;
  today = new Date();

  constructor(
    private taskService: TaskService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.taskService.tasks$.subscribe(() => {
      this.allTasks = this.taskService.getPendingTasks();
      this.applyFilters();
    });
  }

  ionViewWillEnter() {
    this.today = new Date();
    this.allTasks = this.taskService.getPendingTasks();
    this.applyFilters();
  }

  toggleFilter() { this.showFilter = !this.showFilter; }
  setPriority(p: Priority | 'all') { this.priorityFilter = p; this.applyFilters(); }
  onSearch() { this.applyFilters(); }

  applyFilters() {
    this.filteredTasks = this.taskService.searchAndFilter(
      this.allTasks, this.searchText, this.priorityFilter, 'all'
    );
  }

  trackById(_: number, task: Task) { return task.id; }
  isOverdue(task: Task): boolean { return this.taskService.isOverdue(task); }

  getCategoryColor(cat: string): string {
    const colors: Record<string, string> = {
      Personal: 'tertiary', Trabajo: 'primary', Estudio: 'secondary',
      Salud: 'success', Finanzas: 'warning',
    };
    return colors[cat] || 'medium';
  }

  openNewTask() { this.router.navigate(['/task-form']); }
  openDetail(task: Task) { this.router.navigate(['/task-detail', task.id]); }

  async toggleComplete(task: Task) {
    await this.taskService.markCompleted(task.id, !task.completed);
    if (!task.completed) this.showToast('¡Tarea completada! 🎉', 'success');
  }

  async confirmDelete(task: Task) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: `¿Eliminar "${task.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: async () => {
          await this.taskService.deleteTask(task.id);
          this.showToast('Tarea eliminada', 'danger');
        }}
      ]
    });
    await alert.present();
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await toast.present();
  }
}
