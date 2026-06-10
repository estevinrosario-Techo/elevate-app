import { Routes } from '@angular/router';

export const tabsRoutes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.component').then(m => m.TabsComponent),
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
      { path: 'completed', loadComponent: () => import('./pages/completed/completed.page').then(m => m.CompletedPage) },
      { path: 'stats', loadComponent: () => import('./pages/stats/stats.page').then(m => m.StatsPage) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage) },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: 'task-form', loadComponent: () => import('./pages/task-form/task-form.page').then(m => m.TaskFormPage) },
  { path: 'task-form/:id', loadComponent: () => import('./pages/task-form/task-form.page').then(m => m.TaskFormPage) },
  { path: 'task-detail/:id', loadComponent: () => import('./pages/task-detail/task-detail.page').then(m => m.TaskDetailPage) },
  { path: 'settings/categories', loadComponent: () => import('./pages/settings/categories/categories.page').then(m => m.CategoriesPage) },
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' }
];
