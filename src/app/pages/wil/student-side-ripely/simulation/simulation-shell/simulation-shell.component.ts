import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SimulationWindowService } from '../shared/simulation-window.service';

@Component({
  selector: 'app-simulation-shell',
  templateUrl: './simulation-shell.component.html',
  styleUrls: ['./simulation-shell.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SimulationShellComponent implements OnInit, OnDestroy {
  simulationId = '';
  isOverviewPage = true;
  lightMode = true; // default: light
  isMinimized = false;

  private routeSub!: Subscription;
  private minimizeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private windowService: SimulationWindowService
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
    this.lightMode = !this.lightMode;
  }

  restoreWindow(): void {
    this.windowService.restore();
  }

  private checkRoute(): void {
    this.isOverviewPage = this.router.url.endsWith('/overview');
  }
}
