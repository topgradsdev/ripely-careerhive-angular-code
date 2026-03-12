import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SimulationWindowService } from '../shared/simulation-window.service';
import { ThemeService } from '../../../../../services/theme.service';

@Component({
  selector: 'app-simulation-shell',
  templateUrl: './simulation-shell.component.html',
  styleUrls: ['./simulation-shell.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SimulationShellComponent implements OnInit, OnDestroy {
  simulationId = '';
  isOverviewPage = true;
  isTaskPage = false;
  showFloatingChat = false;
  isMinimized = false;

  get lightMode(): boolean {
    return !this.themeService.isDarkMode;
  }

  private routeSub!: Subscription;
  private minimizeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private windowService: SimulationWindowService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.simulationId = this.route.snapshot.paramMap.get('id') || '';
    this.checkRoute();

    this.routeSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute();
        // Reset minimized state on navigation
        this.windowService.restore();
      });

    this.minimizeSub = this.windowService.minimized$.subscribe(
      minimized => this.isMinimized = minimized
    );
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.minimizeSub) this.minimizeSub.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  restoreWindow(): void {
    this.windowService.restore();
  }

  private checkRoute(): void {
    const url = this.router.url;
    this.isOverviewPage = url.endsWith('/overview');
    this.isTaskPage = url.includes('/task/');
    // Show floating chat on task pages, messages, and workstation
    this.showFloatingChat = url.includes('/task/') || url.includes('/messages') || url.includes('/workstation');
  }
}
