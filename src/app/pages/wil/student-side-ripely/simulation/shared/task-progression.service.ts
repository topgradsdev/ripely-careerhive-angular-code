import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export type TaskKey = 'briefing' | 'migration' | 'compliance' | 'hotfix' | 'waterbalance' | 'report';

export interface TaskDefinition {
  key: TaskKey;
  number: number;
  label: string;
  route: string;
  wsId?: string;
  icon: string;
}

const TASK_ORDER: TaskKey[] = ['briefing', 'migration', 'compliance', 'hotfix', 'waterbalance', 'report'];

export const TASK_DEFINITIONS: TaskDefinition[] = [
  { key: 'briefing',     number: 1, label: 'Read the Brief',        route: 'intro',                   icon: '🏗️' },
  { key: 'migration',    number: 2, label: 'Gather Your Data',      route: 'task/gather-data',        wsId: 'ws2', icon: '📝' },
  { key: 'compliance',   number: 3, label: 'Drift Loss — Tower 1',  route: 'task/drift-calculator',   wsId: 'ws3', icon: '🌡️' },
  { key: 'hotfix',       number: 4, label: 'Watch Video',           route: 'task/watch-video',        wsId: 'ws4', icon: '🔢' },
  { key: 'waterbalance', number: 5, label: 'Submit Form',           route: 'task/submit-form',        wsId: 'ws5', icon: '💧' },
  { key: 'report',       number: 6, label: 'Calculation Report',    route: 'task/calculation-report', wsId: 'ws6', icon: '📄' }
];

const STORAGE_KEY = 'sim_task_progress';

@Injectable()
export class TaskProgressionService {
  private _taskState = new BehaviorSubject<Record<TaskKey, boolean>>(this.loadState());
  private _taskCompleted = new Subject<TaskKey>();

  /** Reactive task completion state */
  taskState$: Observable<Record<TaskKey, boolean>> = this._taskState.asObservable();

  /** Emits each time a task is completed */
  taskCompleted$: Observable<TaskKey> = this._taskCompleted.asObservable();

  /** Check if a specific task is complete */
  isTaskComplete(key: TaskKey): boolean {
    return this._taskState.value[key];
  }

  /** A task is unlocked if it's the first task OR the previous task is complete */
  isTaskUnlocked(key: TaskKey): boolean {
    const idx = TASK_ORDER.indexOf(key);
    if (idx <= 0) return true; // briefing is always unlocked
    return this._taskState.value[TASK_ORDER[idx - 1]];
  }

  /** Observable version of isTaskUnlocked */
  isTaskUnlocked$(key: TaskKey): Observable<boolean> {
    const idx = TASK_ORDER.indexOf(key);
    if (idx <= 0) return this._taskState.pipe(map(() => true));
    return this._taskState.pipe(map(state => state[TASK_ORDER[idx - 1]]));
  }

  /** Mark a task as complete and persist */
  completeTask(key: TaskKey): void {
    const current = { ...this._taskState.value };
    if (current[key]) return; // already complete
    current[key] = true;
    this._taskState.next(current);
    this.saveState(current);
    this._taskCompleted.next(key);
  }

  /** Get progress summary */
  getProgress(): { completed: number; total: number; percent: number } {
    const state = this._taskState.value;
    const completed = TASK_ORDER.filter(k => state[k]).length;
    const total = TASK_ORDER.length;
    return { completed, total, percent: Math.round((completed / total) * 100) };
  }

  /** Get the current active task (first incomplete task) */
  getActiveTask(): TaskKey | null {
    const state = this._taskState.value;
    return TASK_ORDER.find(k => !state[k]) || null;
  }

  /** Get task definition by key */
  getDefinition(key: TaskKey): TaskDefinition {
    return TASK_DEFINITIONS.find(d => d.key === key)!;
  }

  /** Get task definition by workspace ID (ws2, ws3, etc.) */
  getDefinitionByWsId(wsId: string): TaskDefinition | undefined {
    return TASK_DEFINITIONS.find(d => d.wsId === wsId);
  }

  /** Get task status for display */
  getTaskStatus(key: TaskKey): 'completed' | 'active' | 'locked' {
    if (this.isTaskComplete(key)) return 'completed';
    if (this.isTaskUnlocked(key)) return 'active';
    return 'locked';
  }

  /** Reset all progress (for testing) */
  resetProgress(): void {
    const fresh = this.defaultState();
    this._taskState.next(fresh);
    this.saveState(fresh);
  }

  private loadState(): Record<TaskKey, boolean> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Validate shape
        const state = this.defaultState();
        for (const key of TASK_ORDER) {
          if (typeof parsed[key] === 'boolean') {
            state[key] = parsed[key];
          }
        }
        return state;
      }
    } catch {}
    return this.defaultState();
  }

  private saveState(state: Record<TaskKey, boolean>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  private defaultState(): Record<TaskKey, boolean> {
    return {
      briefing: false,
      migration: false,
      compliance: false,
      hotfix: false,
      waterbalance: false,
      report: false
    };
  }
}
