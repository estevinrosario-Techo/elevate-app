import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Task, Priority } from '../../models/task.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  @Input() task?: Task;

  isEditing = false;
  submitted = false;
  categories: string[] = [];
  minDate = new Date().toISOString().slice(0, 16);

  form = {
    title: '',
    description: null as string | null,
    priority: 'medium' as Priority,
    category: 'Personal',
    dueDate: null as string | null,
    reminderEnabled: true,
  };

  constructor(
    private modalCtrl: ModalController,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categories = this.categoryService.getCategories();
    if (this.task) {
      this.isEditing = true;
      this.form = {
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
        category: this.task.category,
        dueDate: this.task.dueDate ? this.task.dueDate.slice(0, 16) : null,
        reminderEnabled: this.task.reminderEnabled,
      };
    }
  }

  async save() {
    this.submitted = true;
    if (!this.form.title.trim()) return;

    const result = {
      title: this.form.title.trim(),
      description: this.form.description?.trim() || null,
      priority: this.form.priority,
      category: this.form.category || 'Personal',
      dueDate: this.form.dueDate ? new Date(this.form.dueDate).toISOString() : null,
      reminderEnabled: this.form.reminderEnabled && !!this.form.dueDate,
    };

    await this.modalCtrl.dismiss(result, 'save');
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
