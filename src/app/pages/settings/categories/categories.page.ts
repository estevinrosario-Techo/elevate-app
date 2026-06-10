import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: string[] = [];

  constructor(
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.categoryService.categories$.subscribe(cats => {
      this.categories = cats;
    });
  }

  async promptAddCategory() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva categoría',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Ej: Hogar, Fitness...' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: async (data) => {
            if (!data.name?.trim()) return;
            await this.categoryService.addCategory(data.name);
            const t = await this.toastCtrl.create({
              message: `Categoría "${data.name.trim()}" agregada ✓`,
              duration: 2000, color: 'success'
            });
            await t.present();
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmDelete(cat: string) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar categoría',
      message: `¿Eliminar la categoría "${cat}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar', role: 'destructive',
          handler: async () => {
            await this.categoryService.deleteCategory(cat);
          }
        }
      ]
    });
    await alert.present();
  }
}
