import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface ChecklistItem {
  id: number;
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-task-gather-data',
  templateUrl: './task-gather-data.component.html',
  styleUrls: ['./task-gather-data.component.scss']
})
export class TaskGatherDataComponent implements OnInit {
  simulationId = '';
  activeTab: 'notepad' | 'checklist' = 'notepad';
  notepadContent = '';

  checklist: ChecklistItem[] = [
    { id: 1, label: 'Tower 1: Make / Model', checked: false },
    { id: 2, label: 'Tower 1: Circulating-water flow rate', checked: false },
    { id: 3, label: 'Tower 1: Drift-eliminator efficiency (%)', checked: false },
    { id: 4, label: 'Tower 1: Displaced eliminator panel noted', checked: false },
    { id: 5, label: 'Tower 2: Make / Model', checked: false },
    { id: 6, label: 'Tower 2: Circulating-water flow rate', checked: false },
    { id: 7, label: 'Tower 2: Drift-eliminator efficiency (%)', checked: false },
    { id: 8, label: 'System: Cycles of Concentration (CoC)', checked: false },
    { id: 9, label: 'System: Wet-bulb & dry-bulb temperatures', checked: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.simulationId = params['id'] || '';
    });
  }

  get completedCount(): number {
    return this.checklist.filter(i => i.checked).length;
  }

  get allComplete(): boolean {
    return this.checklist.every(i => i.checked);
  }

  toggleItem(item: ChecklistItem): void {
    item.checked = !item.checked;
  }

  submitToSupervisor(): void {
    this.router.navigate(['../drift-calculator'], { relativeTo: this.route });
  }
}
