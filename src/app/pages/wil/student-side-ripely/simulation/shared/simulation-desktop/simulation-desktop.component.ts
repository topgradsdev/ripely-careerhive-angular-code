import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

interface DesktopIcon {
  id: string;
  icon: string;
  label: string;
  route: string;
  colorClass: string;
  locked: boolean;
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.buildIcons();
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 60000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  buildIcons(): void {
    const base = `/student-portal/simulations/${this.simulationId}`;
    this.icons = [
      { id: 'ws2', icon: '\u{1F4DD}', label: 'T2 \u00B7 Gather\nData', route: `${base}/workstation`, colorClass: 'di-icon-amber', locked: true },
      { id: 'ws3', icon: '\u{1F321}\uFE0F', label: 'T3 \u00B7 Drift\nLoss', route: `${base}/workstation`, colorClass: 'di-icon-amber', locked: true },
      { id: 'ws4', icon: '\u{1F522}', label: 'T4 \u00B7 Site\nTotal', route: `${base}/workstation`, colorClass: 'di-icon-amber', locked: true },
      { id: 'ws5', icon: '\u{1F4A7}', label: 'T5 \u00B7 Water\nBalance', route: `${base}/workstation`, colorClass: 'di-icon-blue', locked: true },
      { id: 'ws6', icon: '\u{1F4C4}', label: 'T6 \u00B7 Report', route: `${base}/workstation`, colorClass: 'di-icon-purple', locked: true },
      { id: 'files', icon: '\u{1F4C1}', label: 'Files', route: `${base}/library`, colorClass: '', locked: false }
    ];
  }

  launch(icon: DesktopIcon): void {
    if (icon.locked) return;
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
