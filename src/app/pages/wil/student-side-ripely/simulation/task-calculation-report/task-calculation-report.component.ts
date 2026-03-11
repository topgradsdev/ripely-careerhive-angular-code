import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-calculation-report',
  templateUrl: './task-calculation-report.component.html',
  styleUrls: ['./task-calculation-report.component.scss']
})
export class TaskCalculationReportComponent implements OnInit {
  simulationId = '';

  executiveSummary = '';
  methodology = '';
  resultsFindings = '';
  recommendations = '';

  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.simulationId = params['id'] || '';
    });
  }

  get isValid(): boolean {
    return !!this.executiveSummary && !!this.methodology && !!this.resultsFindings && !!this.recommendations;
  }

  submitToSupervisor(): void {
    if (this.isValid) {
      this.submitted = true;
    }
  }

  goToScorecard(): void {
    this.router.navigate(['../scorecard'], { relativeTo: this.route });
  }
}
