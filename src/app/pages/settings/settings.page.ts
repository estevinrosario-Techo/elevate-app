import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  notifEnabled = false;
  weekStart = '1';
  categoryCount = 0;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private taskService: TaskService,
    private notifService: NotificationService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.categoryService.categories$.subscribe(cats => { this.categoryCount = cats.length; });
  }

  async toggleNotifications() {
    if (this.notifEnabled) {
      const granted = await this.notifService.requestPermission();
      if (!granted) {
        this.notifEnabled = false;
        const t = await this.toastCtrl.create({ message: 'Permiso denegado', duration: 2000, color: 'warning' });
        await t.present();
      }
    }
  }

  goToCategories() { this.router.navigate(['/settings/categories']); }

  async exportTasks() {
    const tasks = this.taskService.getTasks();
    const json = JSON.stringify(tasks, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elevate_tasks_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    const t = await this.toastCtrl.create({ message: 'Tareas exportadas ✓', duration: 2000, color: 'success' });
    await t.present();
  }

  async confirmClearAll() {
    const alert = await this.alertCtrl.create({
      header: '⚠ Borrar todo',
      message: '¿Eliminar TODAS las tareas?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Borrar todo', role: 'destructive', handler: async () => {
          const all = this.taskService.getTasks();
          for (const t of all) await this.taskService.deleteTask(t.id);
          const toast = await this.toastCtrl.create({ message: 'Datos borrados', duration: 2000, color: 'danger' });
          await toast.present();
        }}
      ]
    });
    await alert.present();
  }
}
