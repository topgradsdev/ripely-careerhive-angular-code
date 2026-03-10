import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface TaskItem {
  key: string;
  label: string;
  description: string;
  icon: string;
  status: 'complete' | 'in-progress' | 'locked';
  score: number | null;
}

interface SkillBadge {
  name: string;
  category: string;
  level: string;
  icon: string;
}

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  studentName = 'Student';
  overallScore = 0;
  completedTasks = 0;
  totalTasks = 6;
  activeSim = 'HVAC Engineering Simulation';
  streakDays = 5;

  tasks: TaskItem[] = [
    { key: 'briefing', label: 'Read the Brief', description: 'Review the client instruction letter and project scope', icon: '📋', status: 'complete', score: 85 },
    { key: 'migration', label: 'Gather Your Data', description: 'Collect site data and equipment specifications', icon: '📊', status: 'complete', score: 78 },
    { key: 'compliance', label: 'Drift Loss Calculation', description: 'Calculate Tower 1 drift loss using the percentage method', icon: '🔧', status: 'in-progress', score: null },
    { key: 'hotfix', label: 'Watch Training Video', description: 'Cooling tower water treatment fundamentals', icon: '🎥', status: 'locked', score: null },
    { key: 'waterbalance', label: 'Site Assessment Form', description: 'Complete the site assessment for Heron Gate', icon: '📝', status: 'locked', score: null },
    { key: 'report', label: 'Produce the Report', description: 'Write the formal calculation report for the client', icon: '📄', status: 'locked', score: null }
  ];

  skills: SkillBadge[] = [
    { name: 'Technical Writing', category: 'Professional', level: 'Developing', icon: '✍️' },
    { name: 'Data Analysis', category: 'Technical', level: 'Proficient', icon: '📈' },
    { name: 'Client Communication', category: 'Professional', level: 'Developing', icon: '💬' },
    { name: 'Risk Assessment', category: 'Technical', level: 'Beginner', icon: '⚠️' },
    { name: 'Engineering Calculations', category: 'Technical', level: 'Proficient', icon: '🔢' },
    { name: 'Compliance Standards', category: 'Regulatory', level: 'Beginner', icon: '📋' }
  ];

  quickActions = [
    { label: 'Continue Simulation', icon: '▶️', route: '/student-portal/simulations', accent: true },
    { label: 'Message Mentor', icon: '💬', route: '/student-portal/career-coaching', accent: false },
    { label: 'View Resources', icon: '📁', route: '/student-portal/support', accent: false }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.completedTasks = this.tasks.filter(t => t.status === 'complete').length;
    this.overallScore = this.calculateOverallScore();
  }

  calculateOverallScore(): number {
    const scored = this.tasks.filter(t => t.score !== null);
    if (scored.length === 0) return 0;
    return Math.round(scored.reduce((sum, t) => sum + (t.score || 0), 0) / scored.length);
  }

  getProgressPercent(): number {
    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  getScoreClass(score: number | null): string {
    if (score === null) return '';
    if (score >= 80) return 'good';
    if (score >= 60) return 'warn';
    return 'bad';
  }

  getLevelClass(level: string): string {
    switch (level) {
      case 'Proficient': return 'proficient';
      case 'Developing': return 'developing';
      default: return 'beginner';
    }
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
