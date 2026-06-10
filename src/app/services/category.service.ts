import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'user_categories';
const DEFAULT_CATEGORIES = ['Personal', 'Trabajo', 'Estudio', 'Salud', 'Finanzas'];

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<string[]>(DEFAULT_CATEGORIES);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private storage: StorageService) {}

  async init(): Promise<void> {
    const saved = await this.storage.get<string[]>(STORAGE_KEY);
    if (saved && saved.length > 0) {
      this.categoriesSubject.next(saved);
    } else {
      await this.storage.set(STORAGE_KEY, DEFAULT_CATEGORIES);
    }
  }

  getCategories(): string[] {
    return this.categoriesSubject.getValue();
  }

  async addCategory(name: string): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) return;
    const current = this.getCategories();
    if (current.includes(trimmed)) return;
    const updated = [...current, trimmed];
    this.categoriesSubject.next(updated);
    await this.storage.set(STORAGE_KEY, updated);
  }

  async deleteCategory(name: string): Promise<void> {
    const updated = this.getCategories().filter(c => c !== name);
    this.categoriesSubject.next(updated);
    await this.storage.set(STORAGE_KEY, updated);
  }
}
