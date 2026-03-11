import { Component } from '@angular/core';

interface Decision {
  id: string;
  label: string;
  outcome: string;
}

interface CrisisStage {
  title: string;
  description: string;
  decisions: Decision[];
}

@Component({
  selector: 'app-task-crisis',
  templateUrl: './task-crisis.component.html',
  styleUrls: ['./task-crisis.component.scss']
})
export class TaskCrisisComponent {
  currentStage = 0;
  selectedDecisions: string[] = [];
  deployed = false;

  stages: CrisisStage[] = [
    {
      title: 'Alert: Elevated Drift Readings',
      description: 'Monitoring sensors detect drift rates 3x above normal at Tower C. Water droplets visible from adjacent car park. Site manager requests immediate assessment.',
      decisions: [
        { id: 'a1', label: 'Shut down Tower C immediately', outcome: 'Tower offline — reduced cooling capacity but drift stops.' },
        { id: 'a2', label: 'Reduce fan speed to 50%', outcome: 'Drift reduced but not eliminated. Cooling capacity maintained at 70%.' },
        { id: 'a3', label: 'Inspect drift eliminators first', outcome: 'Inspection reveals damaged eliminator panels in two cells.' }
      ]
    },
    {
      title: 'Escalation: Health & Safety Concern',
      description: 'Building management receives a complaint from a tenant about water mist near the parking area. HSE compliance officer is asking for your assessment.',
      decisions: [
        { id: 'b1', label: 'Issue immediate exclusion zone', outcome: 'Car park closed. Tenants redirected. HSE officer satisfied with precaution.' },
        { id: 'b2', label: 'Provide written risk assessment', outcome: 'Risk assessment submitted within 1 hour. HSE requests further monitoring data.' },
        { id: 'b3', label: 'Request Legionella test results', outcome: 'Lab confirms Legionella levels within safe limits. Reduces concern level.' }
      ]
    },
    {
      title: 'Resolution: Deploy Fix',
      description: 'You need to decide on the corrective action plan and communicate it to the client and building management.',
      decisions: [
        { id: 'c1', label: 'Replace drift eliminators + restart', outcome: 'Full repair completed. Tower back online within 48 hours.' },
        { id: 'c2', label: 'Temporary repair + scheduled maintenance', outcome: 'Quick fix applied. Full replacement scheduled for next week.' },
        { id: 'c3', label: 'Recommend tower replacement', outcome: 'Client briefed on long-term replacement plan. Interim measures in place.' }
      ]
    }
  ];

  get currentStageData(): CrisisStage {
    return this.stages[this.currentStage];
  }

  selectDecision(id: string): void {
    this.selectedDecisions[this.currentStage] = id;
  }

  isSelected(id: string): boolean {
    return this.selectedDecisions[this.currentStage] === id;
  }

  getSelectedOutcome(): string {
    const id = this.selectedDecisions[this.currentStage];
    return this.currentStageData.decisions.find(d => d.id === id)?.outcome || '';
  }

  nextStage(): void {
    if (this.currentStage < this.stages.length - 1) {
      this.currentStage++;
    }
  }

  deploy(): void {
    this.deployed = true;
  }

  get canProceed(): boolean {
    return !!this.selectedDecisions[this.currentStage];
  }
}
