import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface SkillScore {
  name: string;
  score: number;
  maxScore: number;
  icon: string;
}

interface SummaryCard {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-simulation-scorecard',
  templateUrl: './simulation-scorecard.component.html',
  styleUrls: ['./simulation-scorecard.component.scss']
})
export class SimulationScorecardComponent implements OnInit {
  simulationId = '';

  overallScore = 78;
  overallGrade = 'B+';
  simulationTitle = 'Meridian BS: Cooling Tower Assessment';
  completionDate = 'March 2026';
  timeTaken = '3h 42m';
  tasksCompleted = '6 / 6';
  studentName = 'New Team Member';
  emailAddress = '';
  certificateId = 'MER-CT-2026-0412';

  summaryCards: SummaryCard[] = [
    { label: 'Tasks Completed', value: '6 / 6', icon: 'fa-check-circle' },
    { label: 'Time Taken', value: '3h 42m', icon: 'fa-clock-o' },
    { label: 'Grade', value: 'B+', icon: 'fa-trophy' },
    { label: 'Percentile', value: 'Top 28%', icon: 'fa-bar-chart' }
  ];

  skills: SkillScore[] = [
    { name: 'Technical Writing', score: 82, maxScore: 100, icon: 'fa-pencil' },
    { name: 'Engineering Calculations', score: 74, maxScore: 100, icon: 'fa-calculator' },
    { name: 'Risk Assessment', score: 68, maxScore: 100, icon: 'fa-exclamation-triangle' },
    { name: 'Client Communication', score: 88, maxScore: 100, icon: 'fa-comments' },
    { name: 'Data Analysis', score: 76, maxScore: 100, icon: 'fa-line-chart' },
    { name: 'Report Writing', score: 85, maxScore: 100, icon: 'fa-file-text' },
    { name: 'Critical Thinking', score: 79, maxScore: 100, icon: 'fa-lightbulb-o' },
    { name: 'Compliance Knowledge', score: 64, maxScore: 100, icon: 'fa-shield' },
    { name: 'Problem Solving', score: 81, maxScore: 100, icon: 'fa-puzzle-piece' },
    { name: 'Teamwork', score: 90, maxScore: 100, icon: 'fa-users' },
    { name: 'Time Management', score: 72, maxScore: 100, icon: 'fa-hourglass-half' },
    { name: 'Attention to Detail', score: 77, maxScore: 100, icon: 'fa-eye' }
  ];

  summary = 'You completed the Meridian BS cooling tower assessment simulation. Your engineering report was well-structured with accurate calculations. Strong performance in client communication and teamwork. Key improvement areas: environmental compliance cross-referencing and risk assessment completeness.';

  // SVG ring calculations
  readonly ringRadius = 70;
  readonly ringStroke = 12;
  readonly ringSize = (this.ringRadius + this.ringStroke) * 2;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.simulationId = this.route.parent?.snapshot.paramMap.get('id') || '';
  }

  get circumference(): number {
    return 2 * Math.PI * this.ringRadius;
  }

  get dashOffset(): number {
    return this.circumference - (this.circumference * this.overallScore) / 100;
  }

  get ringViewBox(): string {
    return `0 0 ${this.ringSize} ${this.ringSize}`;
  }

  get ringCenter(): number {
    return this.ringSize / 2;
  }

  getScoreColor(score: number): string {
    if (score >= 85) return '#00b894';
    if (score >= 70) return '#ff6b2c';
    return '#d63031';
  }

  getScoreLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Strong';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  }

  downloadCertificate(): void {
    // placeholder
  }

  shareOnLinkedIn(): void {
    // placeholder
  }

  sendResults(): void {
    if (!this.emailAddress.trim()) return;
    // placeholder
  }
}
