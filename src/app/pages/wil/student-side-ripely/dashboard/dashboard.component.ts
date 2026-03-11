import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface TaskItem {
  key: string;
  label: string;
  subtitle: string;
  category: string;
  status: 'completed' | 'in-progress' | 'locked';
  score: number | null;
  sparkPoints?: string;
}

interface OngoingSim {
  id: string;
  title: string;
  company: string;
  companyColor: string;
  category: string;
  thumbClass: string;
  progress: number;
  tasksDone: number;
  totalTasks: number;
}

interface RecommendedSim {
  id: string;
  title: string;
  company: string;
  companyColor: string;
  category: string;
  thumbClass: string;
  tags: { label: string; class: string }[];
  extraTagCount: number;
}

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  studentName = 'Student';
  greeting = 'Good morning';
  lastUpdated = '';
  showNotification = true;

  // Score & Progress
  workReadyScore = 72;
  completedTasks = 2;
  totalTasks = 6;
  moduleProgressPercent = 33;

  // Active Simulation
  activeSimTitle = 'Heron Gate: Cooling Tower Assessment';
  activeSimCompany = 'Meridian Building Systems';
  activeSimCategory = 'HVAC';
  activeSimDifficulty = 'Intermediate';
  activeSimDuration = '3–4 hrs';
  activeSimRating = 4.9;
  activeSimProgress = 33;
  activeSimId = 'hvac';

  taskPills = [
    { label: 'T1 · Brief', status: 'completed' },
    { label: 'T2 · Data', status: 'completed' },
    { label: 'T3 · Drift Loss T1', status: 'in-progress' },
    { label: 'T4 · Video', status: 'locked' },
    { label: 'T5 · Assessment', status: 'locked' },
    { label: 'T6 · Report', status: 'locked' }
  ];

  // Stats
  statCards = [
    { value: 6, label: 'Total Tasks', colorClass: '', barWidth: 100, barColor: 'rgba(0,0,0,0.12)' },
    { value: 2, label: 'Completed', colorClass: 'rd-stat-green', barWidth: 33, barColor: '#16a34a' },
    { value: 1, label: 'In Progress', colorClass: 'rd-stat-amber', barWidth: 17, barColor: '#fb923c' },
    { value: 3, label: 'Locked', colorClass: '', barWidth: 50, barColor: 'rgba(0,0,0,0.08)' }
  ];

  // Task Breakdown
  tasks: TaskItem[] = [
    { key: 'brief', label: 'T1 · Client Brief', subtitle: 'Introduction · HVAC', category: 'HVAC', status: 'completed', score: 88, sparkPoints: '4,28 20,22 36,18 52,14 68,10 76,10' },
    { key: 'data', label: 'T2 · Gather Your Data', subtitle: 'Data collection · HVAC', category: 'HVAC', status: 'completed', score: 74, sparkPoints: '4,30 24,24 44,20 64,16 76,14' },
    { key: 'drift', label: 'T3 · Tower 1 Drift Loss', subtitle: 'Engineering calc · HVAC', category: 'HVAC', status: 'in-progress', score: null, sparkPoints: '4,26 22,22 42,18 56,14' },
    { key: 'video', label: 'T4 · Watch Video', subtitle: 'Learning · HVAC', category: 'HVAC', status: 'locked', score: null },
    { key: 'assessment', label: 'T5 · Submit Assessment', subtitle: 'Evaluation · HVAC', category: 'HVAC', status: 'locked', score: null },
    { key: 'report', label: 'T6 · Produce the Report', subtitle: 'Final deliverable · HVAC', category: 'HVAC', status: 'locked', score: null }
  ];

  // Ongoing Simulations
  ongoingSims: OngoingSim[] = [
    { id: 'cyber', title: 'Australian Cybersecurity Foundation', company: 'Career Hive', companyColor: '#f5c518', category: 'Cybersecurity', thumbClass: 'rd-thumb-cyber', progress: 15, tasksDone: 2, totalTasks: 4 },
    { id: 'data', title: 'Basics of Data Analysis', company: 'Qantas Group', companyColor: '#e8192c', category: 'Data Analysis', thumbClass: 'rd-thumb-tech', progress: 15, tasksDone: 2, totalTasks: 4 },
    { id: 'threat', title: 'Cybersecurity Threat Management', company: 'BGIS', companyColor: '#1a56db', category: 'Threat Mgmt', thumbClass: 'rd-thumb-checker', progress: 15, tasksDone: 2, totalTasks: 4 }
  ];

  // Recommended
  recommendedSims: RecommendedSim[] = [
    { id: 'rec1', title: 'Basics of Data Analysis', company: 'Qantas Group', companyColor: '#e8192c', category: 'Data', thumbClass: 'rd-thumb-tech', tags: [{ label: 'Info Tech', class: 'rd-tag-industry' }, { label: 'Python', class: 'rd-tag-skill' }], extraTagCount: 8 },
    { id: 'rec2', title: 'Cybersecurity Threat Management', company: 'BGIS', companyColor: '#1a56db', category: 'Security', thumbClass: 'rd-thumb-checker', tags: [{ label: 'Info Tech', class: 'rd-tag-industry' }, { label: 'Python', class: 'rd-tag-skill' }], extraTagCount: 8 },
    { id: 'rec3', title: 'F1 Advanced Data Analyst', company: 'Formula 1 Corps', companyColor: '#c8102e', category: 'F1', thumbClass: 'rd-thumb-track', tags: [{ label: 'Info Tech', class: 'rd-tag-industry' }, { label: 'Python', class: 'rd-tag-skill' }], extraTagCount: 8 }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('userSDetail');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this.studentName = (user.firstName || user.first_name || 'Student') + ' ' + (user.lastName || user.last_name || '');
        this.studentName = this.studentName.trim();
      } catch {}
    }

    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 17) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';

    const now = new Date();
    this.lastUpdated = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  get ringCircumference(): number {
    return 2 * Math.PI * 30;
  }

  get ringDashOffset(): number {
    return this.ringCircumference - (this.ringCircumference * this.activeSimProgress) / 100;
  }

  dismissNotification(): void {
    this.showNotification = false;
  }

  continueSimulation(): void {
    this.router.navigate(['/student-portal/simulations', this.activeSimId, 'tasks']);
  }

  openSimulation(id: string): void {
    this.router.navigate(['/student-portal/simulations', id, 'overview']);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      default: return 'Locked';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'done';
      case 'in-progress': return 'active';
      default: return 'locked';
    }
  }

  getScoreDisplay(score: number | null): string {
    return score !== null ? `${score} / 100` : '— / 100';
  }

  getChipClass(status: string): string {
    switch (status) {
      case 'completed': return 'done';
      case 'in-progress': return 'active';
      default: return '';
    }
  }

  getPillClass(status: string): string {
    switch (status) {
      case 'completed': return 'pill-done';
      case 'in-progress': return 'pill-active';
      default: return 'pill-locked';
    }
  }
}
