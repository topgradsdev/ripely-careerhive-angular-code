import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskProgressionService } from '../shared/task-progression.service';

interface RiskCheckItem {
  id: number;
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-task-submit-form',
  templateUrl: './task-submit-form.component.html',
  styleUrls: ['./task-submit-form.component.scss']
})
export class TaskSubmitFormComponent implements OnInit {
  simulationId = '';
  currentPage = 1;
  totalPages = 2;

  // Page 1: Equipment Status
  overallCondition = '';
  siteRef = '';
  inspectionNotes = '';
  driftEliminatorStatus = '';

  // Page 2: Risk Assessment
  riskCategories: RiskCheckItem[] = [
    { id: 1, label: 'Legionella exposure risk', checked: false },
    { id: 2, label: 'Drift plume impact on adjacent buildings', checked: false },
    { id: 3, label: 'Water treatment chemical compliance', checked: false },
    { id: 4, label: 'Structural integrity of tower basin', checked: false },
    { id: 5, label: 'Electrical safety — motors & fans', checked: false }
  ];
  responseUrgency = '';
  summaryRecommendation = '';
  engineerSignOff = '';

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

  get page1Valid(): boolean {
    return !!this.overallCondition && !!this.siteRef && !!this.inspectionNotes && !!this.driftEliminatorStatus;
  }

  get page2Valid(): boolean {
    return this.riskCategories.some(r => r.checked) && !!this.responseUrgency && !!this.summaryRecommendation && !!this.engineerSignOff;
  }

  get currentPageValid(): boolean {
    return this.currentPage === 1 ? this.page1Valid : this.page2Valid;
  }

  toggleRisk(item: RiskCheckItem): void {
    item.checked = !item.checked;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  submitForReview(): void {
    this.submitted = true;
    this.taskService.completeTask('waterbalance');
    setTimeout(() => {
      this.router.navigate(['../calculation-report'], { relativeTo: this.route });
    }, 1500);
  }
}
