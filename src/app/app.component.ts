import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline, add, funnelOutline, checkmarkCircleOutline, checkmarkCircle,
  listCircleOutline, barChartOutline, settingsOutline, trashOutline,
  calendarOutline, notificationsOutline, createOutline, arrowBackOutline,
  checkmarkOutline, timeOutline, alertCircleOutline, refreshOutline,
  pricetagOutline, downloadOutline, informationCircleOutline, personOutline,
  trophyOutline, checkmarkDoneCircleOutline, closeOutline, ellipseOutline
} from 'ionicons/icons';
import { StorageService } from './services/storage.service';
import { TaskService } from './services/task.service';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  template: `<ion-app><ion-router-outlet></ion-router-outlet></ion-app>`,
})
export class AppComponent implements OnInit {
  constructor(
    private storage: StorageService,
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {
    addIcons({
      addOutline, add, funnelOutline, checkmarkCircleOutline, checkmarkCircle,
      listCircleOutline, barChartOutline, settingsOutline, trashOutline,
      calendarOutline, notificationsOutline, createOutline, arrowBackOutline,
      checkmarkOutline, timeOutline, alertCircleOutline, refreshOutline,
      pricetagOutline, downloadOutline, informationCircleOutline, personOutline,
      trophyOutline, checkmarkDoneCircleOutline, closeOutline, ellipseOutline
    });
  }

  async ngOnInit() {
    await this.storage.init();
    await this.categoryService.init();
    await this.taskService.init();
  }
}
