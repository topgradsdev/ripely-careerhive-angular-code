import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

interface TaskbarApp {
  id: string;
  label: string;
  route: string;
  icon?: string;
  badge?: number;
  wsLabel?: string;
}

interface StartMenuItem {
  id: string;
  icon: string;
  label: string;
  route: string;
  section?: string;
}

@Component({
  selector: 'app-simulation-taskbar',
  templateUrl: './simulation-taskbar.component.html',
  styleUrls: ['./simulation-taskbar.component.scss']
})
export class SimulationTaskbarComponent implements OnInit, OnDestroy {
  @Input() simulationId = '';
  @Input() lightMode = true;
  @Input() isMinimized = false;
  @Output() themeToggle = new EventEmitter<void>();
  @Output() restoreWindow = new EventEmitter<void>();

  showStartMenu = false;
  showNotifPanel = false;
  hasUnreadNotifs = true;
  currentTime = '--:--';
  currentDate = '---';
  userInitials = 'AB';

  apps: TaskbarApp[] = [];
  coreMenuItems: StartMenuItem[] = [];
  wsMenuItems: StartMenuItem[] = [];

  private clockInterval: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.buildApps();
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 60000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  buildApps(): void {
    const base = `/student-portal/simulations/${this.simulationId}`;

    // Taskbar pinned apps
    this.apps = [
      { id: 'library', label: 'Library \u2014 Project Documents', route: `${base}/library` },
      { id: 'messages', label: 'Messages', route: `${base}/messages`, badge: 4 },
      { id: 'ws2', label: 'Task 2 \u2014 Gather Your Data', route: `${base}/workstation` }
    ];

    // Start menu core apps
    this.coreMenuItems = [
      { id: 'overview', icon: '\u{1F3D7}\uFE0F', label: 'Program Overview', route: `${base}/intro` },
      { id: 'messages', icon: '\u{1F4AC}', label: 'Messages', route: `${base}/messages` },
      { id: 'tasks', icon: '\u2611\uFE0F', label: 'Tasks', route: `${base}/tasks` },
      { id: 'feedback', icon: '\u{1F4CA}', label: 'Feedback', route: `${base}/feedback` },
      { id: 'explorer', icon: '\u{1F5C2}\uFE0F', label: 'File Explorer', route: `${base}/library` }
    ];

    // Start menu workstation items
    this.wsMenuItems = [
      { id: 'ws2', icon: '\u{1F4DD}', label: 'T2 \u2014 Gather Your Data', route: `${base}/workstation` },
      { id: 'ws3', icon: '\u{1F321}\uFE0F', label: 'T3 \u2014 Drift Loss \u00B7 Tower 1', route: `${base}/workstation` },
      { id: 'ws4', icon: '\u{1F522}', label: 'T4 \u2014 Tower 2 & Site Total', route: `${base}/workstation` },
      { id: 'ws5', icon: '\u{1F4A7}', label: 'T5 \u2014 Water Balance', route: `${base}/workstation` },
      { id: 'ws6', icon: '\u{1F4C4}', label: 'T6 \u2014 Calculation Report', route: `${base}/workstation` }
    ];
  }

  navigate(route: string): void {
    this.showStartMenu = false;

    if (this.isMinimized && this.isActive(route)) {
      // Current route is minimized — restore it
      this.restoreWindow.emit();
    } else {
      // Restore in case something was minimized, then navigate
      if (this.isMinimized) {
        this.restoreWindow.emit();
      }
      this.router.navigateByUrl(route);
    }
  }

  toggleStartMenu(): void {
    this.showStartMenu = !this.showStartMenu;
    this.showNotifPanel = false;
  }

  onToggleTheme(): void {
    this.themeToggle.emit();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  /** Check if app has an active dot (route matches OR is minimized) */
  isAppRunning(route: string): boolean {
    return this.router.url === route;
  }

  toggleNotifPanel(): void {
    this.showNotifPanel = !this.showNotifPanel;
    this.showStartMenu = false;
  }

  closeNotifPanel(): void {
    this.showNotifPanel = false;
  }

  clearNotifs(): void {
    this.hasUnreadNotifs = false;
    this.showNotifPanel = false;
  }

  notifGoToMessages(): void {
    this.showNotifPanel = false;
    const base = `/student-portal/simulations/${this.simulationId}`;
    this.router.navigateByUrl(`${base}/messages`);
  }

  updateClock(): void {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    this.currentTime = `${h}:${m}`;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.currentDate = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;
  }
}
