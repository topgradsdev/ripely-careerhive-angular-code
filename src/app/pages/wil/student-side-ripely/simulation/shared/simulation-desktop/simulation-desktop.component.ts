import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskProgressionService, TaskKey } from '../task-progression.service';

interface DesktopIcon {
  id: string;
  icon: string;
  label: string;
  route: string;
  colorClass: string;
  taskKey?: TaskKey;
}

@Component({
  selector: 'app-simulation-desktop',
  templateUrl: './simulation-desktop.component.html',
  styleUrls: ['./simulation-desktop.component.scss']
})
export class SimulationDesktopComponent implements OnInit, OnDestroy {
  @Input() simulationId = '';

  icons: DesktopIcon[] = [];
  wallpaperTime = '';
  wallpaperDate = '';
  private clockInterval: any;
  private taskSub!: Subscription;

  constructor(
    private router: Router,
    private taskService: TaskProgressionService
  ) {}

  ngOnInit(): void {
    this.buildIcons();
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 60000);

    this.taskSub = this.taskService.taskCompleted$.subscribe(() => {
      // Icons reactively update via isLocked() check, no rebuild needed
    });
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
    if (this.taskSub) this.taskSub.unsubscribe();
  }

  buildIcons(): void {
    const base = `/student-portal/simulations/${this.simulationId}`;
    this.icons = [
      { id: 'ws2', icon: '📝', label: 'T2 · Gather\nData',    route: `${base}/task/gather-data`,        colorClass: 'di-icon-amber',  taskKey: 'migration' },
      { id: 'ws3', icon: '🌡️', label: 'T3 · Drift\nLoss',     route: `${base}/task/drift-calculator`,   colorClass: 'di-icon-amber',  taskKey: 'compliance' },
      { id: 'ws4', icon: '🔢', label: 'T4 · Watch\nVideo',    route: `${base}/task/watch-video`,        colorClass: 'di-icon-amber',  taskKey: 'hotfix' },
      { id: 'ws5', icon: '💧', label: 'T5 · Water\nBalance',  route: `${base}/task/submit-form`,        colorClass: 'di-icon-blue',   taskKey: 'waterbalance' },
      { id: 'ws6', icon: '📄', label: 'T6 · Report',          route: `${base}/task/calculation-report`, colorClass: 'di-icon-purple', taskKey: 'report' },
      { id: 'files', icon: '📁', label: 'Files',              route: `${base}/library`,                 colorClass: '' }
    ];
  }

  isLocked(icon: DesktopIcon): boolean {
    if (!icon.taskKey) return false; // Files icon is always unlocked
    return !this.taskService.isTaskUnlocked(icon.taskKey);
  }

  isAppRunning(route: string): boolean {
    return this.router.url === route;
  }

  launch(icon: DesktopIcon): void {
    if (this.isLocked(icon)) return;
    this.router.navigateByUrl(icon.route);
  }

  updateClock(): void {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    this.wallpaperTime = `${h}:${m}`;

    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    this.wallpaperDate = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;
  }
}
