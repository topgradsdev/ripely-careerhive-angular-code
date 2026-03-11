import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface CalcRow {
  variable: string;
  symbol: string;
  value: number | null;
  unit: string;
  editable: boolean;
}

@Component({
  selector: 'app-task-drift-calculator',
  templateUrl: './task-drift-calculator.component.html',
  styleUrls: ['./task-drift-calculator.component.scss']
})
export class TaskDriftCalculatorComponent implements OnInit {
  simulationId = '';

  // Project information
  projectName = 'Heron Gate — Tower 1';
  engineerName = '';
  calcDate = '';
  checkedBy = '';

  // Calculation pad rows
  calcRows: CalcRow[] = [
    { variable: 'Circulating-water flow rate', symbol: 'Q', value: null, unit: 'GPM', editable: true },
    { variable: 'Drift-eliminator efficiency', symbol: 'DE%', value: null, unit: '%', editable: true },
    { variable: '', symbol: '', value: null, unit: '', editable: true },
    { variable: '', symbol: '', value: null, unit: '', editable: true }
  ];

  // Plain English summary
  summaryText = '';

  // Follow-up question
  marcusQuestion = 'The displaced drift-eliminator panel on Tower 1 — should we flag it for maintenance or calculate as-is?';
  marcusAnswer = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.simulationId = params['id'] || '';
    });
  }

  get driftLossGPM(): number {
    const q = this.calcRows[0].value || 0;
    const de = this.calcRows[1].value || 0;
    if (q === 0 || de === 0) return 0;
    return q * ((100 - de) / 100) * 0.001;
  }

  get driftLossLPerHr(): number {
    return this.driftLossGPM * 227.12;
  }

  get driftLossLPerDay(): number {
    return this.driftLossLPerHr * 24;
  }

  get isValid(): boolean {
    return !!this.engineerName && !!this.calcDate
      && this.calcRows[0].value !== null && this.calcRows[0].value > 0
      && this.calcRows[1].value !== null && this.calcRows[1].value > 0;
  }

  submitCalculation(): void {
    this.router.navigate(['../watch-video'], { relativeTo: this.route });
  }
}
