import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskProgressionService, TaskKey, TASK_DEFINITIONS } from '../task-progression.service';

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
  taskKey?: TaskKey;
}

interface WsTaskbarButton {
  id: string;
  icon: string;
  label: string;
  route: string;
  taskKey: TaskKey;
}

interface NotificationItem {
  id: string;
  iconEmoji: string;
  iconClass: string;
  appName: string;
  body: string;
  sub: string;
  time: string;
  unread: boolean;
  action?: () => void;
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
  showLeavePopup = false;
  hasUnreadNotifs = true;
  currentTime = '--:--';
  currentDate = '---';
  userInitials = 'AB';

  apps: TaskbarApp[] = [];
  coreMenuItems: StartMenuItem[] = [];
  wsMenuItems: StartMenuItem[] = [];
  wsTaskbarButtons: WsTaskbarButton[] = [];
  notifications: NotificationItem[] = [];

  private clockInterval: any;
  private taskSub!: Subscription;

  constructor(
    private router: Router,
    private taskService: TaskProgressionService
  ) {}

  ngOnInit(): void {
    this.buildApps();
    this.buildNotifications();
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 60000);

    this.taskSub = this.taskService.taskCompleted$.subscribe(() => {
      this.buildWsButtons();
      this.buildNotifications();
    });
  }

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
    if (this.taskSub) {
      this.taskSub.unsubscribe();
    }
  }

  buildApps(): void {
    const base = `/student-portal/simulations/${this.simulationId}`;

    // Taskbar pinned apps (Library + Messages are always visible)
    this.apps = [
      { id: 'library', label: 'Library — Project Documents', route: `${base}/library` },
      { id: 'messages', label: 'Messages', route: `${base}/messages`, badge: 4 }
    ];

    // Build dynamic ws taskbar buttons
    this.buildWsButtons();

    // Start menu core apps
    this.coreMenuItems = [
      { id: 'overview', icon: '🏗️', label: 'Program Overview', route: `${base}/intro` },
      { id: 'messages', icon: '💬', label: 'Messages', route: `${base}/messages` },
      { id: 'tasks', icon: '☑️', label: 'Tasks', route: `${base}/tasks` },
      { id: 'feedback', icon: '📊', label: 'Feedback', route: `${base}/feedback` },
      { id: 'explorer', icon: '🗂️', label: 'File Explorer', route: `${base}/library` }
    ];

    // Start menu workstation items — with task keys for lock checking
    this.wsMenuItems = [
      { id: 'ws2', icon: '📝', label: 'T2 — Gather Your Data',       route: `${base}/task/gather-data`,        taskKey: 'migration' },
      { id: 'ws3', icon: '🌡️', label: 'T3 — Drift Loss · Tower 1',  route: `${base}/task/drift-calculator`,   taskKey: 'compliance' },
      { id: 'ws4', icon: '🔢', label: 'T4 — Watch Video',            route: `${base}/task/watch-video`,        taskKey: 'hotfix' },
      { id: 'ws5', icon: '💧', label: 'T5 — Submit Form',            route: `${base}/task/submit-form`,        taskKey: 'waterbalance' },
      { id: 'ws6', icon: '📄', label: 'T6 — Calculation Report',     route: `${base}/task/calculation-report`, taskKey: 'report' }
    ];
  }

  private buildWsButtons(): void {
    const base = `/student-portal/simulations/${this.simulationId}`;
    // T2-T6 dynamic taskbar buttons: visible when unlocked
    const allWsButtons: WsTaskbarButton[] = [
      { id: 'ws2', icon: '📝', label: 'T2', route: `${base}/task/gather-data`,        taskKey: 'migration' },
      { id: 'ws3', icon: '🌡️', label: 'T3', route: `${base}/task/drift-calculator`,   taskKey: 'compliance' },
      { id: 'ws4', icon: '🔢', label: 'T4', route: `${base}/task/watch-video`,        taskKey: 'hotfix' },
      { id: 'ws5', icon: '💧', label: 'T5', route: `${base}/task/submit-form`,        taskKey: 'waterbalance' },
      { id: 'ws6', icon: '📄', label: 'T6', route: `${base}/task/calculation-report`, taskKey: 'report' }
    ];

    this.wsTaskbarButtons = allWsButtons.filter(btn => this.taskService.isTaskUnlocked(btn.taskKey));
  }

  /** Check if a start menu ws item is unlocked */
  isWsUnlocked(taskKey?: TaskKey): boolean {
    if (!taskKey) return true;
    return this.taskService.isTaskUnlocked(taskKey);
  }

  navigate(route: string, taskKey?: TaskKey): void {
    this.showStartMenu = false;

    // Block navigation for locked ws items
    if (taskKey && !this.taskService.isTaskUnlocked(taskKey)) {
      return;
    }

    // Intercept "Return to Dashboard" — show confirmation popup
    if (route === '/student-portal/simulations') {
      this.showLeavePopup = true;
      return;
    }

    if (this.isMinimized && this.isActive(route)) {
      this.restoreWindow.emit();
    } else {
      if (this.isMinimized) {
        this.restoreWindow.emit();
      }
      this.router.navigateByUrl(route);
    }
  }

  confirmLeave(): void {
    this.showLeavePopup = false;
    this.router.navigateByUrl('/student-portal/simulations');
  }

  cancelLeave(): void {
    this.showLeavePopup = false;
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
    this.notifications = [];
    this.showNotifPanel = false;
  }

  notifGoToMessages(): void {
    this.showNotifPanel = false;
    const base = `/student-portal/simulations/${this.simulationId}`;
    this.router.navigateByUrl(`${base}/messages`);
  }

  private buildNotifications(): void {
    const base = `/student-portal/simulations/${this.simulationId}`;
    const progress = this.taskService.getProgress();
    const activeTask = this.taskService.getActiveTask();

    this.notifications = [];

    // Always show the initial Marcus message
    this.notifications.push({
      id: 'marcus-brief',
      iconEmoji: '💬',
      iconClass: 'accent-bg',
      appName: 'Messages · Meridian BS',
      body: 'Marcus Webb sent you a brief',
      sub: 'Task 1 is ready — Read the Brief & Know Your Job',
      time: 'Now',
      unread: !this.taskService.isTaskComplete('briefing'),
      action: () => this.notifGoToMessages()
    });

    // Show task assignment
    this.notifications.push({
      id: 'tasks-assigned',
      iconEmoji: '📋',
      iconClass: 'blue-bg',
      appName: 'Tasks · Module 1',
      body: `${progress.completed} of ${progress.total} tasks completed`,
      sub: activeTask
        ? `Current: ${this.taskService.getDefinition(activeTask).label}`
        : 'All tasks complete!',
      time: 'Just now',
      unread: progress.completed < progress.total
    });

    // Enrolment notification
    this.notifications.push({
      id: 'enrolment',
      iconEmoji: '✅',
      iconClass: 'green-bg',
      appName: 'Career Hive',
      body: 'Enrolment confirmed',
      sub: 'Meridian BS · Junior Mechanical Engineer simulation',
      time: '1 min ago',
      unread: false
    });

    // Add task-specific notifications based on completed tasks
    if (this.taskService.isTaskComplete('briefing')) {
      this.notifications.splice(1, 0, {
        id: 'task-briefing-done',
        iconEmoji: '✅',
        iconClass: 'green-bg',
        appName: 'Tasks · Module 1',
        body: 'Briefing complete — workstation ready',
        sub: 'Task 2: Gather Your Data is now unlocked',
        time: 'Recent',
        unread: false
      });
    }

    this.hasUnreadNotifs = this.notifications.some(n => n.unread);
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
