import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-text-renderer',
  template: `<div [innerHTML]="value"></div>`,
})
export class TextRendererComponent implements ICellRendererAngularComp {
  value: string;

  agInit(params: any): void {
    this.value = params.value ?? '-';
  }

  refresh(params: any): boolean {
    this.value = params.value ?? '-';
    return true;
  }
}
