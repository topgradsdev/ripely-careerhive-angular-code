import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Task {
  id: number;
  title: string;
  description: string;
  icon: string;
  route: string;
  status: 'completed' | 'active' | 'locked';
  skills: string[];
  duration: string;
}

@Component({
  selector: 'app-simulation-tasks',
  templateUrl: './simulation-tasks.component.html',
  styleUrls: ['./simulation-tasks.component.scss']
})
export class SimulationTasksComponent implements OnInit {
  simulationId = '';

  tasks: Task[] = [
    {
      id: 1, title: 'Read the Brief', description: 'Review the project scope, client requirements, and team introductions.',
      icon: 'fa-book', route: '../intro', status: 'completed',
      skills: ['Communication', 'Research'], duration: '10 min'
    },
    {
      id: 2, title: 'Gather Data', description: 'Collect cooling tower specifications, site data, and environmental readings from the Library.',
      icon: 'fa-database', route: '../task/gather-data', status: 'completed',
      skills: ['Data Analysis', 'Research'], duration: '20 min'
    },
    {
      id: 3, title: 'Drift Loss Calculation (T1)', description: 'Calculate drift loss rates for Tower 1 using the site data and manufacturer specifications.',
      icon: 'fa-calculator', route: '../task/drift-calculator', status: 'active',
      skills: ['Engineering Calc', 'Critical Thinking'], duration: '35 min'
    },
    {
      id: 4, title: 'Watch Training Video', description: 'Review the cooling tower maintenance and safety training module.',
      icon: 'fa-play-circle', route: '../task/watch-video', status: 'locked',
      skills: ['Technical Knowledge'], duration: '15 min'
    },
    {
      id: 5, title: 'Submit Assessment Form', description: 'Complete the environmental risk assessment form with your findings.',
      icon: 'fa-file-text', route: '../task/submit-form', status: 'locked',
      skills: ['Risk Assessment', 'Report Writing'], duration: '30 min'
    },
    {
      id: 6, title: 'Final Report', description: 'Compile your analysis into the engineering report and submit to the project manager.',
      icon: 'fa-paper-plane', route: '../task/calculation-report', status: 'locked',
      skills: ['Technical Writing', 'Communication'], duration: '40 min'
    }
  ];

  get completedCount(): number {
    return this.tasks.filter(t => t.status === 'completed').length;
  }

  get progressPercent(): number {
    return Math.round((this.completedCount / this.tasks.length) * 100);
  }

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.simulationId = this.route.parent?.snapshot.paramMap.get('id') || '';
  }

  openTask(task: Task): void {
    if (task.status === 'locked') return;
    this.router.navigate([task.route], { relativeTo: this.route });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return 'fa-check-circle';
      case 'active': return 'fa-dot-circle-o';
      case 'locked': return 'fa-lock';
      default: return 'fa-circle-o';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Done';
      case 'active': return 'Current';
      case 'locked': return 'Locked';
      default: return '';
    }
  }
}
