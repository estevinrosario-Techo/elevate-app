import { Injectable } from '@angular/core';

const PREFIX = 'elevate_';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private ready = false;

  async init(): Promise<void> {
    this.ready = true;
  }

  async get<T>(key: string): Promise<T | null> {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return null;
    try { return JSON.parse(raw) as T; } catch { return null; }
  }

  async set(key: string, value: unknown): Promise<void> {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(PREFIX + key);
  }

  async keys(): Promise<string[]> {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .map(k => k.slice(PREFIX.length));
  }

  async clear(): Promise<void> {
    const keys = await this.keys();
    keys.forEach(k => localStorage.removeItem(PREFIX + k));
  }
}
