import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskProgressionService } from '../shared/task-progression.service';

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
    private router: Router,
    private taskService: TaskProgressionService
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
      this.taskService.completeTask('report');
      this.submitted = true;
    }
  }

  goToScorecard(): void {
    this.router.navigate(['../scorecard'], { relativeTo: this.route });
  }
}
