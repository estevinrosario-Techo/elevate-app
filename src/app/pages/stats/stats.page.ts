import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StatsService, TaskStats } from '../../services/stats.service';
import { TaskService } from '../../services/task.service';
import { Chart, DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, IonicModule, DatePipe],
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit, AfterViewInit {
  stats: TaskStats = this.getEmptyStats();
  today = new Date();
  private donutChart: any;
  private barChart: any;

  constructor(
    private statsService: StatsService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.taskService.tasks$.subscribe(() => {
      this.stats = this.statsService.getStats();
      setTimeout(() => this.renderCharts(), 200);
    });
  }

  ngAfterViewInit() {
    this.stats = this.statsService.getStats();
    setTimeout(() => this.renderCharts(), 300);
  }

  ionViewWillEnter() {
    this.stats = this.statsService.getStats();
    setTimeout(() => this.renderCharts(), 300);
  }

  get weeklyProgress(): number {
    return this.stats.weeklyTotal > 0
      ? this.stats.weeklyCompleted / this.stats.weeklyTotal
      : 0;
  }

  private renderCharts() {
    if (this.stats.total === 0) return;
    this.renderDonut();
    this.renderBar();
  }

  private renderDonut() {
    const canvas = document.getElementById('donutChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.donutChart) { this.donutChart.destroy(); this.donutChart = null; }
    const pending = Math.max(0, this.stats.pending - this.stats.overdue);
    this.donutChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completadas', 'Pendientes', 'Vencidas'],
        datasets: [{
          data: [this.stats.completed, pending, this.stats.overdue],
          backgroundColor: ['#2dd36f', '#428cff', '#eb445a'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        cutout: '60%',
      }
    });
  }

  private renderBar() {
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.barChart) { this.barChart.destroy(); this.barChart = null; }
    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Alta', 'Media', 'Baja'],
        datasets: [{
          label: 'Tareas pendientes',
          data: [this.stats.byPriority.high, this.stats.byPriority.medium, this.stats.byPriority.low],
          backgroundColor: ['#eb445a', '#ffc409', '#2dd36f'],
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  private getEmptyStats(): TaskStats {
    return {
      total: 0, completed: 0, pending: 0, overdue: 0,
      completionRate: 0, weeklyCompleted: 0, weeklyTotal: 0, weeklyRate: 0,
      byPriority: { high: 0, medium: 0, low: 0 }, byCategory: {},
    };
  }
}
