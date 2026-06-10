import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Priority } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
})
export class TaskFormPage implements OnInit {
  isEditing = false;
  submitted = false;
  categories: string[] = [];
  taskId: string | null = null;

  form = {
    title: '',
    description: null as string | null,
    priority: 'medium' as Priority,
    category: 'Personal',
    dueDate: null as string | null,
    reminderEnabled: false,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.categories = this.categoryService.getCategories();
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditing = true;
      const task = this.taskService.getTaskById(this.taskId);
      if (task) {
        this.form = {
          title: task.title,
          description: task.description,
          priority: task.priority,
          category: task.category,
          dueDate: task.dueDate ? task.dueDate.slice(0, 16) : null,
          reminderEnabled: task.reminderEnabled,
        };
      }
    }
  }

  async save() {
    this.submitted = true;
    if (!this.form.title.trim()) return;

    const data = {
      title: this.form.title.trim(),
      description: this.form.description?.trim() || null,
      priority: this.form.priority,
      category: this.form.category || 'Personal',
      dueDate: this.form.dueDate ? new Date(this.form.dueDate).toISOString() : null,
      reminderEnabled: this.form.reminderEnabled && !!this.form.dueDate,
    };

    if (this.isEditing && this.taskId) {
      await this.taskService.updateTask(this.taskId, data);
      await this.showToast('Tarea actualizada ✓', 'success');
    } else {
      await this.taskService.createTask(data);
      await this.showToast('Tarea creada ✓', 'success');
    }
    this.router.navigate(['/tabs/home']);
  }

  cancel() {
    this.router.navigate(['/tabs/home']);
  }

  private async showToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'bottom' });
    await t.present();
  }
}
