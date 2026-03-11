import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface TaskFeedback {
  taskName: string;
  taskIcon: string;
  score: number;
  maxScore: number;
  managerFeedback: string;
  skills: SkillRating[];
}

interface SkillRating {
  name: string;
  rating: number;
  maxRating: number;
}

@Component({
  selector: 'app-simulation-feedback',
  templateUrl: './simulation-feedback.component.html',
  styleUrls: ['./simulation-feedback.component.scss']
})
export class SimulationFeedbackComponent implements OnInit {
  simulationId = '';

  managerName = 'Marcus Reid';
  managerRole = 'Senior Project Engineer';
  managerAvatar = 'MR';

  feedbackItems: TaskFeedback[] = [
    {
      taskName: 'Read the Brief',
      taskIcon: 'fa-book',
      score: 92,
      maxScore: 100,
      managerFeedback: 'You demonstrated strong comprehension of the project scope. Good job identifying the key deliverables and timeline constraints right away.',
      skills: [
        { name: 'Communication', rating: 9, maxRating: 10 },
        { name: 'Research', rating: 9, maxRating: 10 }
      ]
    },
    {
      taskName: 'Gather Data',
      taskIcon: 'fa-database',
      score: 85,
      maxScore: 100,
      managerFeedback: 'Solid data collection. You found the right documents quickly. Consider cross-referencing the environmental data with the manufacturer specs next time -- it would have caught the drift rate discrepancy earlier.',
      skills: [
        { name: 'Data Analysis', rating: 8, maxRating: 10 },
        { name: 'Research', rating: 9, maxRating: 10 },
        { name: 'Attention to Detail', rating: 8, maxRating: 10 }
      ]
    },
    {
      taskName: 'Drift Loss Calculation (T1)',
      taskIcon: 'fa-calculator',
      score: 78,
      maxScore: 100,
      managerFeedback: 'Calculations are mostly accurate. The methodology was sound but you missed the temperature correction factor in Step 3. Double-check unit conversions -- the evaporation rate was off by 0.2%. Still a good first attempt.',
      skills: [
        { name: 'Engineering Calc', rating: 7, maxRating: 10 },
        { name: 'Critical Thinking', rating: 8, maxRating: 10 },
        { name: 'Technical Knowledge', rating: 7, maxRating: 10 }
      ]
    },
    {
      taskName: 'Watch Training Video',
      taskIcon: 'fa-play-circle',
      score: 90,
      maxScore: 100,
      managerFeedback: 'Good engagement with the training material. Your quiz responses showed strong retention of the safety protocols and maintenance procedures.',
      skills: [
        { name: 'Technical Knowledge', rating: 9, maxRating: 10 }
      ]
    },
    {
      taskName: 'Submit Assessment Form',
      taskIcon: 'fa-file-text',
      score: 72,
      maxScore: 100,
      managerFeedback: 'You identified the major environmental risks but missed the Legionella compliance factor. The risk matrix scoring was mostly correct. Review the ASHRAE guidelines for water treatment compliance requirements.',
      skills: [
        { name: 'Risk Assessment', rating: 7, maxRating: 10 },
        { name: 'Report Writing', rating: 7, maxRating: 10 },
        { name: 'Compliance', rating: 6, maxRating: 10 }
      ]
    },
    {
      taskName: 'Final Report',
      taskIcon: 'fa-paper-plane',
      score: 82,
      maxScore: 100,
      managerFeedback: 'Well-structured report with clear sections and professional tone. The executive summary was strong. Add uncertainty analysis to your drift rate conclusions and include more visual data representation in future reports.',
      skills: [
        { name: 'Technical Writing', rating: 8, maxRating: 10 },
        { name: 'Communication', rating: 9, maxRating: 10 },
        { name: 'Report Writing', rating: 8, maxRating: 10 }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.simulationId = this.route.parent?.snapshot.paramMap.get('id') || '';
  }

  getScoreColor(score: number): string {
    if (score >= 85) return '#00b894';
    if (score >= 70) return '#f39c12';
    return '#d63031';
  }

  getRatingDots(rating: number, max: number): boolean[] {
    return Array.from({ length: max }, (_, i) => i < rating);
  }

  goToScorecard(): void {
    this.router.navigate(['../scorecard'], { relativeTo: this.route });
  }
}
