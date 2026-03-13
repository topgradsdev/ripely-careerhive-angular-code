import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-simulation-progress',
  templateUrl: './simulation-progress.component.html',
  styleUrls: ['./simulation-progress.component.scss']
})
export class SimulationProgressComponent implements OnInit {
  id: string;

  overallProgress = 45;
  studentProgress = [
    { name: 'Eddie Bask', studentId: 's1871012', avatar: '', avatarUrl: 'assets/img/avatars/1.jpg', progress: 100, nextTask: '', allComplete: true },
    { name: 'Nathan Jones', studentId: 's3515996', avatar: '', avatarUrl: 'assets/img/avatars/2.jpg', progress: 40, nextTask: 'Submit High Fidelity Prototypes', allComplete: false },
    { name: 'Bob Jade', studentId: 's3515513', avatar: '', avatarUrl: 'assets/img/avatars/3.jpg', progress: 75, nextTask: 'Submit High Fidelity Prototypes', allComplete: false },
    { name: 'Victoria Kay', studentId: 's7584421', avatar: 'VK', avatarUrl: '', progress: 10, nextTask: 'Submit High Fidelity Prototypes', allComplete: false },
    { name: 'Jade Lu', studentId: 's3572661', avatar: 'JL', avatarUrl: '', progress: 75, nextTask: 'Submit High Fidelity Prototypes', allComplete: false }
  ];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
  }

  refreshData() {
    // Reload progress data when tab is clicked
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts.map(p => p.charAt(0).toUpperCase()).join('');
  }
}
