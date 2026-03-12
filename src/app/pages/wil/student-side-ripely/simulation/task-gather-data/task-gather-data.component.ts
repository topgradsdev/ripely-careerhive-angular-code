import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskProgressionService } from '../shared/task-progression.service';

interface ChecklistItem {
  id: string;
  label: string;
  sub: string;
  checked: boolean;
}

interface ChecklistGroup {
  title: string;
  items: ChecklistItem[];
}

type SandboxState = 'idle' | 'submitted' | 'passed';

@Component({
  selector: 'app-task-gather-data',
  templateUrl: './task-gather-data.component.html',
  styleUrls: ['./task-gather-data.component.scss']
})
export class TaskGatherDataComponent implements OnInit {
  simulationId = '';
  activeTab: 'dataList' | 'equip' = 'dataList';
  notepadContent = '';

  sandboxState: Record<string, SandboxState> = {
    dataList: 'idle',
    equip: 'idle'
  };

  equipGroups: ChecklistGroup[] = [
    {
      title: 'Tower 1 \u2014 BAC VTL Series',
      items: [
        { id: 'eq-t1-make',  label: 'Make & model confirmed',       sub: 'Baltimore Aircoil VTL Series',                 checked: false },
        { id: 'eq-t1-flow',  label: 'Circulating flow rate',         sub: '185 GPM \u2014 verify from site notes',        checked: false },
        { id: 'eq-t1-de',    label: 'Drift eliminator efficiency',   sub: '0.001% \u2014 DE-47 Spec Sheet, \u00A74.2',    checked: false },
        { id: 'eq-t1-panel', label: 'Displaced drift panel noted',   sub: 'Tower 1 \u2014 flagged in site visit notes',   checked: false }
      ]
    },
    {
      title: 'Tower 2 \u2014 BAC VTL Series',
      items: [
        { id: 'eq-t2-make', label: 'Make & model confirmed',       sub: 'Baltimore Aircoil VTL Series',           checked: false },
        { id: 'eq-t2-flow', label: 'Circulating flow rate',         sub: '192 GPM \u2014 verify from site notes',  checked: false },
        { id: 'eq-t2-de',   label: 'Drift eliminator efficiency',   sub: '0.001% \u2014 same spec as Tower 1',    checked: false }
      ]
    },
    {
      title: 'System \u2014 Water Treatment',
      items: [
        { id: 'eq-coc',   label: 'Cycles of concentration (CoC)',   sub: '5.2 \u2014 Water Treatment Report 2023, \u00A74, Table 3', checked: false },
        { id: 'eq-temps',  label: 'Water temperatures (in / out)',   sub: '85\u00B0F in / 68\u00B0F out',                             checked: false }
      ]
    }
  ];

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

  get allItems(): ChecklistItem[] {
    return this.equipGroups.reduce<ChecklistItem[]>((acc, g) => acc.concat(g.items), []);
  }

  get completedCount(): number {
    return this.allItems.filter(i => i.checked).length;
  }

  get totalCount(): number {
    return this.allItems.length;
  }

  get equipProgress(): number {
    return this.totalCount ? Math.round((this.completedCount / this.totalCount) * 100) : 0;
  }

  get allEquipComplete(): boolean {
    return this.allItems.every(i => i.checked);
  }

  get submittedCount(): number {
    return Object.values(this.sandboxState).filter(s => s === 'passed').length;
  }

  get totalSandboxes(): number {
    return Object.keys(this.sandboxState).length;
  }

  get canSubmitDataList(): boolean {
    return this.notepadContent.trim().length > 20;
  }

  get canSubmitEquip(): boolean {
    return this.allEquipComplete;
  }

  get allSandboxesPassed(): boolean {
    return Object.values(this.sandboxState).every(s => s === 'passed');
  }

  toggleItem(item: ChecklistItem): void {
    item.checked = !item.checked;
  }

  clearNotepad(): void {
    this.notepadContent = '';
  }

  submitSandbox(id: 'dataList' | 'equip'): void {
    if (this.sandboxState[id] === 'passed') return;
    this.sandboxState[id] = 'passed';

    if (this.allSandboxesPassed) {
      this.taskService.completeTask('migration');
      setTimeout(() => {
        this.router.navigate(['../drift-calculator'], { relativeTo: this.route });
      }, 800);
    }
  }
}
