import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface WorkstationItem {
  icon: string;
  title: string;
  subtitle: string;
  route: string;
  status: 'available' | 'locked' | 'active';
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
export class SimulationWorkstationComponent implements OnInit {
  simulationId = '';

  resourceGroups: ResourceGroup[] = [
    {
      label: 'Tools',
      icon: 'fa-wrench',
      items: [
        { icon: 'fa-calculator', title: 'Drift Loss Calculator', subtitle: 'Calculate cooling tower drift rates', route: '../task/drift-calculator', status: 'active' },
        { icon: 'fa-tint', title: 'Water Balance Calculator', subtitle: 'Model water usage and losses', route: '../task/drift-calculator', status: 'locked' },
        { icon: 'fa-file-text', title: 'Report Builder', subtitle: 'Compile your engineering report', route: '../task/calculation-report', status: 'locked' }
      ]
    },
    {
      label: 'Documents',
      icon: 'fa-folder-open',
      items: [
        { icon: 'fa-archive', title: 'Library', subtitle: 'Meridian Engineering documents', route: '../library', status: 'available' },
        { icon: 'fa-sticky-note', title: 'Site Notes', subtitle: 'Field observations and photos', route: '../library', status: 'available' }
      ]
    },
    {
      label: 'Communication',
      icon: 'fa-comments',
      items: [
        { icon: 'fa-envelope', title: 'Messages', subtitle: 'Inbox from team and manager', route: '../messages', status: 'available' },
        { icon: 'fa-hashtag', title: 'Team Chat', subtitle: '#general channel', route: '../chat', status: 'available' }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.simulationId = this.route.parent?.snapshot.paramMap.get('id') || '';
  }

  openItem(item: WorkstationItem): void {
    if (item.status === 'locked') return;
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
