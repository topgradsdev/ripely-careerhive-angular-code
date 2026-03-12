import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private _isDarkMode = false;

  get isDarkMode(): boolean {
    return this._isDarkMode;
  }

  constructor() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this._isDarkMode = stored === 'dark';
    } else {
      this._isDarkMode = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    this._isDarkMode = !this._isDarkMode;
    localStorage.setItem(this.STORAGE_KEY, this._isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this._isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
