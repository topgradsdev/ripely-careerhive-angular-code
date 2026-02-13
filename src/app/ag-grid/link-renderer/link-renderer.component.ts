import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-link-renderer',
  template: `
    <ng-container *ngIf="files?.length">
      <div *ngFor="let file of files" class="file-row">
        <a
          [href]="file.url"
          target="_blank"
          rel="noopener noreferrer"
          [title]="file.name"
        >
          {{ file.name }}
        </a>
      </div>
    </ng-container>
  `,
  styles: [`
    .file-row {
      max-width: 100%;
    }

    a {
      display: block;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      color: #007bff;
      text-decoration: underline;
      cursor: pointer;
    }
  `]
})

export class LinkRendererComponent implements ICellRendererAngularComp {
  files: Array<{ url: string; name: string }> = [];

  agInit(params: any): void {
    if (Array.isArray(params.value)) {
      this.files = params.value.map((f: any) => ({
        url: f.url,
        name: f.name
      }));
    } else if (params.value?.url && params.value?.name) {
      this.files = [params.value];
    }
  }

  refresh(params: any): boolean {
    this.agInit(params);
    return true;
  }
}
