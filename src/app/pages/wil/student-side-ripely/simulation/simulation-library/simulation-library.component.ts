import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskProgressionService, TaskKey } from '../shared/task-progression.service';

interface LibFile {
  id: string;
  name: string;
  icon: string;
  type: string;
  date: string;
  size: string;
  lockedUntil?: TaskKey;
}

interface LibFolder {
  label: string;
  parent: string | null;
  children?: string[];
  files: LibFile[];
}

interface TreeSection {
  label: string;
  items: { id: string; label: string; count: number; isChild: boolean }[];
}

@Component({
  selector: 'app-simulation-library',
  templateUrl: './simulation-library.component.html',
  styleUrls: ['./simulation-library.component.scss']
})
export class SimulationLibraryComponent implements OnInit, OnDestroy {
  simulationId = '';
  currentFolder = 'nexuspay';
  searchQuery = '';
  currentView: 'grid' | 'list' = 'grid';
  selectedItemId: string | null = null;
  history: string[] = ['nexuspay'];
  historyIdx = 0;

  folders: Record<string, LibFolder> = {
    nexuspay: {
      label: 'Heron Gate',
      parent: null,
      children: ['policies', 'technical', 'team', 'submissions'],
      files: []
    },
    policies: {
      label: 'Client Brief',
      parent: 'nexuspay',
      files: [
        { id: 'pol-comp', name: 'Heron Gate — Client Instruction Letter', icon: '📄', type: 'PDF', date: '2025-06-02', size: '86 KB' },
        { id: 'pol-data', name: 'Site Visit Notes — 3 June', icon: '📄', type: 'PDF', date: '2025-06-03', size: '54 KB' }
      ]
    },
    technical: {
      label: 'Equipment Data',
      parent: 'nexuspay',
      files: [
        { id: 'tech-api', name: 'Baltimore Aircoil VTL Series — Product Datasheet', icon: '📄', type: 'PDF', date: '2025-06-01', size: '2.4 MB' },
        { id: 'tech-db', name: 'VTL Cooling Tower — Performance Curves', icon: '📊', type: 'PDF', date: '2025-06-01', size: '1.1 MB' },
        { id: 'tech-arch', name: 'Drift Eliminator Spec — Model DE-47', icon: '📄', type: 'PDF', date: '2025-06-01', size: '340 KB', lockedUntil: 'compliance' }
      ]
    },
    team: {
      label: 'Site Information',
      parent: 'nexuspay',
      files: [
        { id: 'team-ev', name: 'Site Photos — Cooling Tower Installation', icon: '🖼️', type: 'IMG', date: '2025-06-03', size: '8.2 MB' },
        { id: 'team-mr', name: 'Plant Room Layout — Heron Gate', icon: '📐', type: 'DWG', date: '2025-06-01', size: '4.6 MB' },
        { id: 'team-ps', name: 'Water Treatment Report — Heron Gate 2023', icon: '📄', type: 'PDF', date: '2023-11-15', size: '920 KB' }
      ]
    },
    submissions: {
      label: 'My Submissions',
      parent: 'nexuspay',
      files: []
    },
    acquisition: {
      label: 'Reference Standards',
      parent: null,
      files: [
        { id: 'reg-apra', name: 'ASHRAE Handbook — Systems & Equipment Ch.40 (Excerpts)', icon: '📋', type: 'PDF', date: '2025-01-01', size: '1.8 MB' },
        { id: 'reg-asic', name: 'BSRIA BG 50 — Water Treatment for Closed Systems (Summary)', icon: '📋', type: 'PDF', date: '2025-01-01', size: '620 KB' },
        { id: 'reg-aml', name: 'HSE ACOP L8 — Legionella Risk Summary', icon: '📋', type: 'PDF', date: '2025-01-01', size: '410 KB' },
        { id: 'reg-dead', name: 'CTI Standard ATC-140 — Cooling Tower Drift (Excerpts)', icon: '📋', type: 'PDF', date: '2025-01-01', size: '540 KB' },
        { id: 'mig-plan', name: "Marcus's Notes on Drift Loss", icon: '📄', type: 'PDF', date: '2025-06-01', size: '28 KB', lockedUntil: 'migration' }
      ]
    },
    templates: {
      label: 'Meridian Internal',
      parent: null,
      files: [
        { id: 'tpl-email', name: 'Meridian Calculation Sheet Template', icon: '📄', type: 'XLSX', date: '2025-01-01', size: '45 KB' },
        { id: 'tpl-esc', name: 'Junior Engineer Guide — How We Do Things', icon: '📄', type: 'PDF', date: '2025-01-01', size: '112 KB' }
      ]
    }
  };

  treeSections: TreeSection[] = [];

  private taskSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskProgressionService
  ) {}

  ngOnInit(): void {
    this.simulationId = this.route.parent?.snapshot.paramMap.get('id') || '';
    this.buildTree();

    this.taskSub = this.taskService.taskCompleted$.subscribe(() => {});
  }

  ngOnDestroy(): void {
    if (this.taskSub) this.taskSub.unsubscribe();
  }

  isFileLocked(file: LibFile): boolean {
    if (!file.lockedUntil) return false;
    return !this.taskService.isTaskComplete(file.lockedUntil);
  }

  private buildTree(): void {
    this.treeSections = [
      {
        label: 'Heron Gate — Project Documents',
        items: [
          { id: 'nexuspay', label: 'Heron Gate', count: 0, isChild: false },
          { id: 'policies', label: 'Client Brief', count: this.folders['policies'].files.length, isChild: true },
          { id: 'technical', label: 'Equipment Data', count: this.folders['technical'].files.length, isChild: true },
          { id: 'team', label: 'Site Information', count: this.folders['team'].files.length, isChild: true },
          { id: 'submissions', label: 'My Submissions', count: this.folders['submissions'].files.length, isChild: true }
        ]
      },
      {
        label: 'Reference Standards',
        items: [
          { id: 'acquisition', label: 'Reference Standards', count: this.folders['acquisition'].files.length, isChild: false }
        ]
      },
      {
        label: 'Meridian Internal',
        items: [
          { id: 'templates', label: 'Meridian Internal', count: this.folders['templates'].files.length, isChild: false }
        ]
      }
    ];
  }

  get folder(): LibFolder | null {
    return this.folders[this.currentFolder] || null;
  }

  get breadcrumbs(): { label: string; folderId?: string }[] {
    const crumbs: { label: string; folderId?: string }[] = [{ label: 'Library', folderId: 'nexuspay' }];
    if (this.folder && this.folder.parent) {
      const parent = this.folders[this.folder.parent];
      if (parent) crumbs.push({ label: parent.label, folderId: this.folder.parent });
      crumbs.push({ label: this.folder.label });
    } else if (this.currentFolder !== 'nexuspay') {
      crumbs.push({ label: this.folder?.label || '' });
    }
    return crumbs;
  }

  get subfolders(): { id: string; label: string }[] {
    const f = this.folder;
    if (!f || !f.children) return [];
    return f.children.map(cid => ({
      id: cid,
      label: this.folders[cid]?.label || cid
    }));
  }

  get files(): LibFile[] {
    const f = this.folder;
    if (!f) return [];
    if (!this.searchQuery.trim()) return f.files;
    const q = this.searchQuery.toLowerCase();
    return f.files.filter(file => file.name.toLowerCase().includes(q));
  }

  get totalItems(): number {
    return this.subfolders.length + this.files.length;
  }

  get statusText(): string {
    return `${this.totalItems} item${this.totalItems !== 1 ? 's' : ''}`;
  }

  get statusSelection(): string {
    return this.selectedItemId ? '1 item selected' : 'Nothing selected';
  }

  selectFolder(folderId: string): void {
    this.currentFolder = folderId;
    this.selectedItemId = null;
    this.searchQuery = '';
    // Push to history
    if (this.history[this.historyIdx] !== folderId) {
      this.history = this.history.slice(0, this.historyIdx + 1);
      this.history.push(folderId);
      this.historyIdx = this.history.length - 1;
    }
  }

  navigateBack(): void {
    if (this.historyIdx > 0) {
      this.historyIdx--;
      this.currentFolder = this.history[this.historyIdx];
      this.selectedItemId = null;
    }
  }

  navigateForward(): void {
    if (this.historyIdx < this.history.length - 1) {
      this.historyIdx++;
      this.currentFolder = this.history[this.historyIdx];
      this.selectedItemId = null;
    }
  }

  navigateUp(): void {
    if (this.folder?.parent) {
      this.selectFolder(this.folder.parent);
    }
  }

  goToBreadcrumb(folderId?: string): void {
    if (folderId) this.selectFolder(folderId);
  }

  selectItem(id: string, file?: LibFile): void {
    if (file && this.isFileLocked(file)) return;
    this.selectedItemId = this.selectedItemId === id ? null : id;
  }

  setView(view: 'grid' | 'list'): void {
    this.currentView = view;
  }

  minimiseLibrary(): void {
    const base = `/student-portal/simulations/${this.simulationId}`;
    this.router.navigateByUrl(`${base}/intro`);
  }
}
