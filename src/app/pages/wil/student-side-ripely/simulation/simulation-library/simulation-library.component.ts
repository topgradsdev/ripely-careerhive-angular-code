import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface LibFile {
  name: string;
  type: string;
  icon: string;
  size: string;
  pages?: number;
}

interface Folder {
  id: string;
  name: string;
  icon: string;
  expanded: boolean;
  files: LibFile[];
}

@Component({
  selector: 'app-simulation-library',
  templateUrl: './simulation-library.component.html',
  styleUrls: ['./simulation-library.component.scss']
})
export class SimulationLibraryComponent implements OnInit {
  simulationId = '';
  searchQuery = '';
  activeFolder = 'site-docs';

  folders: Folder[] = [
    {
      id: 'site-docs',
      name: 'Site Documents',
      icon: 'fa-folder',
      expanded: true,
      files: [
        { name: 'Client Instruction Letter', type: 'PDF', icon: 'fa-file-pdf-o', size: '1.2 MB', pages: 4 },
        { name: 'Site Visit Notes', type: 'PDF', icon: 'fa-file-pdf-o', size: '890 KB', pages: 12 }
      ]
    },
    {
      id: 'equipment',
      name: 'Equipment Specs',
      icon: 'fa-folder',
      expanded: false,
      files: [
        { name: 'BAC VXT-1520 Datasheet', type: 'PDF', icon: 'fa-file-pdf-o', size: '2.4 MB', pages: 8 },
        { name: 'DE-47 Spec Sheet', type: 'PDF', icon: 'fa-file-pdf-o', size: '1.8 MB', pages: 6 }
      ]
    },
    {
      id: 'standards',
      name: 'Standards',
      icon: 'fa-folder',
      expanded: false,
      files: [
        { name: 'ASHRAE Reference Guide', type: 'PDF', icon: 'fa-file-pdf-o', size: '5.1 MB', pages: 42 }
      ]
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: 'fa-folder',
      expanded: false,
      files: [
        { name: 'Water Treatment Report 2023', type: 'PDF', icon: 'fa-file-pdf-o', size: '3.6 MB', pages: 24 }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.simulationId = this.route.parent?.snapshot.paramMap.get('id') || '';
  }

  get activeFiles(): LibFile[] {
    const folder = this.folders.find(f => f.id === this.activeFolder);
    if (!folder) return [];
    if (!this.searchQuery.trim()) return folder.files;
    const q = this.searchQuery.toLowerCase();
    return folder.files.filter(f => f.name.toLowerCase().includes(q));
  }

  get activeFolderName(): string {
    const folder = this.folders.find(f => f.id === this.activeFolder);
    return folder ? folder.name : '';
  }

  get totalFiles(): number {
    return this.folders.reduce((sum, f) => sum + f.files.length, 0);
  }

  selectFolder(id: string): void {
    this.activeFolder = id;
    this.folders.forEach(f => f.expanded = f.id === id);
  }

  getFileTypeColor(type: string): string {
    switch (type) {
      case 'PDF': return '#d63031';
      case 'Excel': return '#00b894';
      case 'Word': return '#3498db';
      default: return '#9090a8';
    }
  }
}
