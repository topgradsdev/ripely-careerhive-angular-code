import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskProgressionService, TaskKey } from '../shared/task-progression.service';

interface WorkstationItem {
  icon: string;
  title: string;
  subtitle: string;
  route: string;
  taskKey?: TaskKey;
  alwaysAvailable?: boolean;
}

interface ResourceGroup {
  label: string;
  icon: string;
  items: WorkstationItem[];
}

@Component({
  selector: 'app-simulation-workstation',
  templateUrl: './simulation-workstation.component.html',
  styleUrls: ['./simulation-workstation.component.scss']
})
export class SimulationWorkstationComponent implements OnInit, OnDestroy {
  simulationId = '';

  resourceGroups: ResourceGroup[] = [
    {
      label: 'Tools',
      icon: 'fa-wrench',
      items: [
        { icon: 'fa-calculator', title: 'Drift Loss Calculator', subtitle: 'Calculate cooling tower drift rates', route: '../task/drift-calculator', taskKey: 'compliance' },
        { icon: 'fa-tint', title: 'Water Balance Calculator', subtitle: 'Model water usage and losses', route: '../task/submit-form', taskKey: 'waterbalance' },
        { icon: 'fa-file-text', title: 'Report Builder', subtitle: 'Compile your engineering report', route: '../task/calculation-report', taskKey: 'report' }
      ]
    },
    {
      label: 'Documents',
      icon: 'fa-folder-open',
      items: [
        { icon: 'fa-archive', title: 'Library', subtitle: 'Meridian Engineering documents', route: '../library', alwaysAvailable: true },
        { icon: 'fa-sticky-note', title: 'Site Notes', subtitle: 'Field observations and photos', route: '../library', alwaysAvailable: true }
      ]
    },
    {
      label: 'Communication',
      icon: 'fa-comments',
      items: [
        { icon: 'fa-envelope', title: 'Messages', subtitle: 'Inbox from team and manager', route: '../messages', alwaysAvailable: true },
        { icon: 'fa-hashtag', title: 'Team Chat', subtitle: '#general channel', route: '../chat', alwaysAvailable: true }
      ]
    }
  ];

  private taskSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskProgressionService
  ) {}

  ngOnInit(): void {
    this.simulationId = this.route.parent?.snapshot.paramMap.get('id') || '';
    this.taskSub = this.taskService.taskCompleted$.subscribe(() => {});
  }

  ngOnDestroy(): void {
    if (this.taskSub) this.taskSub.unsubscribe();
  }

  getItemStatus(item: WorkstationItem): 'available' | 'locked' | 'active' {
    if (item.alwaysAvailable) return 'available';
    if (!item.taskKey) return 'available';
    if (this.taskService.isTaskUnlocked(item.taskKey)) {
      return this.taskService.isTaskComplete(item.taskKey) ? 'available' : 'active';
    }
    return 'locked';
  }

  openItem(item: WorkstationItem): void {
    if (this.getItemStatus(item) === 'locked') return;
    this.router.navigate([item.route], { relativeTo: this.route });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available': return 'Open';
      case 'active': return 'Active';
      case 'locked': return 'Locked';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'available': return 'fa-check-circle';
      case 'active': return 'fa-bolt';
      case 'locked': return 'fa-lock';
      default: return '';
    }
  }
}
